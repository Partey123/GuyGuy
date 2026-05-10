package handlers

import (
	"context"

	"guyguy/backend/internal/models"
	"guyguy/backend/pkg/response"
	"guyguy/backend/pkg/supabase"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// PaymentHandler handles payment endpoints
type PaymentHandler struct {
	supabaseClient *supabase.Client
	log            *zap.Logger
}

func NewPaymentHandler(supabaseClient *supabase.Client, log *zap.Logger) *PaymentHandler {
	return &PaymentHandler{
		supabaseClient: supabaseClient,
		log:            log,
	}
}

func (h *PaymentHandler) getBookingByID(ctx context.Context, id string) (*models.Booking, error) {
	var bookings []models.Booking
	_, err := h.supabaseClient.GetSupabaseClient().From("bookings").Select("*", "", false).Eq("id", id).Limit(1, "").ExecuteTo(&bookings)
	if err != nil {
		return nil, err
	}
	if len(bookings) == 0 {
		return nil, nil
	}
	return &bookings[0], nil
}

func (h *PaymentHandler) getPaymentByReference(ctx context.Context, reference string) (*models.Payment, error) {
	var payments []models.Payment
	_, err := h.supabaseClient.GetSupabaseClient().From("payments").Select("*", "", false).Eq("paystack_reference", reference).Limit(1, "").ExecuteTo(&payments)
	if err != nil {
		return nil, err
	}
	if len(payments) == 0 {
		return nil, nil
	}
	return &payments[0], nil
}

func (h *PaymentHandler) getPaymentByBookingID(ctx context.Context, bookingID string) (*models.Payment, error) {
	var payments []models.Payment
	_, err := h.supabaseClient.GetSupabaseClient().From("payments").Select("*", "", false).Eq("booking_id", bookingID).Limit(1, "").ExecuteTo(&payments)
	if err != nil {
		return nil, err
	}
	if len(payments) == 0 {
		return nil, nil
	}
	return &payments[0], nil
}

// InitiatePayment initiates a payment for a booking
func (h *PaymentHandler) InitiatePayment(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	var req struct {
		BookingID string  `json:"booking_id" binding:"required"`
		Amount    float64 `json:"amount" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid request body")
		return
	}

	booking, err := h.getBookingByID(context.Background(), req.BookingID)
	if err != nil {
		h.log.Error("failed to get booking", zap.Error(err))
		response.ServerError(c, "failed to fetch booking")
		return
	}

	if booking == nil || booking.ClientID != userID.(string) {
		response.NotFound(c, "booking not found")
		return
	}

	commissionAmount := req.Amount * 0.10
	artisanPayoutAmount := req.Amount - commissionAmount

	payment := &models.Payment{
		BookingID:             req.BookingID,
		PayerID:               userID.(string),
		PaystackReference:     uuid.New().String(),
		Amount:                req.Amount,
		CommissionBasisAmount: req.Amount,
		CommissionAmount:      commissionAmount,
		ArtisanPayoutAmount:   artisanPayoutAmount,
		Currency:              "GHS",
		Status:                "pending",
		PayoutStatus:          "pending",
	}

	var created []models.Payment
	if _, err := h.supabaseClient.GetSupabaseClient().From("payments").Insert(payment, false, "", "representation", "").ExecuteTo(&created); err != nil {
		h.log.Error("failed to create payment", zap.Error(err))
		response.ServerError(c, "failed to initiate payment")
		return
	}

	response.Created(c, gin.H{
		"payment_id":            created[0].ID,
		"amount":                created[0].Amount,
		"commission_amount":     created[0].CommissionAmount,
		"artisan_payout_amount": created[0].ArtisanPayoutAmount,
		"status":                created[0].Status,
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

	if webhook.Event != "charge.success" || webhook.Data.Status != "success" {
		response.OK(c, gin.H{"message": "webhook received"})
		return
	}

	existingPayment, err := h.getPaymentByReference(context.Background(), webhook.Data.Reference)
	if err != nil {
		h.log.Error("failed to check existing payment", zap.Error(err))
		response.ServerError(c, "webhook processing failed")
		return
	}

	if existingPayment != nil {
		h.log.Info("webhook already processed", zap.String("reference", webhook.Data.Reference))
		response.OK(c, gin.H{"message": "webhook processed"})
		return
	}

	h.log.Info("payment webhook processed",
		zap.String("reference", webhook.Data.Reference),
		zap.Int("amount", webhook.Data.Amount))

	response.OK(c, gin.H{"message": "webhook processed"})
}

// GetPaymentStatus retrieves payment status
func (h *PaymentHandler) GetPaymentStatus(c *gin.Context) {
	bookingID := c.Param("booking_id")

	payment, err := h.getPaymentByBookingID(context.Background(), bookingID)
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
