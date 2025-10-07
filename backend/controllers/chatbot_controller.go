// controllers/chatbot_controller.go
package controllers

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"backend/models"
	"backend/utils"

	"gorm.io/gorm"
)

type ChatbotController struct {
	DB *gorm.DB
}

func NewChatbotController(db *gorm.DB) *ChatbotController {
	return &ChatbotController{DB: db}
}

func (cc *ChatbotController) AskChatbot(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid user ID")
		return
	}

	var input struct {
		Question string `json:"question"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	var healthData []models.HealthData
	if err := cc.DB.Where("user_id = ?", userID).Find(&healthData).Error; err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error retrieving health data")
		return
	}

	healthDataStr, _ := json.Marshal(healthData)

	// Step 1: Get Relevant Text from Python API
	pythonPayload := map[string]interface{}{
		"query": input.Question,
	}
	responseData, err := sendToPythonAPI(pythonPayload)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error processing data with Python API")
		return
	}

	// Step 2: Send to Mistral API using Python Server
	finalPayload := map[string]interface{}{
		"user_query":    input.Question,
		"relevant_text": responseData.Texts,
		"health_data":   string(healthDataStr),
	}
	finalResponse, err := sendToMistralAPI(finalPayload)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error generating response with Mistral")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, finalResponse)
}

type PythonAPIResponse struct {
	Texts []string `json:"texts"`
}

type MistralAPIResponse struct {
	GeneratedText string `json:"generated_text"`
}

func sendToPythonAPI(payload map[string]interface{}) (*PythonAPIResponse, error) {
	requestBody, _ := json.Marshal(payload)
	resp, err := http.Post("http://localhost:5000/query", "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	var responseData PythonAPIResponse
	if err := json.Unmarshal(body, &responseData); err != nil {
		return nil, err
	}
	return &responseData, nil
}

func sendToMistralAPI(payload map[string]interface{}) (*MistralAPIResponse, error) {
	requestBody, _ := json.Marshal(payload)
	resp, err := http.Post("http://localhost:5001/generate", "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	var responseData MistralAPIResponse
	if err := json.Unmarshal(body, &responseData); err != nil {
		return nil, err
	}
	return &responseData, nil
}
