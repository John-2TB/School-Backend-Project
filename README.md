# 🏫 School Management System — Backend

A full-featured backend API for managing the academic and administrative operations of a school.

This project started as a way to learn backend development with Node.js, Express, MongoDB, and Mongoose, but has grown into a practical school-management backend designed around real-world workflows such as authentication, authorization, academic sessions, student management, staff management, results, file uploads, and advanced querying.

The goal is to build a backend that doesn't just perform CRUD operations, but understands **who is allowed to perform an action, what data they are allowed to access, and how different parts of a school system relate to each other.**

---

## 📌 Project Status

**Current stage:** Active development

### Implemented

* Node.js + Express backend
* RESTful API architecture
* MongoDB + Mongoose
* Controllers and services architecture
* Centralized error handling
* Custom application errors
* Async error handling
* Request validation
* Middleware
* Authentication
* Authorization
* Resource-level authorization
* Student management
* Class management
* Subject management
* Teacher management
* Staff management
* Academic session management
* Result management
* Student registration-number generation
* Student and staff profile-picture uploads
* Multer
* Cloudinary
* Advanced filtering
* Search
* Sorting
* Pagination
* Field selection
* Comparison queries
* Age-range validation
* Mongoose relationships
* Academic-session/term management

### Currently being designed

* Report card generation
* Report card PDF generation
* Report card release workflow
* Result locking after report-card release
* Promotion and graduation
* Department-specific subject rules

### Planned

* API documentation
* Automated testing
* Logging and observability improvements
* Security hardening
* Performance and database optimization
* Production architecture improvements
* Deployment

> **Note:** Attendance and Fees & Payments are intentionally not being implemented as standalone modules. Attendance information is part of the report-card workflow and is supplied by the appropriate school staff.

---

# 🎯 What Does This System Do?

A school has many different people and processes:

* Students need to be registered.
* Teachers need to be assigned to classes and subjects.
* Staff members need to be managed.
* Students belong to classes.
* Subjects belong to classes.
* Students receive academic results.
* Academic sessions have terms.
* Different users should have different permissions.
* Administrators need to manage the entire system.
* Teachers should only access information relevant to their responsibilities.

This backend provides the API that manages these operations.

At a high level:

```text
                    SCHOOL SYSTEM
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
     Students           Staff            Academics
        │                 │                 │
     Classes          Teachers         Subjects
        │                 │                 │
     Subjects          Classes          Results
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                   Academic Sessions
                          │
                       Terms
```

---

# 🧠 Core Technology Stack

## Backend

* **Node.js** — JavaScript runtime
* **Express.js** — Web framework
* **MongoDB** — Database
* **Mongoose** — MongoDB ODM

## Authentication & Security

* Authentication system
* Role-based authorization
* Resource-level authorization
* Middleware-based access control

## File Management

* **Multer** — Handles multipart/form-data uploads
* **Cloudinary** — Stores uploaded images

## Development & API Testing

* Postman
* Git
* GitHub

---

# 🏗️ Architecture

The backend follows a layered structure rather than putting everything inside route files.

A simplified view:

```text
Request
   │
   ▼
Routes
   │
   ▼
Middleware
   │
   ├── Authentication
   ├── Authorization
   ├── Validation
   └── Request processing
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Models
   │
   ▼
MongoDB
```

### Why this structure?

Each part has a responsibility.

**Routes**

Define which endpoint handles a request.

**Middleware**

Runs before the controller and can authenticate users, authorize access, validate input, or modify request data.

**Controllers**

Handle the HTTP request and response.

**Services**

Contain the application's actual business logic.

**Models**

Define how data is structured in MongoDB.

This separation makes the application easier to understand, test, and maintain.

---

# 👥 Users & Access Control

The system currently works with three application roles:

```text
admin
teacher
student
```

These roles determine what a user is generally allowed to do.

However, the system does not rely only on roles.

It also performs **resource-level authorization**.

For example:

> Being a teacher does not automatically mean the teacher can access every student's information.

The backend checks whether the requested resource is actually within that teacher's scope.

---

# 🔐 Authentication & Authorization

Authentication answers:

> **Who are you?**

Authorization answers:

> **What are you allowed to do?**

