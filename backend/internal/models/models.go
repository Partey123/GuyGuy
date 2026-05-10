package models

import (
	"time"

	"github.com/lib/pq"
)

// User represents a user in the system
type User struct {
	ID        string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	Phone     string    `gorm:"type:varchar(20);uniqueIndex" json:"phone"`
	Email     *string   `gorm:"type:varchar(255);uniqueIndex" json:"email"`
	FullName  string    `gorm:"type:varchar(255)" json:"full_name"`
	Role      string    `gorm:"type:varchar(20)" json:"role"`
	AvatarURL *string   `gorm:"type:text" json:"avatar_url"`
	FCMToken  *string   `gorm:"type:text" json:"fcm_token"`
	IsActive  bool      `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time `gorm:"autoCreateTime:milli" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime:milli" json:"updated_at"`
}

func (User) TableName() string {
	return "users"
}

// ArtisanProfile represents an artisan's profile
type ArtisanProfile struct {
	ID                    string         `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	UserID                string         `gorm:"type:uuid;index" json:"user_id"`
	Bio                   *string        `gorm:"type:text" json:"bio"`
	SkillCategory         string         `gorm:"type:varchar(100);index" json:"skill_category"`
	SkillTags             pq.StringArray `gorm:"type:text[]" json:"skill_tags"`
	YearsExperience       *int           `json:"years_experience"`
	ServiceArea           *string        `gorm:"type:varchar(255)" json:"service_area"`
	IDDocumentURL         *string        `gorm:"type:text" json:"id_document_url"`
	VerificationStatus    string         `gorm:"type:varchar(20);index;default:'pending'" json:"verification_status"`
	VerificationNote      *string        `gorm:"type:text" json:"verification_note"`
	BadgeTier             string         `gorm:"type:varchar(20);index;default:'none'" json:"badge_tier"`
	RatingAverage         float64        `gorm:"type:numeric(3,2);default:0" json:"rating_average"`
	RatingCount           int            `gorm:"default:0" json:"rating_count"`
	JobsCompleted         int            `gorm:"default:0" json:"jobs_completed"`
	IsAvailable           bool           `gorm:"index;default:true" json:"is_available"`
	ShareableSlug         *string        `gorm:"type:varchar(100);uniqueIndex" json:"shareable_slug"`
	MoMoNumber            *string        `gorm:"type:varchar(15)" json:"momo_number"`
	MoMoNetwork           *string        `gorm:"type:varchar(10)" json:"momo_network"`
	PaystackRecipientCode *string        `gorm:"type:varchar(100)" json:"paystack_recipient_code"`
	CreatedAt             time.Time      `gorm:"autoCreateTime:milli" json:"created_at"`
	UpdatedAt             time.Time      `gorm:"autoUpdateTime:milli" json:"updated_at"`
}

func (ArtisanProfile) TableName() string {
	return "artisan_profiles"
}

// Booking represents a booking/job
type Booking struct {
	ID                 string         `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	ClientID           string         `gorm:"type:uuid;index" json:"client_id"`
	ArtisanID          string         `gorm:"type:uuid;index" json:"artisan_id"`
	Title              string         `gorm:"type:varchar(255)" json:"title"`
	Description        string         `gorm:"type:text" json:"description"`
	JobType            string         `gorm:"type:varchar(20);default:'labour_only'" json:"job_type"`
	LabourAmount       float64        `gorm:"type:numeric(10,2)" json:"labour_amount"`
	MaterialsAmount    float64        `gorm:"type:numeric(10,2);default:0" json:"materials_amount"`
	TotalAmount        float64        `gorm:"type:numeric(10,2)" json:"total_amount"`
	LocationAddress    *string        `gorm:"type:text" json:"location_address"`
	JobPhotos          pq.StringArray `gorm:"type:text[]" json:"job_photos"`
	ScheduledDate      *time.Time     `json:"scheduled_date"`
	ScheduledTime      *string        `gorm:"type:time" json:"scheduled_time"`
	Status             string         `gorm:"type:varchar(30);index;default:'pending'" json:"status"`
	ArtisanCompletedAt *time.Time     `json:"artisan_completed_at"`
	ClientConfirmedAt  *time.Time     `json:"client_confirmed_at"`
	AutoReleaseAt      *time.Time     `json:"auto_release_at"`
	CreatedAt          time.Time      `gorm:"autoCreateTime:milli" json:"created_at"`
	UpdatedAt          time.Time      `gorm:"autoUpdateTime:milli" json:"updated_at"`
}

