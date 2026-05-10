package supabase

import (
	"fmt"
	"os"

	"github.com/supabase-community/supabase-go"
	"go.uber.org/zap"
)

// Client wraps the Supabase client with additional functionality
type Client struct {
	supabase *supabase.Client
	jwtSecret string
	log       *zap.Logger
}

// Config holds Supabase configuration
type Config struct {
	URL            string
	ServiceRoleKey string
	JWTSecret      string
}

// New creates a new Supabase client
func New(cfg Config, log *zap.Logger) (*Client, error) {
	if cfg.URL == "" || cfg.ServiceRoleKey == "" {
		return nil, fmt.Errorf("supabase URL and service role key are required")
	}

	supabaseClient, err := supabase.NewClient(cfg.URL, cfg.ServiceRoleKey, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create supabase client: %w", err)
	}

	log.Info("supabase client initialized", 
		zap.String("url", cfg.URL),
		zap.Bool("has_jwt_secret", cfg.JWTSecret != ""))

	return &Client{
		supabase: supabaseClient,
		jwtSecret: cfg.JWTSecret,
		log:       log,
	}, nil
}

// GetSupabaseClient returns the underlying Supabase client
func (c *Client) GetSupabaseClient() *supabase.Client {
	return c.supabase
}

// GetJWTSecret returns the JWT secret for token validation
func (c *Client) GetJWTSecret() string {
	return c.jwtSecret
}

// FromEnv creates a new Supabase client from environment variables
func FromEnv(log *zap.Logger) (*Client, error) {
	cfg := Config{
		URL:            os.Getenv("SUPABASE_URL"),
		ServiceRoleKey: os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
		JWTSecret:      os.Getenv("SUPABASE_JWT_SECRET"),
	}

	return New(cfg, log)
}
