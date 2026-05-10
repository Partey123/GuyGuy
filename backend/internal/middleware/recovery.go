package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func Recovery(log *zap.Logger) gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered any) {
		log.Error("panic recovered", zap.Any("recovered", recovered))
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "internal_server_error",
		})
	})
}
