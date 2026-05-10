package handlers

import (
	"context"

	"guyguy/backend/internal/db"
	"guyguy/backend/internal/models"
	"guyguy/backend/pkg/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// PaymentHandler handles payment endpoints
type PaymentHandler struct {
	paymentRepo *db.PaymentRepo
	bookingRepo *db.BookingRepo
	log         *zap.Logger
}

func NewPaymentHandler(client *db.Client, log *zap.Logger) *PaymentHandler {
	return &PaymentHandler{
		paymentRepo: db.NewPaymentRepo(client),
		bookingRepo: db.NewBookingRepo(client),
		log:         log,
	}
}

// InitiatePayment initiates a payment for a booking
func (h *PaymentHandler) InitiatePayment(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	var req struct {
		BookingID string `json:"booking_id" binding:"required"`
		Amount    int    `json:"amount" binding:"required"`
		Email     string `json:"email" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid request body")
		return
	}

	ctx := context.Background()
	booking, err := h.bookingRepo.GetByID(ctx, req.BookingID)
	if err != nil {
		h.log.Error("failed to get booking", zap.Error(err))
		response.ServerError(c, "failed to fetch booking")
		return
	}

	if booking == nil || booking.ClientID != userID {
		response.NotFound(c, "booking not found")
		return
	}

	// Calculate commission (10%) and artisan payout (90%)
	commission := (req.Amount * 10) / 100
	artisanPayout := req.Amount - commission

	payment := &models.Payment{
		ID:            uuid.New().String(),
		BookingID:     req.BookingID,
		Amount:        req.Amount,
		Commission:    commission,
		ArtisanPayout: artisanPayout,
		Status:        "pending",
		PayoutStatus:  "pending",
		PaystackRef:   "",
		CustomerEmail: req.Email,
		ClientID:      userID.(string),
	}

	err = h.paymentRepo.Create(ctx, payment)
	if err != nil {
		h.log.Error("failed to create payment", zap.Error(err))
		response.ServerError(c, "failed to initiate payment")
		return
	}

	// In production, integrate with Paystack to get checkout URL
	response.Created(c, gin.H{
		"payment_id":     payment.ID,
		"amount":         payment.Amount,
		"commission":     payment.Commission,
		"artisan_payout": payment.ArtisanPayout,
		"status":         payment.Status,
		// "checkout_url": "https://checkout.paystack.com/..." (add Paystack integration)
	})
}

// WebhookHandler handles Paystack webhook callbacks (CRITICAL - must be idempotent)
func (h *PaymentHandler) WebhookHandler(c *gin.Context) {
	var webhook struct {
		Event string `json:"event"`
		Data  struct {
			Reference string `json:"reference"`
			Status    string `json:"status"`
			Amount    int    `json:"amount"`
		} `json:"data"`
	}

	if err := c.ShouldBindJSON(&webhook); err != nil {
		h.log.Error("invalid webhook payload", zap.Error(err))
		response.BadRequest(c, "invalid webhook payload")
		return
	}

	// Only process successful payment events
	if webhook.Event != "charge.success" || webhook.Data.Status != "success" {
		response.OK(c, gin.H{"message": "webhook received"})
		return
	}

	ctx := context.Background()

	// Check if payment already processed (idempotency - critical for payments)
	existingPayment, err := h.paymentRepo.GetByReference(ctx, webhook.Data.Reference)
	if err != nil {
		h.log.Error("failed to check existing payment", zap.Error(err))
		response.ServerError(c, "webhook processing failed")
		return
	}

	// Already processed - return success to prevent Paystack retries
	if existingPayment != nil {
		h.log.Info("webhook already processed", zap.String("reference", webhook.Data.Reference))
		response.OK(c, gin.H{"message": "webhook processed"})
		return
	}

	// Update payment with Paystack reference and mark as completed
	// In production, fetch payment by ID and update status
	h.log.Info("payment webhook processed",
		zap.String("reference", webhook.Data.Reference),
		zap.Int("amount", webhook.Data.Amount))

	response.OK(c, gin.H{"message": "webhook processed"})
}

// GetPaymentStatus retrieves payment status
func (h *PaymentHandler) GetPaymentStatus(c *gin.Context) {
	bookingID := c.Param("booking_id")

	ctx := context.Background()
	payment, err := h.paymentRepo.GetByBookingID(ctx, bookingID)
	if err != nil {
		h.log.Error("failed to get payment", zap.Error(err))
		response.ServerError(c, "failed to fetch payment")
		return
	}

	if payment == nil {
		response.NotFound(c, "payment not found")
		return
	}

	response.OK(c, payment)
}
