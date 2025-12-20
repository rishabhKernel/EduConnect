# Database Schema Design

## Overview

The Parent-Teacher Communication Portal uses MongoDB as the database with Mongoose ODM. The database consists of 9 main collections that handle users, students, academic records, communication, and administrative functions.

## Entity Relationship Diagram

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│   User   │────────▶│ Student  │◀────────│   User   │
│ (Parent) │         └──────────┘         │(Teacher) │
└──────────┘              │                └──────────┘
     │                    │                      │
     │                    │                      │
     │                    ▼                      │
     │              ┌──────────┐                │
     │              │  Grade   │                │
     │              └──────────┘                │
     │                    │                      │
     │                    ▼                      │
     │              ┌──────────┐                │
     │              │Assignment│                │
     │              └──────────┘                │
     │                    │                      │
     │                    ▼                      │
     │              ┌──────────┐                │
     │              │Attendance│                │
     │              └──────────┘                │
     │                    │                      │
     │                    ▼                      │
     │              ┌──────────┐                │
     │              │ Behavior │                │
     │              └──────────┘                │
     │                    │                      │
     │                    │                      │
     └────────────────────┼──────────────────────┘
                          │
                          ▼
                   ┌──────────┐
                   │ Message  │
                   └──────────┘
                          │
                          ▼
                   ┌──────────┐
                   │ Meeting  │
                   └──────────┘
                          │
                          ▼
                   ┌──────────┐
                   │Announce. │
                   └──────────┘
