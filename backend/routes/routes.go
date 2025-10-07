package routes

import (
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func SetupRoutes(router *mux.Router, db *gorm.DB) {
	// Initialize sub-routes
	AuthRoutes(router, db)
	HealthDataRoutes(router, db)
	ChatbotRoutes(router, db)
	ImageRoutes(router, db)

}
