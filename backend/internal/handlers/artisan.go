package handlers

import (
	"context"
	"fmt"

	"guyguy/backend/internal/models"
	"guyguy/backend/pkg/response"
	"guyguy/backend/pkg/supabase"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// ArtisanHandler handles artisan endpoints
type ArtisanHandler struct {
	supabaseClient *supabase.Client
	log            *zap.Logger
}

func NewArtisanHandler(supabaseClient *supabase.Client, log *zap.Logger) *ArtisanHandler {
	return &ArtisanHandler{
		supabaseClient: supabaseClient,
		log:            log,
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

	query := h.supabaseClient.GetSupabaseClient().From("artisans").Select("*", "", false).Eq("verification_status", "approved")

	if skill := c.Query("skill"); skill != "" {
		query = query.Eq("skill_category", skill)
	}
	if avail := c.Query("available"); avail == "true" {
		query = query.Eq("is_available", "true")
	}

	query = query.Range(offset, offset+limit-1, "")

	var artisans []models.ArtisanProfile
	if _, err := query.ExecuteTo(&artisans); err != nil {
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

func (h *ArtisanHandler) getArtisanByID(ctx context.Context, id string) (*models.ArtisanProfile, error) {
	var artisans []models.ArtisanProfile
	_, err := h.supabaseClient.GetSupabaseClient().From("artisans").Select("*", "", false).Eq("id", id).Limit(1, "").ExecuteTo(&artisans)
	if err != nil {
		return nil, err
	}
	if len(artisans) == 0 {
		return nil, nil
	}
	return &artisans[0], nil
}

func (h *ArtisanHandler) getArtisanByUserID(ctx context.Context, userID string) (*models.ArtisanProfile, error) {
	var artisans []models.ArtisanProfile
	_, err := h.supabaseClient.GetSupabaseClient().From("artisans").Select("*", "", false).Eq("user_id", userID).Limit(1, "").ExecuteTo(&artisans)
	if err != nil {
		return nil, err
	}
	if len(artisans) == 0 {
		return nil, nil
	}
	return &artisans[0], nil
}

// GetByID retrieves a public artisan profile
func (h *ArtisanHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	artisan, err := h.getArtisanByID(context.Background(), id)
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

	artisan, err := h.getArtisanByUserID(context.Background(), userID.(string))
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

	if len(updates) == 0 {
		response.BadRequest(c, "no updates provided")
		return
	}

	if _, err := h.supabaseClient.GetSupabaseClient().From("artisans").Update(updates, "representation", "").Eq("id", artisan.ID).ExecuteTo(&[]models.ArtisanProfile{}); err != nil {
		h.log.Error("failed to update artisan", zap.Error(err))
		response.ServerError(c, "failed to update profile")
		return
	}

	response.OK(c, gin.H{"message": "profile updated successfully"})
}
