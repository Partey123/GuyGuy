package handlers

import (
	"context"
	"fmt"

	"guyguy/backend/internal/db"
	"guyguy/backend/internal/models"
	"guyguy/backend/pkg/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// ChatHandler handles chat endpoints
type ChatHandler struct {
	messageRepo *db.MessageRepo
	bookingRepo *db.BookingRepo
	log         *zap.Logger
}

func NewChatHandler(client *db.Client, log *zap.Logger) *ChatHandler {
	return &ChatHandler{
		messageRepo: db.NewMessageRepo(client),
		bookingRepo: db.NewBookingRepo(client),
		log:         log,
	}
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
	offset := 0

	if l := c.Query("limit"); l != "" {
		fmt.Sscanf(l, "%d", &limit)
	}
	if o := c.Query("offset"); o != "" {
		fmt.Sscanf(o, "%d", &offset)
	}

	ctx := context.Background()
	booking, err := h.bookingRepo.GetByID(ctx, bookingID)
	if err != nil {
		h.log.Error("failed to get booking", zap.Error(err))
		response.ServerError(c, "failed to fetch booking")
		return
	}

	if booking == nil {
		response.NotFound(c, "booking not found")
		return
	}

	// Check authorization - only client and artisan can access chat
	if booking.ClientID != userID && booking.ArtisanID != userID {
		response.Forbidden(c, "you cannot access this chat")
		return
	}

	messages, err := h.messageRepo.ListByBookingID(ctx, bookingID, limit, offset)
	if err != nil {
		h.log.Error("failed to list messages", zap.Error(err))
		response.ServerError(c, "failed to fetch messages")
		return
	}

	response.OK(c, gin.H{
		"data":   messages,
		"count":  len(messages),
		"limit":  limit,
		"offset": offset,
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

	ctx := context.Background()
	booking, err := h.bookingRepo.GetByID(ctx, bookingID)
	if err != nil {
		h.log.Error("failed to get booking", zap.Error(err))
		response.ServerError(c, "failed to fetch booking")
		return
	}

	if booking == nil {
		response.NotFound(c, "booking not found")
		return
	}

	// Check authorization - only client and artisan can send messages
	if booking.ClientID != userID && booking.ArtisanID != userID {
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

	err = h.messageRepo.Create(ctx, message)
	if err != nil {
		h.log.Error("failed to create message", zap.Error(err))
		response.ServerError(c, "failed to send message")
		return
	}

	response.Created(c, message)
}

// MarkAsRead marks a message as read
func (h *ChatHandler) MarkAsRead(c *gin.Context) {
	messageID := c.Param("message_id")

	ctx := context.Background()
	err := h.messageRepo.MarkAsRead(ctx, messageID)
	if err != nil {
		h.log.Error("failed to mark message as read", zap.Error(err))
		response.ServerError(c, "failed to mark message as read")
		return
	}

	response.OK(c, gin.H{"message": "message marked as read"})
}
