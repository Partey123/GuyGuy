package db

import (
	"context"
	"errors"

	"guyguy/backend/internal/models"

	"gorm.io/gorm"
)

// ReviewRepo handles review database operations
type ReviewRepo struct {
	db *gorm.DB
}

func NewReviewRepo(client *Client) *ReviewRepo {
	return &ReviewRepo{db: client.DB}
}

// GetByID retrieves a review by ID
func (r *ReviewRepo) GetByID(ctx context.Context, id string) (*models.Review, error) {
	review := &models.Review{}
	err := r.db.WithContext(ctx).Where("id = ?", id).First(review).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return review, nil
}

// GetByBookingID retrieves a review by booking ID (one per booking)
func (r *ReviewRepo) GetByBookingID(ctx context.Context, bookingID string) (*models.Review, error) {
	review := &models.Review{}
	err := r.db.WithContext(ctx).Where("booking_id = ?", bookingID).First(review).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return review, nil
}

// Create creates a new review
func (r *ReviewRepo) Create(ctx context.Context, review *models.Review) error {
	return r.db.WithContext(ctx).Create(review).Error
}

// ListByArtisanID retrieves reviews for an artisan
func (r *ReviewRepo) ListByArtisanID(ctx context.Context, artisanID string, limit, offset int) ([]*models.Review, error) {
	var reviews []*models.Review
	err := r.db.WithContext(ctx).
		Where("artisan_id = ?", artisanID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error
	return reviews, err
}
