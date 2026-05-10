package handlers

import (
	"context"
	"fmt"

	"guyguy/backend/internal/models"
	"guyguy/backend/pkg/response"
	"guyguy/backend/pkg/supabase"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// ChatHandler handles chat endpoints
type ChatHandler struct {
	supabaseClient *supabase.Client
	log            *zap.Logger
}

func NewChatHandler(supabaseClient *supabase.Client, log *zap.Logger) *ChatHandler {
	return &ChatHandler{
		supabaseClient: supabaseClient,
		log:            log,
	}
}

func (h *ChatHandler) getBookingByID(ctx context.Context, id string) (*models.Booking, error) {
	var bookings []models.Booking
	_, err := h.supabaseClient.GetSupabaseClient().From("bookings").Select("*", "", false).Eq("id", id).Limit(1, "").ExecuteTo(&bookings)
	if err != nil {
		return nil, err
	}
	if len(bookings) == 0 {
		return nil, nil
	}
	return &bookings[0], nil
}

// GetMessages retrieves chat history for a booking
func (h *ChatHandler) GetMessages(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	bookingID := c.Param("booking_id")
	limit := 50

	if l := c.Query("limit"); l != "" {
		fmt.Sscanf(l, "%d", &limit)
	}

	booking, err := h.getBookingByID(context.Background(), bookingID)
	if err != nil {
		h.log.Error("failed to get booking", zap.Error(err))
		response.ServerError(c, "failed to fetch booking")
		return
	}

	if booking == nil {
		response.NotFound(c, "booking not found")
		return
	}

	if booking.ClientID != userID.(string) && booking.ArtisanID != userID.(string) {
		response.Forbidden(c, "you cannot access this chat")
		return
	}

	var messages []models.Message
	if _, err := h.supabaseClient.GetSupabaseClient().From("messages").Select("*", "", false).Eq("booking_id", bookingID).Limit(limit, "").ExecuteTo(&messages); err != nil {
		h.log.Error("failed to list messages", zap.Error(err))
		response.ServerError(c, "failed to fetch messages")
		return
	}

	response.OK(c, gin.H{
		"data":   messages,
		"count":  len(messages),
		"limit":  limit,
		"offset": 0,
	})
}

// SendMessage sends a chat message
func (h *ChatHandler) SendMessage(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "user not authenticated")
		return
	}

	bookingID := c.Param("booking_id")

	var req struct {
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid request body")
		return
	}

	booking, err := h.getBookingByID(context.Background(), bookingID)
	if err != nil {
		h.log.Error("failed to get booking", zap.Error(err))
		response.ServerError(c, "failed to fetch booking")
		return
	}

	if booking == nil {
		response.NotFound(c, "booking not found")
		return
	}

	if booking.ClientID != userID.(string) && booking.ArtisanID != userID.(string) {
		response.Forbidden(c, "you cannot send messages in this chat")
		return
	}

	message := &models.Message{
		ID:        uuid.New().String(),
		BookingID: bookingID,
		SenderID:  userID.(string),
		Content:   req.Content,
		IsRead:    false,
	}

	var created []models.Message
	if _, err := h.supabaseClient.GetSupabaseClient().From("messages").Insert(message, false, "", "representation", "").ExecuteTo(&created); err != nil {
		h.log.Error("failed to create message", zap.Error(err))
		response.ServerError(c, "failed to send message")
		return
	}

	response.Created(c, created[0])
}

// MarkAsRead marks a message as read
func (h *ChatHandler) MarkAsRead(c *gin.Context) {
	messageID := c.Param("message_id")

	if _, err := h.supabaseClient.GetSupabaseClient().From("messages").Update(map[string]interface{}{"is_read": true}, "representation", "").Eq("id", messageID).ExecuteTo(&[]models.Message{}); err != nil {
		h.log.Error("failed to mark message as read", zap.Error(err))
		response.ServerError(c, "failed to mark message as read")
		return
	}

	response.OK(c, gin.H{"message": "message marked as read"})
}
