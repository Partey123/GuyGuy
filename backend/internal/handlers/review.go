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

// ReviewHandler handles review endpoints
type ReviewHandler struct {
	reviewRepo  *db.ReviewRepo
	bookingRepo *db.BookingRepo
	log         *zap.Logger
}

func NewReviewHandler(client *db.Client, log *zap.Logger) *ReviewHandler {
	return &ReviewHandler{
		reviewRepo:  db.NewReviewRepo(client),
		bookingRepo: db.NewBookingRepo(client),
		log:         log,
	}
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

	ctx := context.Background()
	booking, err := h.bookingRepo.GetByID(ctx, req.BookingID)
	if err != nil {
		h.log.Error("failed to get booking", zap.Error(err))
		response.ServerError(c, "failed to fetch booking")
		return
	}

	if booking == nil {
		response.NotFound(c, "booking not found")
		return
	}

	// Only client can review artisan, and only after booking is completed
	if booking.ClientID != userID {
		response.Forbidden(c, "only client can review this booking")
		return
	}

	if booking.Status != "completed" {
		response.BadRequest(c, "can only review completed bookings")
		return
	}

	// Check if review already exists
	existing, err := h.reviewRepo.GetByBookingID(ctx, req.BookingID)
	if err != nil {
		h.log.Error("failed to check existing review", zap.Error(err))
		response.ServerError(c, "failed to create review")
		return
	}

	if existing != nil {
		response.BadRequest(c, "review already exists for this booking")
		return
	}

	review := &models.Review{
		ID:        uuid.New().String(),
		BookingID: req.BookingID,
		ClientID:  userID.(string),
		ArtisanID: booking.ArtisanID,
		Rating:    req.Rating,
		Comment:   req.Comment,
	}

	err = h.reviewRepo.Create(ctx, review)
	if err != nil {
		h.log.Error("failed to create review", zap.Error(err))
		response.ServerError(c, "failed to create review")
		return
	}

	response.Created(c, review)
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

	ctx := context.Background()
	reviews, err := h.reviewRepo.ListByArtisanID(ctx, artisanID, limit, offset)
	if err != nil {
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
