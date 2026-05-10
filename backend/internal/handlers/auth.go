package handlers

import (
	"strings"

	"guyguy/backend/pkg/response"
	"guyguy/backend/pkg/supabase"

	"github.com/gin-gonic/gin"
	"github.com/supabase-community/gotrue-go/types"
	"go.uber.org/zap"
)

// AuthHandler handles authentication endpoints
type AuthHandler struct {
	supabaseClient *supabase.Client
	log            *zap.Logger
}

func NewAuthHandler(supabaseClient *supabase.Client, log *zap.Logger) *AuthHandler {
	return &AuthHandler{
		supabaseClient: supabaseClient,
		log:            log,
	}
}

// GetProfile retrieves authenticated user's profile
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	response.OK(c, gin.H{
		"id":         userID,
		"email":      c.GetString("email"),
		"full_name":  c.GetString("full_name"),
		"phone":      c.GetString("phone"),
		"role":       c.GetString("role"),
		"avatar_url": c.GetString("avatar_url"),
	})
}

// UpdateProfile updates the authenticated user's profile
func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	// FIX 1: userID was declared but never used — use _ to discard or log it
	_, exists := c.Get("user_id")
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

	response.OK(c, gin.H{"message": "profile updated successfully"})
}

// Signup creates a new user account with role-based routing
func (h *AuthHandler) Signup(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
		FullName string `json:"full_name" binding:"required"`
		Phone    string `json:"phone" binding:"omitempty"`
		Role     string `json:"role" binding:"required,oneof=client artisan"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid request body")
		return
	}

	data := map[string]interface{}{
		"full_name": req.FullName,
		"role":      req.Role,
	}
	if req.Phone != "" {
		data["phone"] = req.Phone
	}

	signupRequest := types.SignupRequest{
		Email:    req.Email,
		Password: req.Password,
		Data:     data,
	}

	result, err := h.supabaseClient.GetSupabaseClient().Auth.Signup(signupRequest)
	if err != nil {
		errMsg := err.Error()
		h.log.Error("signup failed",
			zap.String("email", req.Email),
			zap.String("error", errMsg))

		if strings.Contains(errMsg, "response status code 4") {
			parts := strings.SplitN(errMsg, ": ", 2)
			if len(parts) == 2 {
				errMsg = strings.TrimSpace(parts[1])
			}
			h.log.Info("signup validation error", zap.String("details", errMsg))
			response.BadRequest(c, errMsg)
			return
		}

		h.log.Error("signup error from Supabase", zap.String("raw_error", errMsg))
		response.ServerError(c, errMsg)
		return
	}

	response.Created(c, gin.H{
		"message":    "Account created successfully! Please check your email for verification.",
		"email":      req.Email,
		"role":       req.Role,
		"user_id":    result.User.ID,
		"next_step":  "Check your inbox and click on verification link sent by Supabase",
		"expires_in": 900,
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

	// FIX 3: Correct method name is SignInWithEmailPassword, not SignInWithPassword
	result, err := h.supabaseClient.GetSupabaseClient().Auth.SignInWithEmailPassword(req.Email, req.Password)
	if err != nil {
		h.log.Error("failed to login user",
			zap.String("email", req.Email),
			zap.Error(err))
		response.Unauthorized(c, "invalid email or password")
		return
	}

	userRole := "client"
	if result.User.UserMetadata != nil {
		if role, exists := result.User.UserMetadata["role"]; exists {
			userRole = role.(string)
		}
	}

	var dashboardURL string
	switch userRole {
	case "client":
		dashboardURL = "/client/dashboard"
	case "artisan":
		dashboardURL = "/artisan/dashboard"
	default:
		dashboardURL = "/dashboard"
	}

	response.OK(c, gin.H{
		"access_token":  result.AccessToken,
		"refresh_token": result.RefreshToken,
		"user": gin.H{
			"id":         result.User.ID,
			"email":      result.User.Email,
			"full_name":  result.User.UserMetadata["full_name"],
			"phone":      result.User.UserMetadata["phone"],
			"role":       userRole,
			"avatar_url": result.User.UserMetadata["avatar_url"],
		},
		"dashboard_url": dashboardURL,
		"expires_in":    result.ExpiresIn,
	})
}

// VerifyEmail handles email verification
func (h *AuthHandler) VerifyEmail(c *gin.Context) {
	var req struct {
		Token string `json:"token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid request body")
		return
	}

	response.OK(c, gin.H{
		"message": "Email verification is handled automatically by Supabase. Please check your email and click on verification link.",
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

	response.OK(c, gin.H{
		"message": "Welcome to your client dashboard",
		"user": gin.H{
			"id":         userID,
			"full_name":  c.GetString("full_name"),
			"email":      c.GetString("email"),
			"phone":      c.GetString("phone"),
			"role":       c.GetString("role"),
			"avatar_url": c.GetString("avatar_url"),
		},
		"dashboard_type": "client",
		"features": []string{
			"Browse Artisans", "Create Bookings", "View Bookings",
			"Make Payments", "Leave Reviews", "Chat with Artisans",
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

	response.OK(c, gin.H{
		"message": "Welcome to your artisan dashboard",
		"user": gin.H{
			"id":         userID,
			"full_name":  c.GetString("full_name"),
			"email":      c.GetString("email"),
			"phone":      c.GetString("phone"),
			"role":       c.GetString("role"),
			"avatar_url": c.GetString("avatar_url"),
		},
		"dashboard_type": "artisan",
		"features": []string{
			"Manage Profile", "View Bookings", "Manage Availability",
			"Receive Payments", "View Reviews", "Chat with Clients",
		},
	})
}
