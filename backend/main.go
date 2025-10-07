package main

import (
	"log"
	"net/http"

	"backend/config"
	"backend/routes"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// Initialize database connection
	db := config.InitialMigration()

	// Create a new router
	router := mux.NewRouter()

	// Setup all routes
	routes.SetupRoutes(router, db)

	// Configure CORS with proper settings
	c := cors.New(cors.Options{
		// Allow requests from your frontend origin
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: true, // Important for authentication
		MaxAge:           86400,
		// Debug mode can be helpful during development
		Debug: true,
	})

	// Create handler with CORS middleware
	handler := c.Handler(router)

	// Start the server
	log.Println("Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
