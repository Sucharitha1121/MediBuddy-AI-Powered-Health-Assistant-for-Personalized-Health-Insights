package models

import (
	"time"

	"github.com/google/uuid"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/datatypes"
)

// User Model
type User struct {
	ID         string       `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Name       string       `gorm:"not null" json:"name"`
	Email      string       `gorm:"unique;not null" json:"email"`
	Password   string       `gorm:"not null" json:"-"`
	CreatedAt  time.Time    `json:"createdAt"`
	UpdatedAt  time.Time    `json:"updatedAt"`
	HealthData []HealthData `gorm:"foreignKey:UserID" json:"healthData"`

	// New Fields for Personal Information
	Gender    string      `gorm:"type:varchar(10)" json:"gender"`
	BirthDate *time.Time  `gorm:"type:date;default:null" json:"birthDate"`
	Height    int         `gorm:"type:int" json:"height"`
	Weight    int         `gorm:"type:int" json:"weight"`
	Ethnicity string      `gorm:"type:varchar(50)" json:"ethnicity"`
	Country   string      `gorm:"type:varchar(50)" json:"country"`
	Images    []*UserImage `gorm:"foreignKey:UserID" json:"images,omitempty"`
}

// Health Data Model
type HealthData struct {
	ID     uuid.UUID      `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	UserID uuid.UUID      `json:"user_id" gorm:"type:uuid;not null"`
	Data   datatypes.JSON `json:"data" gorm:"type:jsonb"`
}

// Login Input Struct
type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// Signup Input Struct
type SignupInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// HashPassword hashes the user's password before storing it
func (user *User) HashPassword() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	return nil
}

// CheckPassword compares hashed password with user input
func (user *User) CheckPassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
}
