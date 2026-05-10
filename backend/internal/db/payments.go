package db

import (
	"context"
	"errors"

	"guyguy/backend/internal/models"

	"gorm.io/gorm"
)

// PaymentRepo handles payment database operations
type PaymentRepo struct {
	db *gorm.DB
}

func NewPaymentRepo(client *Client) *PaymentRepo {
	return &PaymentRepo{db: client.DB}
}

// GetByID retrieves a payment by ID
func (r *PaymentRepo) GetByID(ctx context.Context, id string) (*models.Payment, error) {
	payment := &models.Payment{}
	err := r.db.WithContext(ctx).Where("id = ?", id).First(payment).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return payment, nil
}

// GetByReference retrieves a payment by Paystack reference
func (r *PaymentRepo) GetByReference(ctx context.Context, reference string) (*models.Payment, error) {
	payment := &models.Payment{}
	err := r.db.WithContext(ctx).Where("paystack_reference = ?", reference).First(payment).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return payment, nil
}

// GetByBookingID retrieves payments for a booking
func (r *PaymentRepo) GetByBookingID(ctx context.Context, bookingID string) (*models.Payment, error) {
	payment := &models.Payment{}
	err := r.db.WithContext(ctx).Where("booking_id = ?", bookingID).First(payment).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return payment, nil
}

// Create creates a new payment
func (r *PaymentRepo) Create(ctx context.Context, payment *models.Payment) error {
	return r.db.WithContext(ctx).Create(payment).Error
}

// Update updates a payment
func (r *PaymentRepo) Update(ctx context.Context, id string, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).Model(&models.Payment{}).Where("id = ?", id).Updates(updates).Error
}

// List retrieves payments with pagination
func (r *PaymentRepo) List(ctx context.Context, limit, offset int) ([]*models.Payment, error) {
	var payments []*models.Payment
	err := r.db.WithContext(ctx).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&payments).Error
	return payments, err
}
