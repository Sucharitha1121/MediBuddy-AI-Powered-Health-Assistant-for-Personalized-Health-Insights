// utils/jwt.go
package utils

import (
	"time"

	"github.com/golang-jwt/jwt"
)

var jwtSecret = []byte("teja")

func GenerateJWT(userID string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	return token.SignedString(jwtSecret)
}

