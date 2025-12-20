# API Overview

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## API Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string (min 6 chars)",
  "role": "parent" | "teacher" | "admin",
  "phone": "string (optional)",
  "address": "string (optional)"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### POST `/api/auth/login`
Login user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** Same as register

#### GET `/api/auth/me`
Get current authenticated user.

**Headers:** Authorization required

**Response:**
```json
{
  "_id": "user_id",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "role": "string",
  "phone": "string",
  "address": "string"
}
```

---

### Students (`/api/students`)

#### GET `/api/students`
Get all students (filtered by user role).

**Headers:** Authorization required

**Query Parameters:**
- None (automatically filtered by role)

**Response:** Array of student objects

#### GET `/api/students/:id`
Get single student by ID.

**Headers:** Authorization required

**Response:** Student object with populated parent and teacher references

#### POST `/api/students`
Create new student (Teacher/Admin only).

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "studentId": "string (unique)",
  "dateOfBirth": "ISO date string",
  "grade": "string",
  "section": "string (optional)",
  "parentIds": ["parent_id1", "parent_id2"],
  "subjects": ["Math", "Science"]
}
```

#### PUT `/api/students/:id`
Update student (Teacher/Admin only).

#### DELETE `/api/students/:id`
Delete student (Admin only).

---

### Grades (`/api/grades`)

#### GET `/api/grades`
Get grades with optional filters.

**Query Parameters:**
- `studentId`: Filter by student
- `subject`: Filter by subject
- `gradeType`: Filter by type (assignment, quiz, exam, etc.)
- `startDate`: Filter from date
- `endDate`: Filter to date

**Response:** Array of grade objects with populated student and teacher

#### GET `/api/grades/:id`
Get single grade.

#### POST `/api/grades`
Create grade (Teacher/Admin only).

**Request Body:**
```json
{
  "studentId": "student_id",
  "subject": "string",
  "grade": "number (0-100)",
  "maxGrade": "number (default 100)",
  "gradeType": "assignment" | "quiz" | "exam" | "project" | "participation",
  "comments": "string (optional)",
  "assignmentId": "assignment_id (optional)",
  "date": "ISO date string"
}
```

#### PUT `/api/grades/:id`
Update grade (Teacher/Admin only).

#### DELETE `/api/grades/:id`
Delete grade (Teacher/Admin only).

---

### Assignments (`/api/assignments`)

#### GET `/api/assignments`
Get assignments with optional filters.

**Query Parameters:**
- `studentId`: Filter by student
- `subject`: Filter by subject
- `status`: Filter by status (draft, published, closed)

**Response:** Array of assignment objects

#### GET `/api/assignments/:id`
Get single assignment.

#### POST `/api/assignments`
Create assignment (Teacher/Admin only).

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "subject": "string",
  "studentIds": ["student_id1", "student_id2"],
  "dueDate": "ISO date string",
  "maxGrade": "number (default 100)",
  "status": "draft" | "published" | "closed"
}
```

#### PUT `/api/assignments/:id`
Update assignment (Teacher/Admin only).

#### DELETE `/api/assignments/:id`
Delete assignment (Teacher/Admin only).

---

### Attendance (`/api/attendance`)

#### GET `/api/attendance`
Get attendance records with filters.

**Query Parameters:**
- `studentId`: Filter by student
- `status`: Filter by status (present, absent, late, excused)
- `subject`: Filter by subject
- `startDate`: Filter from date
- `endDate`: Filter to date

**Response:** Array of attendance objects

#### POST `/api/attendance`
Create attendance record (Teacher/Admin only).

**Request Body:**
```json
{
  "studentId": "student_id",
  "date": "ISO date string",
  "status": "present" | "absent" | "late" | "excused",
  "subject": "string (optional)",
  "notes": "string (optional)"
}
```

#### PUT `/api/attendance/:id`
Update attendance record (Teacher/Admin only).

#### DELETE `/api/attendance/:id`
Delete attendance record (Teacher/Admin only).

---

### Behavior Reports (`/api/behavior`)

#### GET `/api/behavior`
Get behavior reports with filters.

**Query Parameters:**
- `studentId`: Filter by student
- `type`: Filter by type (positive, negative, neutral)
- `category`: Filter by category (academic, social, behavioral, etc.)
- `subject`: Filter by subject
- `startDate`: Filter from date
- `endDate`: Filter to date

**Response:** Array of behavior report objects