The system implements both.

Authorization has been applied to resources including:

* Students
* Classes
* Subjects
* Teachers
* Results
* Staff

For example:

### Admin

Administrators have broad access to school resources.

### Teacher

Teachers are restricted according to their assigned responsibilities.

A teacher can only work with subjects they teach and students/classes they are authorized to access.

### Student

Students are restricted to their own academic information.

---

# 👨‍🎓 Student Management

The backend manages student records including:

* Name
* Age
* Registration number
* Academic session
* Class
* Subjects
* Profile picture
* Active status

A student's profile picture can be uploaded to Cloudinary.

---

## Student Registration Numbers

Student registration numbers are generated automatically by the backend.

The system maintains a counter and generates sequential registration numbers based on the academic session.

Example:

```text
MCS/25/26/001
MCS/25/26/002
MCS/25/26/003
```

This means registration numbers do not have to be manually created by administrators.

---

# 🏫 Classes

Students belong to classes.

Examples:

```text
JSS1
JSS2
JSS3

SS1
SS2
SS3
```

Classes are also important when determining:

* Which subjects belong to a student
* Which students a teacher can manage
* Academic results
* Future report-card calculations
* Promotion between academic levels

---

# 📚 Subjects

Subjects are associated with classes.

For example:

```text
Mathematics → JSS1
Mathematics → JSS2
Mathematics → SS1
```

The same subject name can therefore exist for different classes.

However, the same subject cannot be duplicated within the same class.

A compound uniqueness rule is used for:

```text
subject name + class
```

So:

```text
Mathematics + JSS1
Mathematics + JSS2
```

are valid.

But:

```text
Mathematics + JSS1
Mathematics + JSS1
```

is rejected.

---

# 👨‍🏫 Staff & Teachers

The system separates **Staff** from **Teachers**.

This is important because not every staff member is a teacher.

## Staff

Staff represents general school personnel.

Staff information includes:

* Name
* Email
* Age
* Staff type
* Position
* Profile picture
* Active status

Staff types include:

```text
teaching
non-teaching
```

---

## Teacher

A Teacher is a teaching-specific record associated with a Staff member.

A teacher can have:

* A staff record
* An assigned/form class
* Subjects they teach

For example:

```text
Teacher
   │
   ├── Staff
   │
   ├── Class
   │
   └── Subjects
```

This allows common employee information to remain in `Staff` while teaching-specific information remains in `Teacher`.

---

# 📖 Academic Sessions

The backend manages academic sessions such as:

```text
2025/2026
2026/2027
```

Each academic session contains:

* Session name
* Whether it is the current session
* Current term

Supported terms:

```text
First Term
Second Term
Third Term
```

Only one academic session should be the current session.

---

## Academic Term Management

The current term belongs to the academic-session record.

For example:

```text
Academic Session: 2025/2026
Current Term: Second Term
```

The backend can advance the current term:

```text
First Term
    ↓
Second Term
    ↓
Third Term
```

The system prevents advancing beyond Third Term.

Historical results retain the term in which they were created, so changing the current term does not change old academic records.

---

# 📝 Results

Students can have multiple academic results.

A result belongs to:

```text
Student
+
Subject
+
Academic Session
+
Term
```

Each result can contain assessment information such as:

* CA
* Exam
* Total
* Grade
* Remark

The backend calculates academic values rather than blindly trusting values supplied by clients.

---

# 📊 Result Authorization

Results have resource-level authorization.

### Creating results

Administrators can create results broadly.

Teachers can create results when:

* They teach the requested subject.
* The student actually takes that subject.

### Viewing results

Administrators can access results broadly.

Teachers are restricted to students within their authorized class scope.

Students can access their own results.

### Updating and deleting

These operations are also protected by authorization rules.

The backend verifies the user's role and relationship with the relevant academic resources before allowing the operation.

---

# 🔗 Data Relationships

The system uses MongoDB references to connect related resources.

Some of the important relationships are:

```text
Student
   │
   ├── Class
   ├── Academic Session
   └── Subjects
```

```text
Teacher
   │
   ├── Staff
   ├── Class
   └── Subjects
```

```text
Result
   │
   ├── Student
   ├── Subject
   └── Academic Session
```

