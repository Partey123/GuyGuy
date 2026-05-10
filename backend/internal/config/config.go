package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port   string
	AppEnv string

	// Supabase (service role key must never reach frontend)
	SupabaseURL            string
	SupabaseServiceRoleKey string
	SupabaseJWTSecret      string

	DatabaseURL string

	PaystackSecretKey     string
	PaystackWebhookSecret string

	ResendAPIKey    string
	ResendFromEmail string

	ArkeselAPIKey   string
	ArkeselSenderID string

	FirebaseProjectID       string
	FirebaseCredentialsPath string

	GoogleMapsAPIKey string

	CloudinaryCloudName string
	CloudinaryAPIKey    string
	CloudinaryAPISecret string

	SentryDSN string
}

func Load() Config {
	// Local dev convenience; Railway/Vercel inject env directly.
	_ = godotenv.Load()

	return Config{
		Port:   get("PORT", "8080"),
		AppEnv: get("APP_ENV", "development"),

		SupabaseURL:            os.Getenv("SUPABASE_URL"),
		SupabaseServiceRoleKey: os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
		SupabaseJWTSecret:      os.Getenv("SUPABASE_JWT_SECRET"),

		DatabaseURL: os.Getenv("DATABASE_URL"),

		PaystackSecretKey:     os.Getenv("PAYSTACK_SECRET_KEY"),
		PaystackWebhookSecret: os.Getenv("PAYSTACK_WEBHOOK_SECRET"),

		ResendAPIKey:    os.Getenv("RESEND_API_KEY"),
		ResendFromEmail: os.Getenv("RESEND_FROM_EMAIL"),

		ArkeselAPIKey:   os.Getenv("ARKESEL_API_KEY"),
		ArkeselSenderID: os.Getenv("ARKESEL_SENDER_ID"),

		FirebaseProjectID:       os.Getenv("FIREBASE_PROJECT_ID"),
		FirebaseCredentialsPath: os.Getenv("FIREBASE_CREDENTIALS_PATH"),

		GoogleMapsAPIKey: os.Getenv("GOOGLE_MAPS_API_KEY"),

		CloudinaryCloudName: os.Getenv("CLOUDINARY_CLOUD_NAME"),
		CloudinaryAPIKey:    os.Getenv("CLOUDINARY_API_KEY"),
		CloudinaryAPISecret: os.Getenv("CLOUDINARY_API_SECRET"),

		SentryDSN: os.Getenv("SENTRY_DSN"),
	}
}

func get(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
