package handlers

import (
	"context"

	"guyguy/backend/internal/db"
	"guyguy/backend/pkg/response"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// AuthHandler handles authentication endpoints
type AuthHandler struct {
	userRepo *db.UserRepo
	log      *zap.Logger
}

func NewAuthHandler(client *db.Client, log *zap.Logger) *AuthHandler {
	return &AuthHandler{
		userRepo: db.NewUserRepo(client),
		log:      log,
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
