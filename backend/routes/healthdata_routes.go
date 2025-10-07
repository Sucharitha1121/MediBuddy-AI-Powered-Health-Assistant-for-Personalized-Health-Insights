package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func HealthDataRoutes(router *mux.Router, db *gorm.DB) {
	healthDataController := controllers.NewHealthDataController(db)

	protected := router.PathPrefix("/api").Subrouter()

	protected.Use(middleware.AuthMiddleware)

	protected.HandleFunc("/healthdata", healthDataController.AddHealthData).Methods("POST")
	protected.HandleFunc("/healthdata", healthDataController.GetUserHealthData).Methods("GET")
	protected.HandleFunc("/healthdata/{id}", healthDataController.DeleteHealthData).Methods("DELETE")
	protected.HandleFunc("/healthdata/store", healthDataController.StoreHealthData).Methods("POST")
	protected.HandleFunc("/health-concerns", healthDataController.StoreHealthConcerns).Methods("POST")
}
