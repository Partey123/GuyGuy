package db

import (
	"fmt"
	"time"

	"guyguy/backend/internal/config"
	"guyguy/backend/internal/models"

	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Client is the GORM database client
type Client struct {
	DB *gorm.DB
}

// New creates a new GORM database client and connects to the database
func New(cfg config.Config, log *zap.Logger) (*Client, error) {
	dsn := cfg.DatabaseURL
	if dsn == "" {
		return nil, fmt.Errorf("DATABASE_URL is not set")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Get underlying SQL database for connection pool settings
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get database instance: %w", err)
	}

	// Set connection pool settings
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Info("database connected")

	return &Client{DB: db}, nil
}

// Close closes the database connection
func (c *Client) Close() error {
	sqlDB, err := c.DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}

// Migrate runs database migrations for all models
// Note: In production, use proper migration tools like golang-migrate or Flyway
// This is for development and testing only
func (c *Client) Migrate() error {
	return c.DB.AutoMigrate(
		&models.User{},
		&models.ArtisanProfile{},
		&models.Booking{},
		&models.Payment{},
		&models.Message{},
		&models.Review{},
		&models.Notification{},
	)
}
