package controllers

import (
	"errors"
	"io"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"backend/models"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type ImageController struct {
	DB *gorm.DB
}

// NewImageController creates a new image controller with the given database connection
func NewImageController(db *gorm.DB) *ImageController {
	return &ImageController{
		DB: db,
	}
}

// UploadImage handles image upload for a user
func (ic *ImageController) UploadImage(w http.ResponseWriter, r *http.Request) {
	// Get the authenticated user ID (assumes you have middleware that sets this)
	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		return
	}

	// Check if user exists
	var user models.User
	if err := ic.DB.First(&user, "id = ?", userID).Error; err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Parse multipart form with 10MB max memory
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "No image file provided", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Validate file type
	fileExt := filepath.Ext(header.Filename)
	if !isValidImageType(fileExt) {
		http.Error(w, "Invalid image format. Supported formats: jpg, jpeg, png, gif", http.StatusBadRequest)
		return
	}

	// Read the file data
	imageData, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "Failed to read image file", http.StatusInternalServerError)
		return
	}

	// Create a new UserImage record
	userImage := models.UserImage{
		UserID:    userID,
		ImageData: imageData,
		ImageType: header.Header.Get("Content-Type"),
		ImageName: header.Filename,
		Size:      header.Size,
	}

	// Save to database
	if err := ic.DB.Create(&userImage).Error; err != nil {
		http.Error(w, "Failed to save image", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`{"message":"Image uploaded successfully","imageId":"` + userImage.ID + `","size":` + strconv.FormatInt(userImage.Size, 10) + `,"name":"` + userImage.ImageName + `"}`))
}

// GetUserImages returns all images for a user
func (ic *ImageController) GetUserImages(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		return
	}

	// Optional pagination
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page == 0 {
		page = 1
	}
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))
	if pageSize == 0 {
		pageSize = 10
	}
	offset := (page - 1) * pageSize

	var images []models.UserImage
	var count int64

	// Count total images
	ic.DB.Model(&models.UserImage{}).Where("user_id = ?", userID).Count(&count)

	// Get paginated results without image data (to make response lighter)
	if err := ic.DB.Select("id, user_id, image_type, image_name, size, created_at, updated_at").
		Where("user_id = ?", userID).
		Offset(offset).Limit(pageSize).
		Order("created_at DESC").
		Find(&images).Error; err != nil {
		http.Error(w, "Failed to fetch images", http.StatusInternalServerError)
		return
	}

	// Convert to JSON and return
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Simple JSON response construction
	// In a real application, you'd use json.Marshal or a JSON encoder
	jsonResponse := `{"total":` + strconv.FormatInt(count, 10) + `,"page":` + strconv.Itoa(page) + `,"images":[`

	for i, img := range images {
		if i > 0 {
			jsonResponse += ","
		}
		jsonResponse += `{"id":"` + img.ID + `","user_id":"` + img.UserID + `","image_type":"` + img.ImageType + `","image_name":"` + img.ImageName + `","size":` + strconv.FormatInt(img.Size, 10) + `}`
	}

	jsonResponse += `]}`
	w.Write([]byte(jsonResponse))
}

// GetImageById retrieves a specific image by ID
func (ic *ImageController) GetImageById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	imageID := vars["id"]

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		return
	}

	var image models.UserImage
	if err := ic.DB.Where("id = ? AND user_id = ?", imageID, userID).First(&image).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "Image not found", http.StatusNotFound)
		} else {
			http.Error(w, "Failed to fetch image", http.StatusInternalServerError)
		}
		return
	}

	// Set appropriate content type and return image data
	w.Header().Set("Content-Disposition", "inline; filename="+image.ImageName)
	w.Header().Set("Content-Type", image.ImageType)
	w.WriteHeader(http.StatusOK)
	w.Write(image.ImageData)
}

// DeleteImage deletes an image
func (ic *ImageController) DeleteImage(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	imageID := vars["id"]

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		return
	}

	// Find and delete the image
	result := ic.DB.Where("id = ? AND user_id = ?", imageID, userID).Delete(&models.UserImage{})
	if result.Error != nil {
		http.Error(w, "Failed to delete image", http.StatusInternalServerError)
		return
	}

	if result.RowsAffected == 0 {
		http.Error(w, "Image not found or already deleted", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message":"Image deleted successfully"}`))
}

// Helper function to validate image types
// Helper function to validate image types
func isValidImageType(ext string) bool {
	validExtensions := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
	}
	return validExtensions[strings.ToLower(ext)]
}