This allows the backend to keep data normalized while still connecting related records.

---

# 📷 File Uploads

The backend supports profile-picture uploads for resources such as students and staff.

The upload process uses:

```text
Client
  ↓
Multer
  ↓
Memory Storage
  ↓
Cloudinary
  ↓
Database stores URL + Public ID
```

Multer uses memory storage because the uploaded file is passed directly to Cloudinary instead of being permanently stored on the local server.

The database stores information such as:

```text
profilePicture
├── url
└── publicId
```

The `publicId` allows the uploaded Cloudinary resource to be identified later.

---

# 🧩 Middleware

Middleware is heavily used throughout the backend.

Middleware currently handles responsibilities such as:

* Authentication
* Authorization
* Validation
* Request normalization
* Logging
* File uploads

A middleware can inspect or modify a request before the request reaches the controller.

For example:

```text
Request
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Controller
```

---

# ✅ Request Validation

The backend validates incoming data before allowing it to reach the database.

Validation covers things such as:

* Required fields
* Data types
* Valid ObjectIds
* Duplicate records
* Allowed values
* Resource existence
* Role-specific rules
* Query parameters

Validation is handled at the appropriate layer rather than relying entirely on MongoDB errors.

---

# 🔄 Request Normalization

Because file uploads use `multipart/form-data`, values such as numbers and arrays can arrive as strings.

The backend normalizes these values before validation.

For example:

```text
"21"
```

can be converted into:

```text
21
```

Similarly, JSON strings representing arrays can be converted into actual JavaScript arrays.

This allows the same validation and business logic to work correctly with multipart requests.

---

# ❌ Centralized Error Handling

Instead of writing error responses separately throughout every controller, the backend uses centralized error handling.

A custom `AppError` class is used for expected application errors.

The application also handles common Mongoose errors including:

* Invalid MongoDB ObjectIds
* Duplicate-key errors
* Mongoose validation errors

This allows API errors to have consistent responses.

---

# ⚡ Async Error Handling

Asynchronous controller errors are handled through an `asyncHandler` utility.

Instead of repeatedly writing:

```js
try {
  // ...
} catch (error) {
  next(error);
}
```

controllers can use a shared wrapper that forwards rejected promises to the global error middleware.

This keeps controller code cleaner and makes error handling consistent.

---

# 🔎 Advanced Querying

The Student API supports advanced querying beyond simple CRUD operations.

Implemented query features include:

### Filtering

Students can be filtered by:

* Name
* Age
* Class
* Subject

---

### Age comparisons

The API supports comparison operators such as:

```text
gt
gte
lt
lte
eq
ne
in
nin
```

For example:

```text
age[gte]=18
```

can represent:

> Students who are 18 or older.

Multiple comparison conditions can also be combined.

---

### Search

A search feature can search across fields such as:

* Student name
* Registration number

Search input is escaped before being used as a regular expression.

This prevents special regular-expression characters from unexpectedly changing the search pattern.

---

### Sorting

Students can be sorted by supported fields such as:

```text
name
age
registrationNumber
```

Ascending and descending sorting are supported.

---

### Pagination

The API supports:

```text
page
limit
```

Pagination values are validated, and a maximum page size is enforced.

---

### Field Selection

Clients can request only specific allowed fields.

For example, instead of returning an entire student document, the API can return only selected information.

This reduces unnecessary data in responses.

---

# 🧮 Query Validation

Advanced queries are not simply passed directly to MongoDB.

The backend validates:

* Allowed operators
* Valid numbers
* Valid page values
* Valid limits
* Allowed sorting fields
* Allowed selected fields
* Empty search values
* Invalid age ranges

For example, an invalid range such as:

```text
age >= 20
age <= 15
```

is rejected before the database query is executed.

---

# 🗃️ Database Design

The application uses MongoDB with Mongoose schemas and models.

Some of the major resources are:

```text
User
Student
Staff
Teacher
Class
Subject
Result
AcademicSession
StudentCounter
```

Relationships between these resources are represented using MongoDB ObjectIds.

---

# 🛡️ Data Integrity

The backend does more than validate individual fields.

It also validates relationships between pieces of data.

Examples include:

