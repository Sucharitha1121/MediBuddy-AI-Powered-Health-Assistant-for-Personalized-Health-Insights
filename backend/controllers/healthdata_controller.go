package controllers

import (
	"encoding/json"
	"net/http"

	"backend/models"
	"backend/utils"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type HealthDataController struct {
	DB *gorm.DB
}

func NewHealthDataController(db *gorm.DB) *HealthDataController {
	return &HealthDataController{DB: db}
}

// Add Health Data
func (hc *HealthDataController) AddHealthData(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value("user_id").(string)

	// Convert string userID to uuid.UUID
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid user ID format")
		return
	}

	var input map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Convert map to JSON byte slice for storage
	jsonData, err := json.Marshal(input)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error processing health data")
		return
	}

	healthData := models.HealthData{
		UserID: userID,
		Data:   datatypes.JSON(jsonData), // Store JSON data as byte slice
	}

	if err := hc.DB.Create(&healthData).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error adding health data")
		return
	}

	utils.RespondWithJSON(w, http.StatusCreated, healthData)
}

// Get User Health Data
func (hc *HealthDataController) GetUserHealthData(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value("user_id").(string)

	// Convert string userID to uuid.UUID
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid user ID format")
		return
	}

	var healthData []models.HealthData
	if err := hc.DB.Where("user_id = ?", userID).Find(&healthData).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error retrieving health data")
		return
	}

	// Convert JSONB (datatypes.JSON) to map before sending response
	for i := range healthData {
		var jsonData map[string]interface{}
		if err := json.Unmarshal([]byte(healthData[i].Data), &jsonData); err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Error parsing health data")
			return
		}
	}

	utils.RespondWithJSON(w, http.StatusOK, healthData)
}

// Delete Health Data
func (hc *HealthDataController) DeleteHealthData(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value("user_id").(string)
	dataIDStr := mux.Vars(r)["id"]

	// Convert string IDs to uuid.UUID
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid user ID format")
		return
	}

	dataID, err := uuid.Parse(dataIDStr)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid data ID format")
		return
	}

	if err := hc.DB.Where("id = ? AND user_id = ?", dataID, userID).Delete(&models.HealthData{}).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error deleting health data")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "Health data deleted"})
}

type ExtractedData struct {
	Status        string `json:"status"`
	ExtractedText string `json:"extracted_text"`
}

// StoreExtractedData method in HealthDataController

// Store OCR-extracted data
func (hc *HealthDataController) StoreHealthData(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from context
	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Parse user ID as UUID
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid user ID format")
		return
	}

	// Flexible input struct to handle various JSON structures
	var input map[string]interface{}

	// Use strict decoding to prevent unknown fields
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&input); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Extract extracted_text, defaulting to full input if not found
	extractedText := ""
	fileName := "Unknown"

	// Try to extract extracted_text
	if text, ok := input["extracted_text"].(string); ok {
		extractedText = text
	} else {
		// If no extracted_text, convert whole input to JSON
		extractedTextBytes, _ := json.Marshal(input)
		extractedText = string(extractedTextBytes)
	}

	// Try to extract file_name
	if name, ok := input["file_name"].(string); ok {
		fileName = name
	}

	// Validate input
	if extractedText == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "No text data provided")
		return
	}

	// Create JSON data structure
	dataJSON, err := json.Marshal(map[string]string{
		"file_name":      fileName,
		"extracted_text": extractedText,
	})
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error encoding JSON")
		return
	}

	// Store in database
	healthData := models.HealthData{
		ID:     uuid.New(),
		UserID: userUUID,
		Data:   datatypes.JSON(dataJSON),
	}

	if err := hc.DB.Create(&healthData).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to store health data")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "Data stored successfully"})
}

func (hc *HealthDataController) StoreHealthConcerns(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from context
	userIDStr := r.Context().Value("user_id").(string)

	// Convert string userID to uuid.UUID
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid user ID format")
		return
	}

	// Decode JSON request
	var input struct {
		Symptoms         string `json:"symptoms"`
		StartDate        string `json:"startDate"`
		WorseningFactors string `json:"worseningFactors"`
		PreviousSymptoms string `json:"previousSymptoms"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Create JSON data structure
	dataJSON, err := json.Marshal(map[string]string{
		"type":              "health_concerns",
		"symptoms":          input.Symptoms,
		"start_date":        input.StartDate,
		"worsening_factors": input.WorseningFactors,
		"previous_symptoms": input.PreviousSymptoms,
	})

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error encoding JSON")
		return
	}

	// Store in database
	healthData := models.HealthData{
		ID:     uuid.New(),
		UserID: userID,
		Data:   datatypes.JSON(dataJSON),
	}

	if err := hc.DB.Create(&healthData).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to store health concerns data")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{
		"message": "Health concerns data stored successfully",
		"id":      healthData.ID.String(),
	})
}
