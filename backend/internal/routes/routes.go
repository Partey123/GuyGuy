package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"guyguy/backend/internal/config"
	"guyguy/backend/internal/handlers"
	"guyguy/backend/internal/middleware"
	"guyguy/backend/pkg/supabase"
)

func NewRouter(cfg config.Config, log *zap.Logger) *gin.Engine {
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(middleware.Recovery(log))
	r.Use(middleware.Logger(log))
	r.Use(middleware.CORS())

	// Initialize Supabase client
	supabaseClient, err := supabase.FromEnv(log)
	if err != nil {
		log.Fatal("failed to initialize supabase client", zap.Error(err))
	}

	// Initialize handlers using Supabase directly for auth and persistence
	authHandler := handlers.NewAuthHandler(supabaseClient, log)
	artisanHandler := handlers.NewArtisanHandler(supabaseClient, log)
	bookingHandler := handlers.NewBookingHandler(supabaseClient, log)
	paymentHandler := handlers.NewPaymentHandler(supabaseClient, log)
	chatHandler := handlers.NewChatHandler(supabaseClient, log)
	reviewHandler := handlers.NewReviewHandler(supabaseClient, log)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"ok":   true,
			"env":  cfg.AppEnv,
			"port": cfg.Port,
		})
	})

	api := r.Group("/api/v1")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "pong"})
		})

		// Public auth routes (no authentication required)
		auth := api.Group("/auth")
		{
			auth.POST("/signup", authHandler.Signup)
			auth.POST("/login", authHandler.Login)
			auth.POST("/verify-email", authHandler.VerifyEmail)
		}

		// Protected auth routes (authentication required)
		protectedAuth := api.Group("/auth").Use(middleware.Auth(supabaseClient.GetJWTSecret(), log))
		{
			protectedAuth.GET("/profile", authHandler.GetProfile)
			protectedAuth.PUT("/profile", authHandler.UpdateProfile)
			protectedAuth.GET("/client/dashboard", authHandler.ClientDashboard)
			protectedAuth.GET("/artisan/dashboard", authHandler.ArtisanDashboard)
		}

		// Artisan routes
		artisans := api.Group("/artisans")
		{
			artisans.GET("", artisanHandler.List)
			artisans.GET("/:id", artisanHandler.GetByID)
			// Protected artisan routes
			protected := artisans.Use(middleware.Auth(supabaseClient.GetJWTSecret(), log))
			{
				protected.PUT("/profile", artisanHandler.UpdateProfile)
			}
		}

		// Booking routes
		bookings := api.Group("/bookings").Use(middleware.Auth(supabaseClient.GetJWTSecret(), log))
		{
			bookings.POST("", bookingHandler.Create)
			bookings.GET("/:id", bookingHandler.GetByID)
			bookings.GET("/status/:status", bookingHandler.ListByStatus)
			bookings.PUT("/:id/status", bookingHandler.UpdateStatus)
		}

		// Payment routes
		payments := api.Group("/payments")
		{
			// Protected payment routes
			protected := payments.Use(middleware.Auth(supabaseClient.GetJWTSecret(), log))
			{
				protected.POST("/initiate", paymentHandler.InitiatePayment)
				protected.GET("/:booking_id/status", paymentHandler.GetPaymentStatus)
			}
			// Webhook endpoint (no auth required)
			payments.POST("/webhook", paymentHandler.WebhookHandler)
		}

		// Chat routes
		chat := api.Group("/chat").Use(middleware.Auth(supabaseClient.GetJWTSecret(), log))
		{
			chat.GET("/bookings/:booking_id/messages", chatHandler.GetMessages)
			chat.POST("/bookings/:booking_id/messages", chatHandler.SendMessage)
			chat.PUT("/messages/:message_id/read", chatHandler.MarkAsRead)
		}

		// Review routes
		reviews := api.Group("/reviews").Use(middleware.Auth(supabaseClient.GetJWTSecret(), log))
		{
			reviews.POST("", reviewHandler.Create)
			reviews.GET("/artisan/:artisan_id", reviewHandler.ListByArtisan)
		}
	}

	return r
}
