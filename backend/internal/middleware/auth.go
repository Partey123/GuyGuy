package middleware

import (
	"fmt"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
)

// Auth middleware validates Supabase JWT tokens
func Auth(jwtSecret string, log *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			log.Warn("missing Authorization header")
			c.AbortWithStatusJSON(401, gin.H{"error": "missing authorization header"})
			return
		}

		// Parse Bearer token
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			log.Warn("invalid authorization header format")
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid authorization header format"})
			return
		}

		tokenStr := parts[1]

		// Parse and validate JWT with Supabase specific validation
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			// Verify signing method is HMAC (Supabase uses HS256)
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(jwtSecret), nil
		})

		if err != nil {
			log.Warn("jwt parse error", zap.Error(err))
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
			return
		}

		if !token.Valid {
			log.Warn("invalid token")
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
			return
		}

		// Extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			log.Warn("invalid token claims")
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token claims"})
			return
		}

		// Check token expiration
		if exp, ok := claims["exp"].(float64); ok {
			if time.Now().Unix() > int64(exp) {
				log.Warn("token expired")
				c.AbortWithStatusJSON(401, gin.H{"error": "token expired"})
				return
			}
		}

		// Extract user ID (sub claim) - Supabase uses this for user identification
		userID, ok := claims["sub"].(string)
		if !ok || userID == "" {
			log.Warn("missing or invalid sub claim in token")
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token claims"})
			return
		}

		// Extract email from claims (Supabase includes this)
		email, _ := claims["email"].(string)

		// Extract role from app_metadata or user_role claim (if present)
		var role string
		if appMetadata, ok := claims["app_metadata"].(map[string]interface{}); ok {
			if r, exists := appMetadata["role"]; exists {
				role = fmt.Sprintf("%v", r)
			}
		}
		if role == "" {
			role, _ = claims["user_role"].(string)
		}

		// Extract user metadata if needed
		userMetadata, _ := claims["user_metadata"].(map[string]interface{})

		// Set values in context for downstream handlers
		c.Set("user_id", userID)
		c.Set("role", role)
		c.Set("email", email)
		c.Set("user_metadata", userMetadata)

		c.Next()
	}
}
