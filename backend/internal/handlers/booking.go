package handlers

import (
	"context"
	"fmt"
	"time"

	"guyguy/backend/internal/models"
	"guyguy/backend/pkg/response"
	"guyguy/backend/pkg/supabase"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// BookingHandler handles booking endpoints
type BookingHandler struct {
	supabaseClient *supabase.Client
	log            *zap.Logger
}

func NewBookingHandler(supabaseClient *supabase.Client, log *zap.Logger) *BookingHandler {
	return &BookingHandler{
		supabaseClient: supabaseClient,
		log:            log,
	}
}

func (h *BookingHandler) getBookingByID(ctx context.Context, id string) (*models.Booking, error) {
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

	var created []models.Booking
	if _, err := h.supabaseClient.GetSupabaseClient().From("bookings").Insert(booking, false, "", "representation", "").ExecuteTo(&created); err != nil {
		h.log.Error("failed to create booking", zap.Error(err))
		response.ServerError(c, "failed to create booking")
		return
	}

	if len(created) == 0 {
		response.ServerError(c, "failed to create booking")
		return
	}

	response.Created(c, created[0])
}

// GetByID retrieves a booking
func (h *BookingHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	booking, err := h.getBookingByID(context.Background(), id)
	if err != nil {
		h.log.Error("failed to get booking", zap.Error(err))
		response.ServerError(c, "failed to fetch booking")
		return
	}

	if booking == nil {
		response.NotFound(c, "booking not found")
		return
	}

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

	if l := c.Query("limit"); l != "" {
		fmt.Sscanf(l, "%d", &limit)
	}

	userRole, _ := c.Get("role")

	var bookings []models.Booking
	query := h.supabaseClient.GetSupabaseClient().From("bookings").Select("*", "", false).Limit(limit, "")
	if userRole == "artisan" {
		query = query.Eq("artisan_id", userID.(string))
	} else {
		query = query.Eq("client_id", userID.(string))
	}

	if status != "all" {
		query = query.Eq("status", status)
	}

	if _, err := query.ExecuteTo(&bookings); err != nil {
		h.log.Error("failed to list bookings", zap.Error(err))
		response.ServerError(c, "failed to fetch bookings")
		return
	}

	response.OK(c, gin.H{
		"data":   bookings,
		"count":  len(bookings),
		"limit":  limit,
		"offset": 0,
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

	booking, err := h.getBookingByID(context.Background(), id)
	if err != nil {
		h.log.Error("failed to get booking", zap.Error(err))
		response.ServerError(c, "failed to fetch booking")
		return
	}

	if booking == nil {
		response.NotFound(c, "booking not found")
		return
	}

	if req.Status != "pending" && booking.ArtisanID != userID.(string) {
		response.Forbidden(c, "only artisan can update booking status")
		return
	}

	if _, err := h.supabaseClient.GetSupabaseClient().From("bookings").Update(map[string]interface{}{
		"status": req.Status,
	}, "representation", "").Eq("id", id).ExecuteTo(&[]models.Booking{}); err != nil {
		h.log.Error("failed to update booking", zap.Error(err))
		response.ServerError(c, "failed to update booking")
		return
	}

	response.OK(c, gin.H{"message": "booking status updated"})
}
