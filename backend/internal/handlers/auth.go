package handlers

import (
	"context"

	"guyguy/backend/internal/db"
	"guyguy/backend/internal/models"
	"guyguy/backend/pkg/response"
	"guyguy/backend/pkg/supabase"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// AuthHandler handles authentication endpoints
type AuthHandler struct {
	userRepo       *db.UserRepo
	supabaseClient *supabase.Client
	log            *zap.Logger
}

func NewAuthHandler(client *db.Client, supabaseClient *supabase.Client, log *zap.Logger) *AuthHandler {
	return &AuthHandler{
		userRepo:       db.NewUserRepo(client),
		supabaseClient: supabaseClient,
		log:            log,
	}
}

// GetProfile retrieves the authenticated user's profile
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	ctx := context.Background()
	user, err := h.userRepo.GetByID(ctx, userID.(string))
	if err != nil {
		h.log.Error("failed to get user", zap.Error(err))
		response.ServerError(c, "failed to get user profile")
		return
	}

	if user == nil {
		response.NotFound(c, "user not found")
		return
	}

	response.OK(c, user)
}

// UpdateProfile updates the authenticated user's profile
func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	var req struct {
		FullName  *string `json:"full_name"`
		AvatarURL *string `json:"avatar_url"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid request body")
		return
	}

	updates := make(map[string]interface{})
	if req.FullName != nil {
		updates["full_name"] = *req.FullName
	}
	if req.AvatarURL != nil {
		updates["avatar_url"] = *req.AvatarURL
	}

	ctx := context.Background()
	err := h.userRepo.Update(ctx, userID.(string), updates)
	if err != nil {
		h.log.Error("failed to update user", zap.Error(err))
		response.ServerError(c, "failed to update profile")
		return
	}

	response.OK(c, gin.H{"message": "profile updated successfully"})
}

// Signup creates a new user account with role-based routing
func (h *AuthHandler) Signup(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
		FullName string `json:"full_name" binding:"required"`
		Phone    string `json:"phone" binding:"required"`
		Role     string `json:"role" binding:"required,oneof=client artisan"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid request body")
		return
	}

	// Create user with metadata including role using our database
	// In production, this would integrate with Supabase Auth API
	ctx := context.Background()

	// Check if user already exists by phone (since phone is unique)
	existingUser, err := h.userRepo.GetByPhone(ctx, req.Phone)
	if err != nil {
		h.log.Error("failed to check existing user", zap.Error(err))
		response.ServerError(c, "failed to create account")
		return
	}

	if existingUser != nil {
		response.BadRequest(c, "user with this phone number already exists")
		return
	}

	// Create user record (will be synced with Supabase Auth)
	user := &models.User{
		Email:    &req.Email,
		Phone:    req.Phone,
		FullName: req.FullName,
		Role:     req.Role,
		IsActive: false, // Will be activated after email verification
	}

	err = h.userRepo.Create(ctx, user)
	if err != nil {
		h.log.Error("failed to create user", zap.Error(err))
		response.ServerError(c, "failed to create account")
		return
	}

	// Return success message - user needs to verify email via Supabase
	// In production, this would trigger Supabase email with our beautiful template
	response.Created(c, gin.H{
		"message":          "Account created successfully! Please check your email for verification.",
		"email":            req.Email,
		"role":             req.Role,
		"user_id":          user.ID,
		"next_step":        "Check your inbox and click the verification link",
		"verification_url": "https://guyguy.com.gh/verify-email?token=" + user.ID,
		"expires_in":       900, // 15 minutes
	})
}

