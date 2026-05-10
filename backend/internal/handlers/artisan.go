package handlers

import (
	"context"
	"fmt"

	"guyguy/backend/internal/db"
	"guyguy/backend/pkg/response"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// ArtisanHandler handles artisan endpoints
type ArtisanHandler struct {
	artisanRepo *db.ArtisanRepo
	log         *zap.Logger
}

func NewArtisanHandler(client *db.Client, log *zap.Logger) *ArtisanHandler {
	return &ArtisanHandler{
		artisanRepo: db.NewArtisanRepo(client),
		log:         log,
	}
}

// List retrieves approved artisans with filtering and pagination
func (h *ArtisanHandler) List(c *gin.Context) {
	limit := 10
	offset := 0

	if l := c.Query("limit"); l != "" {
		fmt.Sscanf(l, "%d", &limit)
	}
	if o := c.Query("offset"); o != "" {
		fmt.Sscanf(o, "%d", &offset)
	}

	filters := make(map[string]interface{})
	filters["verification_status"] = "approved"

	if skill := c.Query("skill"); skill != "" {
		filters["skill_category"] = skill
	}
	if avail := c.Query("available"); avail == "true" {
		filters["is_available"] = true
	}

	ctx := context.Background()
	artisans, err := h.artisanRepo.List(ctx, filters, limit, offset)
	if err != nil {
		h.log.Error("failed to list artisans", zap.Error(err))
		response.ServerError(c, "failed to fetch artisans")
		return
	}

	response.OK(c, gin.H{
		"data":   artisans,
		"count":  len(artisans),
		"limit":  limit,
		"offset": offset,
	})
}

// GetByID retrieves a public artisan profile
func (h *ArtisanHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	ctx := context.Background()
	artisan, err := h.artisanRepo.GetByID(ctx, id)
	if err != nil {
		h.log.Error("failed to get artisan", zap.Error(err))
		response.ServerError(c, "failed to fetch artisan")
		return
	}

	if artisan == nil {
		response.NotFound(c, "artisan not found")
		return
	}

	response.OK(c, artisan)
}

// UpdateProfile updates authenticated artisan's profile
func (h *ArtisanHandler) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	var req struct {
		Bio             *string `json:"bio"`
		YearsExperience *int    `json:"years_experience"`
		SkillCategory   *string `json:"skill_category"`
		MoMoNumber      *string `json:"momo_number"`
		MoMoNetwork     *string `json:"momo_network"`
		IDDocumentURL   *string `json:"id_document_url"`
		IsAvailable     *bool   `json:"is_available"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid request body")
		return
	}

	ctx := context.Background()
	artisan, err := h.artisanRepo.GetByUserID(ctx, userID.(string))
	if err != nil {
		h.log.Error("failed to get artisan profile", zap.Error(err))
		response.ServerError(c, "failed to fetch profile")
		return
	}

	if artisan == nil {
		response.NotFound(c, "artisan profile not found")
		return
	}

	updates := make(map[string]interface{})
	if req.Bio != nil {
		updates["bio"] = *req.Bio
	}
	if req.YearsExperience != nil {
		updates["years_experience"] = *req.YearsExperience
	}
	if req.SkillCategory != nil {
		updates["skill_category"] = *req.SkillCategory
	}
	if req.MoMoNumber != nil {
		updates["momo_number"] = *req.MoMoNumber
	}
	if req.MoMoNetwork != nil {
		updates["momo_network"] = *req.MoMoNetwork
	}
	if req.IDDocumentURL != nil {
		updates["id_document_url"] = *req.IDDocumentURL
	}
	if req.IsAvailable != nil {
		updates["is_available"] = *req.IsAvailable
	}

	err = h.artisanRepo.Update(ctx, artisan.ID, updates)
	if err != nil {
		h.log.Error("failed to update artisan", zap.Error(err))
		response.ServerError(c, "failed to update profile")
		return
	}

	response.OK(c, gin.H{"message": "profile updated successfully"})
}
