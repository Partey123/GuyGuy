package db

import (
	"context"
	"errors"

	"gorm.io/gorm"
	"guyguy/backend/internal/models"
)

// UserRepo handles user database operations
type UserRepo struct {
	db *gorm.DB
}

func NewUserRepo(client *Client) *UserRepo {
	return &UserRepo{db: client.DB}
}

// GetByID retrieves a user by ID
func (r *UserRepo) GetByID(ctx context.Context, id string) (*models.User, error) {
	user := &models.User{}
	err := r.db.WithContext(ctx).Where("id = ?", id).First(user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return user, nil
}

// GetByPhone retrieves a user by phone
func (r *UserRepo) GetByPhone(ctx context.Context, phone string) (*models.User, error) {
	user := &models.User{}
	err := r.db.WithContext(ctx).Where("phone = ?", phone).First(user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return user, nil
}

// Create creates a new user
func (r *UserRepo) Create(ctx context.Context, user *models.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

// Update updates a user
func (r *UserRepo) Update(ctx context.Context, id string, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).Model(&models.User{}).Where("id = ?", id).Updates(updates).Error
}

// List retrieves all users with pagination
func (r *UserRepo) List(ctx context.Context, limit, offset int) ([]*models.User, error) {
	var users []*models.User
	err := r.db.WithContext(ctx).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&users).Error
	return users, err
