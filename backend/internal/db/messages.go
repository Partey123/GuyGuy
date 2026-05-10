package db

import (
	"context"
	"errors"

	"guyguy/backend/internal/models"

	"gorm.io/gorm"
)

// MessageRepo handles message database operations
type MessageRepo struct {
	db *gorm.DB
}

func NewMessageRepo(client *Client) *MessageRepo {
	return &MessageRepo{db: client.DB}
}

// GetByID retrieves a message by ID
func (r *MessageRepo) GetByID(ctx context.Context, id string) (*models.Message, error) {
	message := &models.Message{}
	err := r.db.WithContext(ctx).Where("id = ?", id).First(message).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return message, nil
}

// Create creates a new message
func (r *MessageRepo) Create(ctx context.Context, message *models.Message) error {
	return r.db.WithContext(ctx).Create(message).Error
}

// ListByBookingID retrieves messages for a booking
func (r *MessageRepo) ListByBookingID(ctx context.Context, bookingID string, limit, offset int) ([]*models.Message, error) {
	var messages []*models.Message
	err := r.db.WithContext(ctx).
		Where("booking_id = ?", bookingID).
		Order("created_at ASC").
		Limit(limit).
		Offset(offset).
		Find(&messages).Error
	return messages, err
}

// MarkAsRead marks a message as read
func (r *MessageRepo) MarkAsRead(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Model(&models.Message{}).Where("id = ?", id).Update("is_read", true).Error
}
