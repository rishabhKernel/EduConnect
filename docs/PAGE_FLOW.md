# Page Flow & User Navigation

## Overview

This document outlines the complete user flow, page navigation, and routing structure for the Parent-Teacher Communication Portal. It covers all user roles and their respective navigation paths.

---

## Application Flow Diagram

```
                    ┌─────────────────┐
                    │  Landing Page   │
                    │       (/)        │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
         ┌──────▼──────┐          ┌──────▼──────┐
         │   Login     │          │  Register   │
         │  (/login)   │          │ (/register) │
         └──────┬──────┘          └──────┬──────┘
                │                         │
                └────────────┬────────────┘
                             │
                    ┌────────▼────────┐
                    │  Authentication │
                    │   (JWT Token)   │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
         ┌──────▼──────┐          ┌───────▼───────┐
         │   Parent    │          │   Teacher     │
         │  Dashboard  │          │   Dashboard   │
         └──────┬──────┘          └───────┬───────┘
                │                         │
    ┌────────────┼────────────┐   ┌───────┼────────────┐
    │            │            │   │       │            │
┌───▼───┐  ┌─────▼─────┐ ┌───▼───┐ ┌───▼───┐ ┌───────▼─────┐
│Progress│  │Assignments│ │Attendance│ │Progress│ │Assignments│
└───┬───┘  └─────┬─────┘ └───┬───┘ └───┬───┘ └───────┬─────┘
    │            │            │         │             │
    └────────────┼────────────┼─────────┼─────────────┘
                 │            │         │
         ┌───────▼────────────▼─────────▼───────┐
         │     Shared Modules (All Roles)       │
         │  Messaging │ Meetings │ Announcements│
         │  Behavior  │ Profile  │              │
         └───────────────────────────────────────┘
```

---

## Public Routes (Unauthenticated)

### 1. Landing Page (`/`)
**Access**: Public  
**Purpose**: Introduction and entry point

**Flow**:
- User lands on homepage
- View platform features and benefits
- Navigation options:
  - "Login" button → `/login`
  - "Register" button → `/register`
  - "Learn More" → Scroll to features section

**Components**:
- Header with logo
- Hero section
- Features section
- Call-to-action buttons
- Footer

---

### 2. Login Page (`/login`)
**Access**: Public (redirects if already authenticated)  
**Purpose**: User authentication

**Flow**:
1. User enters email and password
2. Click "Login" button
3. Backend validates credentials
4. JWT token generated and stored
5. Redirect based on role:
   - Parent → `/parent/dashboard`
   - Teacher → `/teacher/dashboard`
   - Admin → `/admin/dashboard` (optional)

**Form Fields**:
- Email (required)
- Password (required)
- "Remember Me" checkbox (optional)
- "Forgot Password" link (future)

**Navigation**:
- "Don't have an account? Register" → `/register`
- "Back to Home" → `/`

**Error Handling**:
- Invalid credentials → Show error message
- Network error → Show connection error

---

### 3. Register Page (`/register`)
**Access**: Public (redirects if already authenticated)  
**Purpose**: New user registration

**Flow**:
1. User fills registration form
2. Select role (Parent/Teacher/Admin)
3. Submit form
4. Backend creates account
5. Auto-login with JWT token
6. Redirect to respective dashboard

**Form Fields**:
- First Name (required)
- Last Name (required)
- Email (required, unique)
- Password (required, min 6 chars)
- Confirm Password (required)
- Role (required, dropdown)
- Phone (optional)
- Address (optional)

**Navigation**:
- "Already have an account? Login" → `/login`
- "Back to Home" → `/`

**Validation**:
- Email format validation
- Password strength check
- Email uniqueness check
- Password match verification

---

## Protected Routes (Authenticated)

All protected routes require JWT authentication. Unauthenticated users are redirected to `/login`.

---

## Parent Routes

### 4. Parent Dashboard (`/parent/dashboard`)
**Access**: Parent role only  
**Purpose**: Central hub for parents

**Flow**:
1. Parent logs in → Redirected here
2. View quick stats and student list
3. Navigate to specific modules via:
   - Sidebar navigation
   - Quick action cards
   - Student selection

**Navigation Options**:
- Student Progress → `/student-progress`
- Assignments → `/assignments`
- Attendance → `/attendance`
- Behavior Reports → `/behavior-reports`
- Messaging → `/messaging`
- Meetings → `/meetings`
- Announcements → `/announcements`
- Profile → `/profile`
- Logout → `/login`

**Quick Actions**:
- View [Student Name] Progress
- Check Assignments
- View Attendance
- Send Message
- Schedule Meeting

---

### 5. Student Progress (`/student-progress`)
**Access**: Parent, Teacher  
**Purpose**: View student academic performance

