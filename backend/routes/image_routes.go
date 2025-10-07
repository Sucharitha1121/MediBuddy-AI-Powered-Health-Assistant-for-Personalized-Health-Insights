// routes/routes.go
package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func ImageRoutes(router *mux.Router, db *gorm.DB) {
	// Create controllers
	imageController := controllers.NewImageController(db)

	// API subrouter with prefix
	api := router.PathPrefix("/api").Subrouter()

	// Public routes (if any)

	// Protected routes
	protected := api.PathPrefix("").Subrouter()
	protected.Use(middleware.AuthMiddleware)

	// Image routes
	protected.HandleFunc("/images/", imageController.GetUserImages).Methods("GET")
	protected.HandleFunc("/images/upload", imageController.UploadImage).Methods("POST")
	protected.HandleFunc("/images/{id}", imageController.GetImageById).Methods("GET")
	protected.HandleFunc("/images/{id}", imageController.DeleteImage).Methods("DELETE")
}