* A Result must belong to an existing Student.
* A Result must reference an existing Subject.
* A Subject must belong to an existing Class.
* A Teacher must reference a valid Staff record.
* A teacher can only work with subjects they teach.
* Students can only access their own restricted resources.
* Duplicate subjects within the same class are prevented.
* Duplicate results for the same student, subject, session, and term are prevented.

This helps keep invalid combinations out of the database.

---

# 🧪 Testing & Development

API functionality has been manually tested during development using Postman.

Testing has included:

* Authentication
* Authorization
* CRUD operations
* Query parameters
* Advanced queries
* Result access rules
* File uploads
* Academic session operations
* Validation failures
* Error handling

Automated testing is planned as a future development phase.

---

# 📈 Current Architecture

The project has evolved through several development phases.

```text
Phase 1   Node.js Foundations
   ↓
Phase 2   Express Fundamentals
   ↓
Phase 3   REST CRUD
   ↓
Phase 4   Backend Architecture
   ↓
Phase 5   Middleware & Validation
   ↓
Phase 6   Error Handling
   ↓
Phase 7   Async Error Handling
   ↓
Phase 8   MongoDB
   ↓
Phase 9   Mongoose
   ↓
Phase 10  Mongoose Relationships
   ↓
Phase 11  Authentication & Authorization
   ↓
Phase 12  Authentication Security Refinement
   ↓
Phase 13  Resource-Level Authorization
   ↓
Phase 14  Staff & Teacher Management
   ↓
Phase 15  Multer + Cloudinary
   ↓
Phase 16  Advanced Querying
   ↓
Current   Report Cards & Promotion Design
```

---

# 📋 Report Card System — In Design

The next major part of the project is a report-card and promotion system.

The intended workflow is:

```text
Results entered
      ↓
Check academic completeness
      ↓
Collect attendance
      ↓
Collect teacher/principal comments
      ↓
Generate report card PDF
      ↓
Admin reviews
      ↓
Release
      ↓
Freeze historical record
```

## Draft Report Cards

A draft report card will be generated dynamically from the current Results.

This means:

```text
Result = 85
   ↓
Draft PDF = 85
```

If the Result is later corrected:

```text
Result = 90
   ↓
Next draft PDF = 90
```

The draft is therefore not treated as the final historical record.

---

# 🔒 Released Report Cards

When an administrator releases a report card, the backend will create a permanent snapshot of the academic information.

After release:

```text
Released Report Card
        ↓
     FROZEN
```

The report will no longer change when underlying Results are edited.

Results associated with a released report card will also need to become protected from ordinary updates.

This prevents situations where:

```text
Released report → Mathematics = 85
Current result  → Mathematics = 90
```

The released report represents the official record at the time it was released.

---

# 📊 Planned Report Card Information

The report card is being designed to contain:

### Student information

* Student
* Student name
* Registration number
* Class
* Class name
* Department where applicable

### Academic information

* Academic session
* Session name
* Term
* Subject results
* Term overall performance
* Cumulative performance

### Attendance

* School opened
* Present
* Punctual
* Absent

### Comments

* Student attitude/behaviour comment
* Class teacher academic comment
* Principal academic comment

---

# 📚 Planned Subject Snapshot

Once a report card is released, subject information will be preserved as a snapshot containing information such as:

```text
subject
subjectName
ca
exam
total
grade
remark
```

This allows the released report card to remain historically accurate even if the underlying academic data changes later.

---

# 📊 Overall Performance

The system will calculate both:

### Term performance

```text
Total score
────────────── × 100
Maximum possible score
```

For example:

```text
591 / 800 × 100
= 73.875%
```

### Cumulative performance

The cumulative score uses the underlying totals rather than averaging percentages.

For example:

```text
First Term:  591 / 800
Second Term: 620 / 800

Cumulative:

591 + 620
────────── × 100
800 + 800
```

This allows cumulative performance to correctly account for the number of subjects and their maximum possible scores.

Every report card will display:

```text
Term Overall Performance
+
Cumulative Performance
```

---

# 🏆 Project Grading System

For this project, the grading policy currently being used is:

