package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func ChatbotRoutes(router *mux.Router, db *gorm.DB) {
	chatbotController := controllers.NewChatbotController(db)

	protected := router.PathPrefix("/api").Subrouter()
	protected.Use(middleware.AuthMiddleware)

	protected.HandleFunc("/chatbot", chatbotController.AskChatbot).Methods("POST")
}
