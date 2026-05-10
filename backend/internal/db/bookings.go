package db

import (
	"context"
	"errors"

	"guyguy/backend/internal/models"

	"gorm.io/gorm"
)

// BookingRepo handles booking database operations
type BookingRepo struct {
	db *gorm.DB
}

func NewBookingRepo(client *Client) *BookingRepo {
	return &BookingRepo{db: client.DB}
}

// GetByID retrieves a booking by ID
func (r *BookingRepo) GetByID(ctx context.Context, id string) (*models.Booking, error) {
	booking := &models.Booking{}
	err := r.db.WithContext(ctx).Where("id = ?", id).First(booking).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return booking, nil
}

// Create creates a new booking
func (r *BookingRepo) Create(ctx context.Context, booking *models.Booking) error {
	return r.db.WithContext(ctx).Create(booking).Error
}

// Update updates a booking
func (r *BookingRepo) Update(ctx context.Context, id string, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).Model(&models.Booking{}).Where("id = ?", id).Updates(updates).Error
}

// ListByClientID retrieves bookings for a client
func (r *BookingRepo) ListByClientID(ctx context.Context, clientID string, limit, offset int) ([]*models.Booking, error) {
	var bookings []*models.Booking
	err := r.db.WithContext(ctx).
		Where("client_id = ?", clientID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&bookings).Error
	return bookings, err
}

// ListByArtisanID retrieves bookings for an artisan
func (r *BookingRepo) ListByArtisanID(ctx context.Context, artisanID string, limit, offset int) ([]*models.Booking, error) {
	var bookings []*models.Booking
	err := r.db.WithContext(ctx).
		Where("artisan_id = ?", artisanID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&bookings).Error
	return bookings, err
}

// ListByStatus retrieves bookings by status with pagination
func (r *BookingRepo) ListByStatus(ctx context.Context, status string, limit, offset int) ([]*models.Booking, error) {
	var bookings []*models.Booking
	err := r.db.WithContext(ctx).
		Where("status = ?", status).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&bookings).Error
	return bookings, err
}