**Flow**:
1. Navigate from dashboard or sidebar
2. If multiple children, select student (Parents only)
3. View progress overview with charts
4. Apply filters (subject, date, grade type)
5. View detailed grade list
6. Switch between Summary/Detailed/Behavior views

**Filters**:
- Student selector (if multiple)
- Subject dropdown
- Grade type (assignment/quiz/exam/project)
- Date range picker
- Behavior type (positive/negative)

**Navigation**:
- Back to Dashboard → `/parent/dashboard`
- View Assignment → `/assignments/:id`
- View Grade Details → Modal or expandable row

---

### 6. Assignments (`/assignments`)
**Access**: Parent, Teacher  
**Purpose**: View and manage assignments

**Flow (Parent)**:
1. View all assignments for children
2. Filter by subject, status, due date
3. Click assignment to view details
4. See associated grades (if graded)

**Flow (Teacher)**:
1. View all created assignments
2. Create new assignment
3. Grade assignments
4. Edit/delete assignments

**Views**:
- List view (default)
- Detail view (click assignment)
- Create/Edit form (Teachers only)

**Navigation**:
- Back to Dashboard
- Create Assignment (Teachers)
- View Grade → `/student-progress`

---

### 7. Attendance (`/attendance`)
**Access**: Parent, Teacher  
**Purpose**: View and record attendance

**Flow (Parent)**:
1. View attendance records for children
2. Filter by date range, subject, status
3. View attendance percentage
4. See attendance trends

**Flow (Teacher)**:
1. View attendance for all students
2. Record daily attendance
3. Bulk attendance entry
4. View attendance reports

**Views**:
- Calendar view (optional)
- Table view with filters
- Monthly summary
- Attendance percentage chart

**Navigation**:
- Back to Dashboard
- Record Attendance (Teachers)
- View Student → `/student-progress`

---

### 8. Behavior Reports (`/behavior-reports`)
**Access**: Parent, Teacher  
**Purpose**: View and create behavior reports

**Flow (Parent)**:
1. View behavior reports for children
2. Filter by type, category, date
3. View severity levels
4. Track behavioral patterns

**Flow (Teacher)**:
1. View all behavior reports
2. Create new report
3. Edit/delete reports
4. Filter and search reports

**Views**:
- List view with filters
- Detail view
- Create/Edit form (Teachers)

**Navigation**:
- Back to Dashboard
- Create Report (Teachers)
- View Student → `/student-progress`

---

### 9. Messaging (`/messaging`)
**Access**: Parent, Teacher  
**Purpose**: Communicate with parents/teachers

**Flow**:
1. View conversation list
2. Select or start conversation
3. View message thread
4. Compose and send message
5. Mark messages as read

**Views**:
- Conversation list (sidebar)
- Message thread (main area)
- Compose message (form)

**Features**:
- Real-time updates (future: WebSocket)
- Unread indicators
- Student context linking
- Message search

**Navigation**:
- Back to Dashboard
- New Message → Start conversation
- View Student → `/student-progress` (if linked)

---

### 10. Meetings (`/meetings`)
**Access**: Parent, Teacher  
**Purpose**: Schedule and manage meetings

**Flow (Parent)**:
1. View upcoming and past meetings
2. Request new meeting
3. Select teacher and student
4. Choose date/time
5. Confirm meeting details

**Flow (Teacher)**:
1. View meeting requests
2. Accept/decline meetings
3. Schedule meeting with parent
4. Update meeting status
5. Add meeting notes

**Views**:
- List view (upcoming/past)
- Calendar view (optional)
- Create/Edit form
- Meeting detail view

**Navigation**:
- Back to Dashboard
- Schedule Meeting
- View Student → `/student-progress`

---

### 11. Announcements (`/announcements`)
**Access**: Parent, Teacher, Admin  
**Purpose**: View and create announcements

**Flow (Parent/Teacher)**:
1. View all relevant announcements
2. Filter by priority
3. View announcement details
4. Access attachments

**Flow (Teacher/Admin)**:
1. View all announcements
2. Create new announcement
3. Edit/delete announcements
4. Set target audience and priority

**Views**:
- List view with priority sorting
- Detail view
- Create/Edit form (Teachers/Admin)

**Navigation**:
- Back to Dashboard
- Create Announcement (Teachers/Admin)

---

### 12. Profile (`/profile`)
**Access**: All authenticated users  
**Purpose**: Manage profile and settings

**Flow**:
1. View current profile information
2. Edit personal details
3. Change password
4. Update preferences
5. View linked accounts (students/classes)

**Sections**:
- Personal Information
- Account Settings
- Password Change
- Linked Accounts
- Notification Preferences

**Navigation**:
- Back to Dashboard
- Save Changes
- Cancel

---

## Teacher Routes

