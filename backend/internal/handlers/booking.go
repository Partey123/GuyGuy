package handlers

import (
	"context"
	"fmt"
	"time"

	"guyguy/backend/internal/db"
	"guyguy/backend/internal/models"
	"guyguy/backend/pkg/response"

	"github.com/gin-gonic/gin"
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
		ArtisanID       string  `json:"artisan_id" binding:"required"`
		Title           string  `json:"title" binding:"required"`
		Description     string  `json:"description" binding:"required"`
		JobType         string  `json:"job_type"`
		LabourAmount    float64 `json:"labour_amount" binding:"required"`
		MaterialsAmount float64 `json:"materials_amount"`
		LocationAddress *string `json:"location_address" binding:"required"`
		ScheduledDate   string  `json:"scheduled_date"`
		ScheduledTime   string  `json:"scheduled_time"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid request body")
		return
	}

	// Parse scheduled date if provided
	var scheduledDate *time.Time
	if req.ScheduledDate != "" {
		if parsedDate, err := time.Parse("2006-01-02", req.ScheduledDate); err == nil {
			scheduledDate = &parsedDate
		}
	}

	booking := &models.Booking{
		ClientID:        userID.(string),
		ArtisanID:       req.ArtisanID,
		Title:           req.Title,
		Description:     req.Description,
		JobType:         req.JobType,
		LabourAmount:    req.LabourAmount,
		MaterialsAmount: req.MaterialsAmount,
		TotalAmount:     req.LabourAmount + req.MaterialsAmount,
		LocationAddress: req.LocationAddress,
		ScheduledDate:   scheduledDate,
		ScheduledTime:   &req.ScheduledTime,
		Status:          "pending",
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
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
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

	// Check authorization - only client and artisan can view
	if booking.ClientID != userID.(string) && booking.ArtisanID != userID.(string) {
		response.Forbidden(c, "you cannot access this booking")
		return
	}

	response.OK(c, booking)
}

// ListByStatus retrieves bookings by status for the authenticated user
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
	// Get user's role to determine which bookings to fetch
	userRole, _ := c.Get("role")

	var bookings []*models.Booking
	var err error

	// If user is an artisan, get their bookings; if client, get their bookings
	if userRole == "artisan" {
		bookings, err = h.bookingRepo.ListByArtisanID(ctx, userID.(string), limit, offset)
	} else {
		// Default to client bookings
		bookings, err = h.bookingRepo.ListByClientID(ctx, userID.(string), limit, offset)
	}

	if err != nil {
		h.log.Error("failed to list bookings", zap.Error(err))
		response.ServerError(c, "failed to fetch bookings")
		return
	}

	// Filter by status if specified
	if status != "all" {
		var filteredBookings []*models.Booking
		for _, booking := range bookings {
			if booking.Status == status {
				filteredBookings = append(filteredBookings, booking)
			}
		}
		bookings = filteredBookings
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
