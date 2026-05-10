package middleware

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// AdminOnly middleware checks if the user has admin role
func AdminOnly(log *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			log.Warn("role not found in context")
			c.AbortWithStatusJSON(403, gin.H{"error": "forbidden"})
			return
		}

		roleStr, ok := role.(string)
		if !ok || roleStr != "admin" {
			log.Warn("user is not admin", zap.Any("role", role))
			c.AbortWithStatusJSON(403, gin.H{"error": "forbidden"})
			return
		}

		c.Next()
	}
}