func (Booking) TableName() string {
	return "bookings"
}

// Payment represents a payment
type Payment struct {
	ID                    string     `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	BookingID             string     `gorm:"type:uuid;index" json:"booking_id"`
	PayerID               string     `gorm:"type:uuid" json:"payer_id"`
	PaystackReference     string     `gorm:"type:varchar(255);uniqueIndex" json:"paystack_reference"`
	PaystackTransactionID *string    `gorm:"type:varchar(255)" json:"paystack_transaction_id"`
	Amount                float64    `gorm:"type:numeric(10,2)" json:"amount"`
	CommissionBasisAmount float64    `gorm:"type:numeric(10,2)" json:"commission_basis_amount"`
	CommissionAmount      float64    `gorm:"type:numeric(10,2)" json:"commission_amount"`
	ArtisanPayoutAmount   float64    `gorm:"type:numeric(10,2)" json:"artisan_payout_amount"`
	Currency              string     `gorm:"type:varchar(10);default:'GHS'" json:"currency"`
	PaymentMethod         *string    `gorm:"type:varchar(30)" json:"payment_method"`
	Status                string     `gorm:"type:varchar(20);default:'pending'" json:"status"`
	EscrowReleasedAt      *time.Time `json:"escrow_released_at"`
	PayoutReference       *string    `gorm:"type:varchar(255)" json:"payout_reference"`
	PayoutStatus          string     `gorm:"type:varchar(20);default:'pending'" json:"payout_status"`
	CreatedAt             time.Time  `gorm:"autoCreateTime:milli" json:"created_at"`
	UpdatedAt             time.Time  `gorm:"autoUpdateTime:milli" json:"updated_at"`
}

func (Payment) TableName() string {
	return "payments"
}

// Message represents a message in chat
type Message struct {
	ID        string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	BookingID string    `gorm:"type:uuid;index" json:"booking_id"`
	SenderID  string    `gorm:"type:uuid" json:"sender_id"`
	Content   string    `gorm:"type:text" json:"content"`
	IsRead    bool      `gorm:"default:false" json:"is_read"`
	CreatedAt time.Time `gorm:"autoCreateTime:milli" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime:milli" json:"updated_at"`
}

func (Message) TableName() string {
	return "messages"
}

// Review represents a review
type Review struct {
	ID        string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	BookingID string    `gorm:"type:uuid;uniqueIndex" json:"booking_id"`
	ClientID  string    `gorm:"type:uuid" json:"client_id"`
	ArtisanID string    `gorm:"type:uuid" json:"artisan_id"`
	Rating    int       `json:"rating"`
	Comment   *string   `gorm:"type:text" json:"comment"`
	CreatedAt time.Time `gorm:"autoCreateTime:milli" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime:milli" json:"updated_at"`
}

func (Review) TableName() string {
	return "reviews"
}

// Notification represents a notification
type Notification struct {
	ID          string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	UserID      string    `gorm:"type:uuid;index" json:"user_id"`
	Type        string    `gorm:"type:varchar(50)" json:"type"`
	Title       string    `gorm:"type:varchar(255)" json:"title"`
	Body        string    `gorm:"type:text" json:"body"`
	ReferenceID *string   `gorm:"type:uuid" json:"reference_id"`
	IsRead      bool      `gorm:"default:false" json:"is_read"`
	CreatedAt   time.Time `gorm:"autoCreateTime:milli" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime:milli" json:"updated_at"`
}

func (Notification) TableName() string {
	return "notifications"
}
