# 🖼️ Database Schema & ER Diagram - Zen HRMS

This document provides a visualization and detailed description of the Zen HRMS data architecture.

---

## 📊 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    PROFILES ||--o| SALARY_STRUCTURES : "has one"
    PROFILES ||--o{ PAYROLL_RECORDS : "receives"
    PROFILES ||--o{ EXPENSES : "submits"
    PROFILES ||--o{ LEAVES : "applies"
    PROFILES ||--o{ ATTENDANCE : "logs"
    PROFILES ||--o{ TRAININGS : "assigned to"
    PROFILES ||--o| EXIT_REQUESTS : "submits"
    
    DEPARTMENTS ||--o{ PROFILES : "belongs to"
    
    JOBS ||--o{ APPLICANTS : "has many"
    APPLICANTS ||--o{ INTERVIEWS : "scheduled for"
    PROFILES ||--o{ INTERVIEWS : "interviewer"

    PROFILES {
        uuid id PK
        text full_name
        text email
        text designation
        text role "super_admin | hr_manager | employee"
        uuid department_id FK
    }

    DEPARTMENTS {
        uuid id PK
        text name
        text manager_id FK
    }

    SALARY_STRUCTURES {
        uuid id PK
        uuid user_id FK
        decimal total_ctc
        decimal basic
        decimal hra
        decimal travel_allowance
    }

    PAYROLL_RECORDS {
        uuid id PK
        uuid user_id FK
        decimal gross_pay
        decimal tax
        decimal net_pay
        date month_year
    }

    EXPENSES {
        uuid id PK
        uuid user_id FK
        text title
        decimal amount
        text status "pending | approved | rejected"
        text receipt_url
    }

    JOBS {
        uuid id PK
        text title
        text status "open | closed"
    }

    APPLICANTS {
        uuid id PK
        uuid job_id FK
        text full_name
        text status "applied | interview | hired"
    }
```

---

## 🏛️ Core Tables

### 👤 Profiles
The central entity representing an employee. Linked to Auth users and departments.
- **Security**: Row Level Security (RLS) ensures users can only view their own profile unless they are an Admin.

### 💼 Salary Structures
Detailed CTC breakdowns for each employee, used to calculate monthly disbursements.
- **Relational Integrity**: 1-to-1 mapping with `profiles(id)`.

### 💰 Payroll Records
Historical logs of salary payments, including tax deductions and net pay.

### 📝 Expense Claims
Reimbursement tracking for business-related expenditures with storage integration for receipts.

### 🤝 Recruitment (Jobs & Applicants)
Manage the hiring lifecycle from public job posting to final hiring status.

---

**Generated for Zen HRMS Technical Documentation.**
