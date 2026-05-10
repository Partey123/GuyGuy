package db

import (
	"context"
	"errors"

	"guyguy/backend/internal/models"

	"gorm.io/gorm"
)

// ArtisanRepo handles artisan profile database operations
type ArtisanRepo struct {
	db *gorm.DB
}

func NewArtisanRepo(client *Client) *ArtisanRepo {
	return &ArtisanRepo{db: client.DB}
}

// GetByID retrieves an artisan profile by ID
func (r *ArtisanRepo) GetByID(ctx context.Context, id string) (*models.ArtisanProfile, error) {
	profile := &models.ArtisanProfile{}
	err := r.db.WithContext(ctx).Where("id = ?", id).First(profile).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return profile, nil
}

// GetByUserID retrieves an artisan profile by user ID
func (r *ArtisanRepo) GetByUserID(ctx context.Context, userID string) (*models.ArtisanProfile, error) {
	profile := &models.ArtisanProfile{}
	err := r.db.WithContext(ctx).Where("user_id = ?", userID).First(profile).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return profile, nil
}

// Create creates a new artisan profile
func (r *ArtisanRepo) Create(ctx context.Context, profile *models.ArtisanProfile) error {
	return r.db.WithContext(ctx).Create(profile).Error
}

// Update updates an artisan profile
func (r *ArtisanRepo) Update(ctx context.Context, id string, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).Model(&models.ArtisanProfile{}).Where("id = ?", id).Updates(updates).Error
}

// List retrieves artisan profiles with filtering and pagination
func (r *ArtisanRepo) List(ctx context.Context, filters map[string]interface{}, limit, offset int) ([]*models.ArtisanProfile, error) {
	var profiles []*models.ArtisanProfile
	query := r.db.WithContext(ctx)

	if status, ok := filters["verification_status"]; ok {
		query = query.Where("verification_status = ?", status)
	}
	if isAvailable, ok := filters["is_available"]; ok {
		query = query.Where("is_available = ?", isAvailable)
	}
	if skillCategory, ok := filters["skill_category"]; ok {
		query = query.Where("skill_category = ?", skillCategory)
	}

	err := query.
		Order("rating_average DESC, jobs_completed DESC").
		Limit(limit).
		Offset(offset).
		Find(&profiles).Error

	return profiles, err
}