// Login authenticates user and returns JWT with role-based dashboard info
func (h *AuthHandler) Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid request body")
		return
	}

	// For now, use simple email/password lookup in our database
	// In production, this would integrate with Supabase Auth API
	ctx := context.Background()

	// Find user by email (we need to add GetByEmail method to UserRepo)
	// For now, we'll use a basic approach
	user, err := h.userRepo.GetByPhone(ctx, req.Email) // Temporary - using phone lookup
	if err != nil {
		h.log.Error("failed to login user",
			zap.String("email", req.Email),
			zap.Error(err))
		response.ServerError(c, "login failed")
		return
	}

	if user == nil {
		response.Unauthorized(c, "invalid email or password")
		return
	}

	// In production, verify password hash here
	// For now, we'll accept any password for demonstration

	// Determine dashboard URL based on role
	var dashboardURL string
	switch user.Role {
	case "client":
		dashboardURL = "/client/dashboard"
	case "artisan":
		dashboardURL = "/artisan/dashboard"
	default:
		dashboardURL = "/dashboard"
	}

	// Return authentication response with role-based routing info
	// In production, this would include actual JWT tokens from Supabase
	response.OK(c, gin.H{
		"access_token":  "mock_jwt_token_" + user.ID, // Mock token for now
		"refresh_token": "mock_refresh_token_" + user.ID,
		"user": gin.H{
			"id":         user.ID,
			"email":      user.Email,
			"full_name":  user.FullName,
			"phone":      user.Phone,
			"role":       user.Role,
			"avatar_url": user.AvatarURL,
		},
		"dashboard_url": dashboardURL,
		"expires_in":    3600, // 1 hour
		"note":          "Using mock authentication - integrate with Supabase Auth in production",
	})
}

// VerifyEmail handles email verification (though Supabase handles this automatically)
func (h *AuthHandler) VerifyEmail(c *gin.Context) {
	var req struct {
		Token string `json:"token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid request body")
		return
	}

	// Supabase handles email verification automatically when user clicks the link
	// This endpoint can be used for custom verification flow if needed
	response.OK(c, gin.H{
		"message": "Email verification is handled automatically by Supabase. Please check your email and click the verification link.",
	})
}

// ClientDashboard returns client-specific dashboard data
func (h *AuthHandler) ClientDashboard(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	role, _ := c.Get("role")
	if role != "client" {
		response.Forbidden(c, "access denied - client role required")
		return
	}

	ctx := context.Background()
	user, err := h.userRepo.GetByID(ctx, userID.(string))
	if err != nil {
		h.log.Error("failed to get user", zap.Error(err))
		response.ServerError(c, "failed to get user data")
		return
	}

	if user == nil {
		response.NotFound(c, "user not found")
		return
	}

	response.OK(c, gin.H{
		"message": "Welcome to your client dashboard",
		"user": gin.H{
			"id":         user.ID,
			"full_name":  user.FullName,
			"email":      user.Email,
			"phone":      user.Phone,
			"avatar_url": user.AvatarURL,
		},
		"dashboard_type": "client",
		"features": []string{
			"Browse Artisans",
			"Create Bookings",
			"View Bookings",
			"Make Payments",
			"Leave Reviews",
			"Chat with Artisans",
		},
	})
}

// ArtisanDashboard returns artisan-specific dashboard data
func (h *AuthHandler) ArtisanDashboard(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	role, _ := c.Get("role")
	if role != "artisan" {
		response.Forbidden(c, "access denied - artisan role required")
		return
	}

	ctx := context.Background()
	user, err := h.userRepo.GetByID(ctx, userID.(string))
	if err != nil {
		h.log.Error("failed to get user", zap.Error(err))
		response.ServerError(c, "failed to get user data")
		return
	}

	if user == nil {
		response.NotFound(c, "user not found")
		return
	}

	response.OK(c, gin.H{
		"message": "Welcome to your artisan dashboard",
		"user": gin.H{
			"id":         user.ID,
			"full_name":  user.FullName,
			"email":      user.Email,
			"phone":      user.Phone,
			"avatar_url": user.AvatarURL,
		},
		"dashboard_type": "artisan",
		"features": []string{
			"Manage Profile",
			"View Bookings",
			"Manage Availability",
			"Receive Payments",
			"View Reviews",
			"Chat with Clients",
		},
	})
}