| Percentage | Grade | Remark       |
| ---------: | :---: | ------------ |
|     80–100 |   A   | Excellent    |
|      70–79 |   B   | Very Good    |
|      60–69 |   C   | Upper Credit |
|      50–59 |   D   | Lower Credit |
|      40–49 |   E   | Pass         |
|       0–39 |   F   | Fail         |

The backend will calculate the grade and remark rather than trusting values submitted by the frontend.

The grading system is treated as a **school-specific policy**, meaning a future version could make the grading rules configurable rather than permanently hard-coded.

---

# 🧑‍🏫 Attendance Rules

Attendance is entered by the appropriate school staff rather than calculated from a dedicated attendance-tracking module.

The report card will contain:

```text
schoolOpened
present
punctual
absent
```

Where:

> `punctual` represents the number of school days the student arrived on time.

The backend validates relationships between the values.

For example:

```text
present + absent = schoolOpened
punctual <= present
```

All values must also be valid non-negative integers.

---

# 📚 Curriculum & Departments

For JSS students, subjects are determined from the student's class.

For SS students, the planned system will also consider the student's department.

For example:

```text
SS2 + Science
```

should not be expected to have an Art-specific subject such as Literature merely because Literature is attached to SS2.

The planned curriculum logic will therefore determine eligible subjects using:

```text
Class
+
Department
```

rather than blindly expecting every subject attached to an SS class.

This department-specific curriculum system is currently being designed.

---

# 🎓 Planned Promotion System

Promotion will be handled separately from report-card generation.

The planned progression is:

```text
JSS1 → JSS2
JSS2 → JSS3
JSS3 → SS1
SS1  → SS2
SS2  → SS3
SS3  → Graduated
```

Promotion will be an explicit administrative action rather than an automatic consequence of generating a report card.

The system will preserve historical academic information even after a student graduates.

Graduated students will not simply be deleted from the database.

---

# 🚧 Future Development

After completing the report-card and promotion systems, planned areas include:

## API Documentation

Documenting available endpoints, request formats, responses, authentication requirements, and errors.

## Automated Testing

Adding automated tests for:

* Services
* Controllers
* Middleware
* Authorization
* Validation
* API endpoints

## Logging & Observability

Improving application logs and making production issues easier to diagnose.

## Security Hardening

Reviewing authentication, authorization, validation, file uploads, and other security-sensitive areas.

## Performance & Database Optimization

Improving:

* Database queries
* Indexing
* Pagination
* Population strategies
* Resource usage

## Production Architecture

Preparing the backend for production deployment and larger workloads.

---

# 🔮 Potential Future Features

The following features are **not part of the current implementation**, but may be added as the project evolves.

### 📅 Attendance Management

A dedicated attendance-management system could be introduced in the future to record and manage students' daily attendance.

This could eventually allow the system to automatically calculate:

* Days school was opened
* Days present
* Days absent
* Days punctual

The current report-card design only stores and validates the attendance figures supplied by the appropriate school staff.

### 💳 Fees & Payments

A dedicated fees and payments module may also be added in the future.

Potential functionality could include:

* School-fee records
* Payment tracking
* Outstanding balances
* Payment history
* Payment status
* Receipts
* Parent/student payment information

These features are currently outside the implemented scope but remain potential additions as the school-management system grows.

---

# 🎯 Project Goal

The purpose of this project is not simply to build another CRUD API.

The goal is to understand how a real backend application is designed:

```text
Authentication
      +
Authorization
      +
Validation
      +
Business Logic
      +
Database Relationships
      +
Data Integrity
      +
File Management
      +
Academic Workflows
      +
Historical Records
      +
Security
```

The project is being developed incrementally, with each feature designed around real-world school requirements rather than simply adding endpoints for the sake of having more endpoints.

---

# 👨‍💻 Developer

Built as a full-stack project while studying backend development with Node.js, Express, MongoDB, and Mongoose.

The project is continuously evolving as new backend concepts and real-world requirements are introduced.

---

## 🚀 Current Focus

**Report Card + Promotion System**

The next development phase is focused on completing the report-card architecture, including:

* Curriculum/department rules
* Report-card data model
* Completeness checks
* Dynamic PDF generation
* Draft management
* Release workflow
* Historical snapshots
* Result locking
* Promotion and graduation