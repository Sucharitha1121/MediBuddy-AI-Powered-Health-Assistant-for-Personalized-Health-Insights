package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// UserImage model to store images associated with users
type UserImage struct {
	ID        string    `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	UserID    string    `gorm:"type:uuid;not null;index" json:"userId"`
	User      User      `gorm:"foreignKey:UserID" json:"-"`
	ImageData []byte    `gorm:"type:bytea;not null" json:"-"`               // Actual image binary data
	ImageType string    `gorm:"type:varchar(50);not null" json:"imageType"` // MIME type (e.g., image/jpeg)
	ImageName string    `gorm:"type:varchar(255)" json:"imageName"`         // Original filename
	Size      int64     `gorm:"type:bigint" json:"size"`                    // File size in bytes
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// BeforeCreate will set ID if not provided
func (ui *UserImage) BeforeCreate(tx *gorm.DB) (err error) {
	if ui.ID == "" {
		ui.ID = uuid.New().String()
	}
	return
}