```

## Collection Schemas

### 1. Users Collection

**Purpose**: Stores all user accounts (Parents, Teachers, Admins)

**Schema**:
```javascript
{
  firstName: String (required, trimmed)
  lastName: String (required, trimmed)
  email: String (required, unique, lowercase, trimmed)
  password: String (required, minlength: 6, hashed with bcrypt)
  role: Enum ['parent', 'teacher', 'admin'] (required)
  phone: String (optional, trimmed)
  address: String (optional, trimmed)
  profilePicture: String (default: '')
  associatedIds: [ObjectId] (references Student)
  isActive: Boolean (default: true)
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes**:
- `email`: Unique index
- `role`: Index for role-based queries

**Relationships**:
- One-to-Many with Students (via `associatedIds` for parents)
- One-to-Many with Grades (via `teacherId`)
- One-to-Many with Assignments (via `teacherId`)
- One-to-Many with Attendance (via `teacherId`)
- One-to-Many with Behavior (via `teacherId`)
- One-to-Many with Messages (via `senderId` and `receiverId`)
- One-to-Many with Meetings (via `parentId` and `teacherId`)
- One-to-Many with Announcements (via `authorId`)

**Security**:
- Password is hashed using bcrypt with 10 salt rounds
- Password comparison method available for authentication

---

### 2. Students Collection

**Purpose**: Stores student information and links them to parents and teachers

**Schema**:
```javascript
{
  firstName: String (required, trimmed)
  lastName: String (required, trimmed)
  studentId: String (required, unique, trimmed)
  dateOfBirth: Date (required)
  grade: String (required, trimmed) // e.g., "Grade 5", "Class 10"
  section: String (optional, trimmed) // e.g., "A", "B"
  parentIds: [ObjectId] (required, references User)
  teacherIds: [ObjectId] (references User)
  subjects: [String] (trimmed)
  profilePicture: String (default: '')
  enrollmentDate: Date (default: Date.now)
  isActive: Boolean (default: true)
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes**:
- `studentId`: Unique index
- `parentIds`: Index for parent queries
- `teacherIds`: Index for teacher queries

**Relationships**:
- Many-to-Many with Users (Parents via `parentIds`)
- Many-to-Many with Users (Teachers via `teacherIds`)
- One-to-Many with Grades (via `studentId`)
- One-to-Many with Assignments (via `studentIds` array)
- One-to-Many with Attendance (via `studentId`)
- One-to-Many with Behavior (via `studentId`)
- One-to-Many with Messages (via `studentId`)
- One-to-Many with Meetings (via `studentId`)
- One-to-Many with Announcements (via `targetStudentIds`)

---

### 3. Grades Collection

**Purpose**: Tracks student academic performance across different subjects and assessment types

**Schema**:
```javascript
{
  studentId: ObjectId (required, references Student)
  teacherId: ObjectId (required, references User)
  subject: String (required, trimmed)
  assignmentId: ObjectId (optional, references Assignment)
  grade: Number (required, min: 0, max: 100)
  maxGrade: Number (default: 100)
  gradeType: Enum ['assignment', 'quiz', 'exam', 'project', 'participation', 'other'] (default: 'assignment')
  comments: String (optional, trimmed)
  date: Date (required, default: Date.now)
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes**:
- `studentId`: Index for student grade queries
- `subject`: Index for subject-based filtering
- `date`: Index for date range queries
- Compound: `{ studentId: 1, subject: 1, date: -1 }`

**Relationships**:
- Many-to-One with Student (via `studentId`)
- Many-to-One with User/Teacher (via `teacherId`)
- Many-to-One with Assignment (via `assignmentId`, optional)

**Use Cases**:
- Calculate GPA per subject
- Track grade trends over time
- Filter by grade type (exam, quiz, assignment)
- Link grades to specific assignments

---

### 4. Assignments Collection

**Purpose**: Manages assignments created by teachers for students

**Schema**:
```javascript
{
  title: String (required, trimmed)
  description: String (optional, trimmed)
  subject: String (required, trimmed)
  teacherId: ObjectId (required, references User)
  studentIds: [ObjectId] (references Student)
  dueDate: Date (required)
  maxGrade: Number (default: 100)
  attachments: [{
    filename: String
    url: String
    uploadedAt: Date
  }]
  status: Enum ['draft', 'published', 'closed'] (default: 'published')
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes**:
- `teacherId`: Index for teacher's assignments
- `studentIds`: Index for student assignment queries
- `dueDate`: Index for due date filtering
- `status`: Index for status filtering

**Relationships**:
- Many-to-One with User/Teacher (via `teacherId`)
- Many-to-Many with Students (via `studentIds` array)
- One-to-Many with Grades (via `assignmentId`)

**Use Cases**:
- Track assignment deadlines
- Filter by subject and status
- Link grades to assignments
- Manage assignment lifecycle (draft → published → closed)

---

### 5. Attendance Collection

**Purpose**: Records student attendance for classes and subjects

**Schema**:
```javascript
{
  studentId: ObjectId (required, references Student)
  teacherId: ObjectId (required, references User)
  date: Date (required, default: Date.now)
  status: Enum ['present', 'absent', 'late', 'excused'] (required)
  subject: String (optional, trimmed)
  notes: String (optional, trimmed)
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes**:
- Compound: `{ studentId: 1, date: 1 }` (unique constraint for daily attendance)
- `status`: Index for status filtering
- `date`: Index for date range queries

**Relationships**:
- Many-to-One with Student (via `studentId`)
- Many-to-One with User/Teacher (via `teacherId`)

**Use Cases**:
- Calculate attendance percentage
- Track attendance patterns
- Filter by date range and status
- Subject-specific attendance tracking

---

### 6. Behavior Collection

**Purpose**: Records behavioral observations and incidents for students

**Schema**:
```javascript
{
  studentId: ObjectId (required, references Student)
  teacherId: ObjectId (required, references User)
  type: Enum ['positive', 'negative', 'neutral'] (required)
  category: Enum ['academic', 'social', 'behavioral', 'participation', 'other'] (required)
  title: String (required, trimmed)
  description: String (required, trimmed)
  date: Date (required, default: Date.now)
  severity: Enum ['low', 'medium', 'high'] (default: 'medium')
  subject: String (optional, trimmed)
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes**:
- `studentId`: Index for student behavior queries
- `type`: Index for filtering positive/negative behaviors
- `date`: Index for date range queries
- Compound: `{ studentId: 1, type: 1, date: -1 }`

**Relationships**:
- Many-to-One with Student (via `studentId`)
- Many-to-One with User/Teacher (via `teacherId`)

**Use Cases**:
- Track behavioral patterns
- Filter by type (positive/negative)
- Monitor severity levels
- Subject-specific behavior tracking

---

### 7. Messages Collection

**Purpose**: Enables secure communication between parents and teachers

**Schema**:
```javascript
{
  senderId: ObjectId (required, references User)
  receiverId: ObjectId (required, references User)
  studentId: ObjectId (optional, references Student)
  subject: String (optional, trimmed)
  content: String (required, trimmed)
  attachments: [{
    filename: String
    url: String
    uploadedAt: Date
  }]
  isRead: Boolean (default: false)
  readAt: Date (optional)
  createdAt: Date (default: Date.now)
}
```

**Indexes**:
- Compound: `{ senderId: 1, receiverId: 1, createdAt: -1 }` (efficient conversation queries)
- `receiverId`: Index for inbox queries
- `isRead`: Index for unread message queries
- `studentId`: Index for student-related messages

**Relationships**:
- Many-to-One with User (via `senderId`)
- Many-to-One with User (via `receiverId`)
- Many-to-One with Student (via `studentId`, optional)

**Use Cases**:
- Real-time messaging between parents and teachers
- Track read/unread status
- Link messages to specific students
- Conversation threading

---

### 8. Meetings Collection

**Purpose**: Manages scheduled meetings between parents and teachers

**Schema**:
```javascript
{
  title: String (required, trimmed)
  description: String (optional, trimmed)
  parentId: ObjectId (required, references User)
  teacherId: ObjectId (required, references User)
  studentId: ObjectId (required, references Student)
  scheduledDate: Date (required)
  duration: Number (default: 30) // minutes
  status: Enum ['pending', 'confirmed', 'cancelled', 'completed'] (default: 'pending')
  location: Enum ['in-person', 'online', 'phone'] (default: 'in-person')
  meetingLink: String (optional, trimmed) // Required if location is 'online'
  notes: String (optional, trimmed)
  requestedBy: Enum ['parent', 'teacher'] (required)
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes**:
- `parentId`: Index for parent's meetings
- `teacherId`: Index for teacher's meetings
- `studentId`: Index for student-related meetings
- `scheduledDate`: Index for date-based queries
- `status`: Index for status filtering

**Relationships**:
- Many-to-One with User (via `parentId`)
- Many-to-One with User (via `teacherId`)
- Many-to-One with Student (via `studentId`)

**Use Cases**:
- Schedule and manage parent-teacher meetings
- Track meeting status and history
- Support multiple meeting types (in-person, online, phone)
- Calendar integration

---

### 9. Announcements Collection

**Purpose**: Broadcasts announcements to parents, teachers, or specific students

**Schema**:
```javascript
{
  title: String (required, trimmed)
  content: String (required, trimmed)
  authorId: ObjectId (required, references User)
  targetAudience: Enum ['all', 'parents', 'teachers', 'specific'] (default: 'all')
  targetStudentIds: [ObjectId] (references Student) // Required if targetAudience is 'specific'
  priority: Enum ['low', 'medium', 'high', 'urgent'] (default: 'medium')
  attachments: [{
    filename: String
    url: String
    uploadedAt: Date
  }]
  isActive: Boolean (default: true)
  expiresAt: Date (optional)
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

**Indexes**:
- `authorId`: Index for author queries
- `targetAudience`: Index for audience filtering
- `targetStudentIds`: Index for specific student announcements
- `priority`: Index for priority-based sorting
- `isActive`: Index for active announcements
- `expiresAt`: Index for expiration queries

**Relationships**:
- Many-to-One with User (via `authorId`)
- Many-to-Many with Students (via `targetStudentIds`)

**Use Cases**:
- Broadcast announcements to all users
- Target specific audiences (parents, teachers)
- Send announcements to specific students' parents
- Priority-based announcement display
- Time-based expiration

---

## Database Design Principles

### 1. Normalization
- **3NF Compliance**: All collections are normalized to avoid data redundancy
- **Referential Integrity**: Using MongoDB ObjectId references with Mongoose population
- **Atomic Operations**: Each document represents a single entity

### 2. Indexing Strategy
- **Primary Keys**: All collections use MongoDB's default `_id` as primary key
- **Unique Constraints**: Email, studentId have unique indexes
- **Query Optimization**: Compound indexes on frequently queried fields
- **Date Indexes**: All date fields are indexed for range queries

### 3. Data Relationships
- **One-to-Many**: Implemented using ObjectId references (e.g., Student → Grades)
- **Many-to-Many**: Implemented using arrays of ObjectIds (e.g., Students ↔ Assignments)
- **Population**: Mongoose `.populate()` used for efficient data retrieval

### 4. Data Validation
- **Schema-Level**: Mongoose schema validation for required fields and types
- **Enum Constraints**: Restricted values for status, role, type fields
- **Custom Validators**: Password strength, email format validation

### 5. Security Considerations
- **Password Hashing**: bcrypt with 10 salt rounds
- **No Sensitive Data**: Passwords never stored in plain text
- **Access Control**: Role-based filtering at application level

### 6. Scalability
- **Horizontal Scaling**: MongoDB sharding support
- **Index Optimization**: Efficient indexes for large datasets
- **Pagination Ready**: Schema supports pagination queries

---

## Data Flow Examples

### Example 1: Parent Viewing Student Grades
```
1. Parent logs in → User collection (role: 'parent')
2. Query Student collection → Find students where parentIds includes parent's _id
3. Query Grade collection → Find grades where studentId matches student's _id
4. Populate teacherId and assignmentId for complete information
5. Return aggregated grade data to frontend
```

### Example 2: Teacher Creating Assignment
```
1. Teacher creates assignment → Assignment collection
2. Link to students via studentIds array
3. When grading → Create Grade document with assignmentId reference
4. Parents can view assignment and associated grades
```

### Example 3: Messaging Flow
```
1. Parent sends message → Message collection (senderId: parent, receiverId: teacher)
2. Teacher receives notification → Query messages where receiverId = teacher and isRead = false
3. Teacher reads message → Update isRead = true, readAt = current date
4. Conversation threading via senderId/receiverId compound index
```

---

## Future Enhancements

1. **File Storage**: Integration with cloud storage (AWS S3, Cloudinary) for attachments
2. **Audit Logs**: Separate collection for tracking all data modifications
3. **Notifications**: Dedicated collection for push notifications and email tracking
4. **Analytics**: Aggregated data collection for reporting and analytics
5. **Soft Deletes**: Add `deletedAt` field for soft delete functionality
6. **Versioning**: Document versioning for critical data (grades, attendance)