#### POST `/api/behavior`
Create behavior report (Teacher/Admin only).

**Request Body:**
```json
{
  "studentId": "student_id",
  "type": "positive" | "negative" | "neutral",
  "category": "academic" | "social" | "behavioral" | "participation" | "other",
  "title": "string",
  "description": "string",
  "date": "ISO date string",
  "severity": "low" | "medium" | "high",
  "subject": "string (optional)"
}
```

#### PUT `/api/behavior/:id`
Update behavior report (Teacher/Admin only).

#### DELETE `/api/behavior/:id`
Delete behavior report (Teacher/Admin only).

---

### Messages (`/api/messages`)

#### GET `/api/messages`
Get messages/conversations.

**Query Parameters:**
- `conversationWith`: Filter by user ID
- `studentId`: Filter by student

**Response:** Array of message objects

#### GET `/api/messages/conversations`
Get list of conversations with unread counts.

**Response:** Array of conversation objects with partner info and unread count

#### POST `/api/messages`
Send message.

**Request Body:**
```json
{
  "receiverId": "user_id",
  "studentId": "student_id (optional)",
  "subject": "string (optional)",
  "content": "string",
  "attachments": [] // Future implementation
}
```

#### PUT `/api/messages/:id/read`
Mark message as read.

#### GET `/api/messages/unread-count`
Get unread message count.

**Response:**
```json
{
  "unreadCount": "number"
}
```

---

### Meetings (`/api/meetings`)

#### GET `/api/meetings`
Get meetings with filters.

**Query Parameters:**
- `status`: Filter by status (pending, confirmed, cancelled, completed)
- `startDate`: Filter from date
- `endDate`: Filter to date

**Response:** Array of meeting objects

#### POST `/api/meetings`
Schedule meeting.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "parentId": "user_id",
  "teacherId": "user_id",
  "studentId": "student_id",
  "scheduledDate": "ISO date string",
  "duration": "number (minutes, default 30)",
  "location": "in-person" | "online" | "phone",
  "meetingLink": "string (optional, required if online)",
  "notes": "string (optional)"
}
```

#### PUT `/api/meetings/:id`
Update meeting.

#### PUT `/api/meetings/:id/status`
Update meeting status.

**Request Body:**
```json
{
  "status": "pending" | "confirmed" | "cancelled" | "completed"
}
```

#### DELETE `/api/meetings/:id`
Delete meeting.

---

### Announcements (`/api/announcements`)

#### GET `/api/announcements`
Get announcements (filtered by role and target audience).

**Query Parameters:**
- `priority`: Filter by priority (low, medium, high, urgent)
- `targetAudience`: Filter by audience (all, parents, teachers, specific)

**Response:** Array of announcement objects

#### POST `/api/announcements`
Create announcement (Teacher/Admin only).

**Request Body:**
```json
{
  "title": "string",
  "content": "string",
  "targetAudience": "all" | "parents" | "teachers" | "specific",
  "targetStudentIds": ["student_id1", "student_id2"], // Required if specific
  "priority": "low" | "medium" | "high" | "urgent",
  "expiresAt": "ISO date string (optional)"
}
```

#### PUT `/api/announcements/:id`
Update announcement (Teacher/Admin only).

#### DELETE `/api/announcements/:id`
Delete announcement (Teacher/Admin only).

---

### Users (`/api/users`)

#### GET `/api/users`
Get users (filtered by role - parents see teachers, teachers see parents).

**Response:** Array of user objects (without passwords)

#### GET `/api/users/:id`
Get single user.

#### PUT `/api/users/profile`
Update own profile.

**Request Body:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional)",
  "address": "string (optional)",
  "profilePicture": "string (optional)"
}
```

#### PUT `/api/users/password`
Change password.

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string (min 6 chars)"
}
```

#### PUT `/api/users/:id`
Update user (Admin only).

---

## Error Responses

All endpoints return consistent error responses:

**400 Bad Request:**
```json
{
  "message": "Error message",
  "errors": [] // Validation errors if applicable
}
```

**401 Unauthorized:**
```json
{
  "message": "No token, authorization denied"
}
```

**403 Forbidden:**
```json
{
  "message": "Access denied. Insufficient permissions."
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Server error"
}
```

## Rate Limiting

Currently not implemented. Recommended for production:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

## Pagination

Currently not implemented. Recommended for production:
- Limit: 50 items per page
- Skip: Based on page number
- Query parameters: `?page=1&limit=50`

