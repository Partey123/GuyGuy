package db

import (
	"context"
	"errors"

	"guyguy/backend/internal/models"

	"gorm.io/gorm"
)

// NotificationRepo handles notification database operations
type NotificationRepo struct {
	db *gorm.DB
}

func NewNotificationRepo(client *Client) *NotificationRepo {
	return &NotificationRepo{db: client.DB}
}

// GetByID retrieves a notification by ID
func (r *NotificationRepo) GetByID(ctx context.Context, id string) (*models.Notification, error) {
	notification := &models.Notification{}
	err := r.db.WithContext(ctx).Where("id = ?", id).First(notification).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return notification, nil
}

// Create creates a new notification
func (r *NotificationRepo) Create(ctx context.Context, notification *models.Notification) error {
	return r.db.WithContext(ctx).Create(notification).Error
}

// ListByUserID retrieves notifications for a user
func (r *NotificationRepo) ListByUserID(ctx context.Context, userID string, limit, offset int) ([]*models.Notification, error) {
	var notifications []*models.Notification
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&notifications).Error
	return notifications, err
}

// MarkAsRead marks a notification as read
func (r *NotificationRepo) MarkAsRead(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Model(&models.Notification{}).Where("id = ?", id).Update("is_read", true).Error
}

// MarkAllAsRead marks all user notifications as read
func (r *NotificationRepo) MarkAllAsRead(ctx context.Context, userID string) error {
	return r.db.WithContext(ctx).Model(&models.Notification{}).
		Where("user_id = ?", userID).
		Update("is_read", true).Error
}
