# 🚀 Zen HRMS - Enterprise Human Resource Management System

A high-performance, modern HRMS built with **Next.js 15**, **Supabase**, and **Lucide React**. This platform provides a comprehensive suite for global workforce management, recruitment, payroll, and professional development.

### 🌐 [Live Demo](https://hrms-shri.vercel.app/)

---

## ✨ Key Features

### 🤝 1. Talent Acquisition (Recruitment)
- **Job Publication Engine**: Create and manage global job openings with full role parameters.
- **Candidate Pipeline**: End-to-end applicant tracking (Applied -> Interview -> Hired).
- **Interview Coordination**: Synchronize schedules between candidates and internal leads.

### 💰 2. Payroll & Compensation
- **Salary Architecture**: Define complex CTC breakdowns (Basic, HRA, Conveyance, Allowances).
- **Tax Logistics**: Automated 10% standard tax withholding calculations.
- **Digital Payslips**: Instant generation and history tracking for all employees.

### 📈 3. Performance & Growth
- **Appraisal Workflows**: Structured review cycles for managers and employees.
- **Professional Training**: Assign curriculums and track certification progress.
- **Institutional Org Chart**: Real-time visualization of the entire company hierarchy.

### 🚪 4. Global Logistics
- **Exit management**: Automated resignation and offboarding protocols.
- **Expense Reimbursement**: Secure claim submission with receipt uploads.
- **Leave & Attendance**: Full tracking of global holidays and employee availability.

---

## 🛠️ Technical Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Actions)
- **Database/Auth**: [Supabase](https://supabase.com/) (PostgreSQL with RLS)
- **Styling**: Vanilla CSS & TailwindCSS (Global Design System)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visuals**: [Mermaid.js](https://mermaid.js.org/) (Schema Visualization)

---

## ⚙️ Setup Instructions

### 1. Repository Setup
```bash
git clone https://github.com/your-username/zen-hrms.git
cd hrms
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Initialization
Run the provided SQL scripts in your **Supabase SQL Editor** in the following order:
1. `supabase_update.sql` (Core Tables)
2. `payroll_update.sql` (Payroll & Expenses)
3. `recruitment_update.sql` (Talent & Advanced)

### 4. Local Deployment
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 📦 Deliverables Included
- **GitHub Repository**: Complete source code.
- **Interactive Walkthroughs**: Step-by-step feature guides.
- **ER Diagram**: Visual schema in `SCHEMA_ER.md`.
- **Postman Collection**: API testing in `postman_collection.json`.

---

## 🛡️ Security & Compliance
- **RLS Policies**: Secure data isolation at the database level.
- **RBAC**: Role-Based Access Control (Admin, HR, Manager, Employee).
- **Encrypted Transmission**: All data over HTTPS.

---

**Developed for Excellence in HR Logistics.**