### 13. Teacher Dashboard (`/teacher/dashboard`)
**Access**: Teacher role only  
**Purpose**: Central hub for teachers

**Flow**:
1. Teacher logs in → Redirected here
2. View quick stats and class overview
3. Navigate to modules via sidebar

**Navigation Options**:
- Student Management → `/students` (if implemented)
- Assignments → `/assignments`
- Attendance → `/attendance`
- Behavior Reports → `/behavior-reports`
- Messaging → `/messaging`
- Meetings → `/meetings`
- Announcements → `/announcements`
- Profile → `/profile`
- Logout → `/login`

**Quick Actions**:
- Create Assignment
- Record Attendance
- Create Behavior Report
- Send Message to Parent
- Schedule Meeting

---

## Admin Routes (Optional)

### 14. Admin Dashboard (`/admin/dashboard`)
**Access**: Admin role only  
**Purpose**: System administration

**Flow**:
1. Admin logs in → Redirected here
2. View system statistics
3. Access admin functions

**Navigation Options**:
- User Management
- Student Management
- System Settings
- Analytics & Reports
- All other modules (full access)

---

## Navigation Patterns

### Sidebar Navigation
- **Always Visible**: On all authenticated pages
- **Collapsible**: Can be toggled on mobile
- **Role-Based**: Shows only relevant links
- **Active State**: Highlights current page

### Breadcrumb Navigation
- **Optional**: For deep navigation
- **Format**: Home > Module > Sub-page
- **Clickable**: Navigate to any level

### Quick Actions
- **Dashboard Cards**: Direct links to common actions
- **Contextual**: Varies by role and page
- **Icon-Based**: Visual indicators

---

## Route Protection

### Authentication Guard
- **PrivateRoute Component**: Wraps protected routes
- **Checks**: JWT token validity
- **Redirect**: `/login` if not authenticated

### Role-Based Access
- **Middleware**: Backend validates role
- **Frontend**: Conditional rendering based on role
- **Routes**: Some routes hidden from certain roles

### Data Filtering
- **Backend**: Filters data based on user role
- **Parents**: Only see their children's data
- **Teachers**: See assigned students' data
- **Admin**: Full access

---

## User Flow Examples

### Example 1: Parent Checking Student Grades
```
1. Login → /login
2. Authenticate → JWT token stored
3. Redirect → /parent/dashboard
4. Click "Student Progress" → /student-progress
5. Select student (if multiple)
6. View grades with filters
7. Click assignment → View details
8. Back to dashboard
```

### Example 2: Teacher Creating Assignment
```
1. Login → /login
2. Authenticate → JWT token stored
3. Redirect → /teacher/dashboard
4. Click "Create Assignment" → /assignments
5. Fill assignment form
6. Select students
7. Submit → Assignment created
8. Redirect → /assignments (list view)
```

### Example 3: Parent-Teacher Messaging
```
1. Parent: /parent/dashboard
2. Click "Messaging" → /messaging
3. Select teacher or start new conversation
4. Compose message
5. Send → Message saved
6. Teacher: Receives notification
7. Teacher: /messaging → Views message
8. Teacher: Replies → Conversation continues
```

### Example 4: Scheduling Meeting
```
1. Parent: /meetings
2. Click "Schedule Meeting"
3. Select teacher and student
4. Choose date/time
5. Submit request → Status: Pending
6. Teacher: /meetings → Sees request
7. Teacher: Accepts → Status: Confirmed
8. Both users: See confirmed meeting
```

---

## Error Handling & Edge Cases

### Authentication Errors
- **Expired Token**: Redirect to login
- **Invalid Token**: Clear storage, redirect to login
- **Network Error**: Show error message, retry option

### Data Not Found
- **404 Page**: For invalid routes
- **Empty States**: When no data available
- **Loading States**: While fetching data

### Permission Errors
- **403 Forbidden**: Show access denied message
- **Role Mismatch**: Redirect to appropriate dashboard

---

## Mobile Responsiveness

### Breakpoints
- **Mobile**: < 768px (collapsed sidebar, stacked layout)
- **Tablet**: 768px - 1024px (collapsible sidebar)
- **Desktop**: > 1024px (full sidebar, multi-column)

### Mobile Navigation
- **Hamburger Menu**: Toggle sidebar
- **Bottom Navigation**: Quick access (optional)
- **Touch-Friendly**: Larger tap targets

---

## Future Enhancements

1. **Deep Linking**: Direct links to specific records
2. **Search Functionality**: Global search across modules
3. **Keyboard Shortcuts**: Power user navigation
4. **Recent Pages**: Quick access to recently viewed pages
5. **Favorites**: Bookmark frequently used pages
6. **Multi-Tab Support**: Handle multiple tabs gracefully

