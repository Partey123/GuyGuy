package handlers

import (
	"context"
	"fmt"

	"guyguy/backend/internal/db"
	"guyguy/backend/internal/models"
	"guyguy/backend/pkg/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// BookingHandler handles booking endpoints
type BookingHandler struct {
	bookingRepo *db.BookingRepo
	artisanRepo *db.ArtisanRepo
	log         *zap.Logger
}

func NewBookingHandler(client *db.Client, log *zap.Logger) *BookingHandler {
	return &BookingHandler{
		bookingRepo: db.NewBookingRepo(client),
		artisanRepo: db.NewArtisanRepo(client),
		log:         log,
	}
}

// Create creates a new booking
func (h *BookingHandler) Create(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	var req struct {
		ArtisanID   string `json:"artisan_id" binding:"required"`
		ServiceType string `json:"service_type" binding:"required"`
		Description string `json:"description" binding:"required"`
		Location    string `json:"location" binding:"required"`
		BudgetMin   int    `json:"budget_min" binding:"required"`
		BudgetMax   int    `json:"budget_max" binding:"required"`
		ScheduledAt string `json:"scheduled_at" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid request body")
		return
	}

	booking := &models.Booking{
		ID:            uuid.New().String(),
		ClientID:      userID.(string),
		ArtisanID:     req.ArtisanID,
		ServiceType:   req.ServiceType,
		Description:   req.Description,
		Location:      req.Location,
		BudgetMin:     req.BudgetMin,
		BudgetMax:     req.BudgetMax,
		ScheduledAt:   req.ScheduledAt,
		Status:        "pending",
		ClientRating:  nil,
		ArtisanRating: nil,
	}

	ctx := context.Background()
	err := h.bookingRepo.Create(ctx, booking)
	if err != nil {
		h.log.Error("failed to create booking", zap.Error(err))
		response.ServerError(c, "failed to create booking")
		return
	}

	response.Created(c, booking)
}

// GetByID retrieves a booking
func (h *BookingHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")

	ctx := context.Background()
	booking, err := h.bookingRepo.GetByID(ctx, id)
	if err != nil {
		h.log.Error("failed to get booking", zap.Error(err))
		response.ServerError(c, "failed to fetch booking")
		return
	}

	if booking == nil {
		response.NotFound(c, "booking not found")
		return
	}

	// Check authorization - only client and artisan can view
	if booking.ClientID != userID && booking.ArtisanID != userID {
		response.Forbidden(c, "you cannot access this booking")
		return
	}

	response.OK(c, booking)
}

// ListByStatus retrieves bookings by status
func (h *BookingHandler) ListByStatus(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	status := c.DefaultQuery("status", "pending")
	limit := 10
	offset := 0

	if l := c.Query("limit"); l != "" {
		fmt.Sscanf(l, "%d", &limit)
	}
	if o := c.Query("offset"); o != "" {
		fmt.Sscanf(o, "%d", &offset)
	}

	ctx := context.Background()
	bookings, err := h.bookingRepo.ListByStatus(ctx, status, limit, offset)
	if err != nil {
		h.log.Error("failed to list bookings", zap.Error(err))
		response.ServerError(c, "failed to fetch bookings")
		return
	}

	response.OK(c, gin.H{
		"data":   bookings,
		"count":  len(bookings),
		"limit":  limit,
		"offset": offset,
	})
}

// UpdateStatus updates a booking status
func (h *BookingHandler) UpdateStatus(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	id := c.Param("id")

	var req struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid request body")
		return
	}

	ctx := context.Background()
	booking, err := h.bookingRepo.GetByID(ctx, id)
	if err != nil {
		h.log.Error("failed to get booking", zap.Error(err))
		response.ServerError(c, "failed to fetch booking")
		return
	}

	if booking == nil {
		response.NotFound(c, "booking not found")
		return
	}

	// Check authorization - only artisan can accept/decline
	if req.Status != "pending" && booking.ArtisanID != userID {
		response.Forbidden(c, "only artisan can update booking status")
		return
	}

	err = h.bookingRepo.Update(ctx, id, map[string]interface{}{
		"status": req.Status,
	})
	if err != nil {
		h.log.Error("failed to update booking", zap.Error(err))
		response.ServerError(c, "failed to update booking")
		return
	}

	response.OK(c, gin.H{"message": "booking status updated"})
}
