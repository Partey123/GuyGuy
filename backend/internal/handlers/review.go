package handlers

import (
	"context"
	"fmt"

	"guyguy/backend/internal/models"
	"guyguy/backend/pkg/response"
	"guyguy/backend/pkg/supabase"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// ReviewHandler handles review endpoints
type ReviewHandler struct {
	supabaseClient *supabase.Client
	log            *zap.Logger
}

func NewReviewHandler(supabaseClient *supabase.Client, log *zap.Logger) *ReviewHandler {
	return &ReviewHandler{
		supabaseClient: supabaseClient,
		log:            log,
	}
}

func (h *ReviewHandler) getBookingByID(ctx context.Context, id string) (*models.Booking, error) {
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

func (h *ReviewHandler) getReviewByBookingID(ctx context.Context, bookingID string) (*models.Review, error) {
	var reviews []models.Review
	_, err := h.supabaseClient.GetSupabaseClient().From("reviews").Select("*", "", false).Eq("booking_id", bookingID).Limit(1, "").ExecuteTo(&reviews)
	if err != nil {
		return nil, err
	}
	if len(reviews) == 0 {
		return nil, nil
	}
	return &reviews[0], nil
}

// Create creates a new review for a booking
func (h *ReviewHandler) Create(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	var req struct {
		BookingID string `json:"booking_id" binding:"required"`
		Rating    int    `json:"rating" binding:"required,min=1,max=5"`
		Comment   string `json:"comment"`
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

	if booking == nil {
		response.NotFound(c, "booking not found")
		return
	}

	if booking.ClientID != userID.(string) {
		response.Forbidden(c, "only client can review this booking")
		return
	}

	if booking.Status != "completed" {
		response.BadRequest(c, "can only review completed bookings")
		return
	}

	existingReview, err := h.getReviewByBookingID(context.Background(), req.BookingID)
	if err != nil {
		h.log.Error("failed to check existing review", zap.Error(err))
		response.ServerError(c, "failed to create review")
		return
	}

	if existingReview != nil {
		response.BadRequest(c, "review already exists for this booking")
		return
	}

	var commentPtr *string
	if req.Comment != "" {
		commentPtr = &req.Comment
	}

	review := &models.Review{
		ID:        uuid.New().String(),
		BookingID: req.BookingID,
		ClientID:  userID.(string),
		ArtisanID: booking.ArtisanID,
		Rating:    req.Rating,
		Comment:   commentPtr,
	}

	var created []models.Review
	if _, err := h.supabaseClient.GetSupabaseClient().From("reviews").Insert(review, false, "", "representation", "").ExecuteTo(&created); err != nil {
		h.log.Error("failed to create review", zap.Error(err))
		response.ServerError(c, "failed to create review")
		return
	}

	response.Created(c, created[0])
}

// ListByArtisan retrieves reviews for an artisan
func (h *ReviewHandler) ListByArtisan(c *gin.Context) {
	artisanID := c.Param("artisan_id")
	limit := 10
	offset := 0

	if l := c.Query("limit"); l != "" {
		fmt.Sscanf(l, "%d", &limit)
	}
	if o := c.Query("offset"); o != "" {
		fmt.Sscanf(o, "%d", &offset)
	}

	var reviews []models.Review
	if _, err := h.supabaseClient.GetSupabaseClient().From("reviews").Select("*", "", false).Eq("artisan_id", artisanID).Range(offset, offset+limit-1, "").ExecuteTo(&reviews); err != nil {
		h.log.Error("failed to list reviews", zap.Error(err))
		response.ServerError(c, "failed to fetch reviews")
		return
	}

	response.OK(c, gin.H{
		"data":   reviews,
		"count":  len(reviews),
		"limit":  limit,
		"offset": offset,
	})
}
