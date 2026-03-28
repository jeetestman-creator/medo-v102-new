# Requirements Document

## 1. Application Overview

### 1.1 Application Name

Gold X Usdt

### 1.2 Application Description

A Multi-Level Marketing (MLM) platform focused on Gold USDT investments, featuring automated ROI distribution, 15-level referral commission tracking with performance-based unlocking, wallet management, secure payment processing, coupon code system for promotional offers, a comprehensive administrative control panel for managing user performance metrics and ROI configuration, advanced Admin Settings (SEO, branding, analytics, site configuration), SMTP credential management with real-time backend propagation, TRC-20/BEP-20 auto-confirmation API configuration, professionally designed transactional email templates for signup verification and password reset, a post-development code audit and quality assurance process, full deployment configuration for Netlify, Vercel, and other compatible platforms, and a Supabase-native backend using PostgreSQL as the primary database. The platform uses Node.js as the backend runtime. Email delivery is handled via Zoho Mail SMTP service. All branding is neutral and configurable via the admin panel.

### 1.3 Mission and Vision

**Mission**: To provide a secure, transparent, and user-friendly investment platform that empowers individuals to grow their wealth through Gold USDT investments and referral opportunities.

**Vision**: To become the leading MLM platform in the cryptocurrency investment space, fostering financial independence and building a global community of successful investors.

### 1.4 Core Functionality

- User registration with email confirmation link activation
- **Terms & Conditions acceptance checkbox on signup page (required before account creation)**
- Login with email/password; Google login supported via OSS Google login
- Admin authentication with OTP verification (signup and login)
- Investment management (deposit/withdrawal)
- Coupon code system for deposit discounts
- Daily ROI calculation and distribution: automatically derived from admin-configured Monthly ROI Rate using the formula Daily ROI = (User's Qualified Investment Balance * (Monthly ROI Rate / 100)) / [Number of Days in the Month], credited automatically 24 hours after deposit time
- Automated monthly ROI display with admin-configurable percentage
- Multi-level referral commission system with 15 levels (4 basic levels + 11 performance-based levels)
- Performance-based referral level unlocking system with cumulative direct referral deposit targets
- Referral attribution preserved across all login methods (Google, Email/Password)
- Wallet system with multiple balance types including auto-withdrawal wallet address
- Admin panel for user and transaction management
- KYC document upload and verification (compulsory for withdrawal)
- Real-time notifications and activity tracking
- Support ticket system with FAQ section
- TRC-20 and BEP-20 automatic transaction confirmation
- Excel data export functionality with comprehensive user data
- Auto withdrawal toggle feature with wallet address entry and admin management
- Global auto withdrawal control by admin
- Total fee tracking in admin dashboard
- Non-KYC and completed KYC user statistics in admin dashboard
- User transaction history page
- Admin landing page editor for full landing page content management
- Legal policy content management (KYC Policy and Refund Policy) via admin panel
- User deletion with fund rescission, referral target recalculation, and audit logging
- Admin direct referral performance management with editable metrics and audit logging
- ROI Settings module with Monthly ROI Rate configuration, automated daily calculation engine, calculation run logs, and manual recalculation tool
- Admin Settings module with SEO optimization, branding and assets management, site configuration, analytics injection, and related options
- **SMTP Credential Management module within Admin Settings for secure, real-time Zoho Mail SMTP configuration updates**
- **TRC-20/BEP-20 API Configuration module within Platform Settings for deposit auto-confirmation**
- **Professionally designed HTML email templates for signup email verification and password reset**
- Post-development comprehensive code audit and quality assurance
- **Full deployment configuration for Netlify, Vercel, and other compatible hosting platforms**
- All branding elements (logo, favicon, app name, color scheme) are neutral placeholders configurable via Admin Settings; no hardcoded brand names, logos, or proprietary marks exist anywhere in the codebase

---

## 2. Technical Integration

### 2.1 Backend Configuration

- **Primary backend runtime**: Node.js
- **Primary database**: Supabase (PostgreSQL) — this is the sole database for all application data
- All previous MySQL/non-Supabase database code, configuration files, connection strings, ORM configurations, and dependencies have been completely removed from the codebase
- All application data is stored in the Supabase PostgreSQL database via the Supabase client SDK and/or direct PostgreSQL connection from the Node.js backend using the service role key
- RESTful API layer built with Node.js handles all business logic
- Node.js handles authentication, session management, email confirmation link delivery, password reset link delivery, ROI scheduling, referral commission processing, and all data operations
- Supabase stores all user data, transactions, wallet balances, referral structures, KYC records, coupon codes, support tickets, notifications, system settings, landing page content, legal policy content, referral performance overrides, ROI settings, daily ROI calculation logs, admin settings (SEO, branding, site configuration), SMTP credentials, and TRC-20/BEP-20 API configuration
- Supabase Row Level Security (RLS) is enabled on all tables
- Supabase Storage is used for KYC documents and platform assets
- Supabase Realtime is enabled for notifications, transactions, and wallets tables

### 2.2 Supabase Migration Requirements

#### 2.2.1 Migration Scope

- All existing database schemas previously defined for MySQL must be recreated in Supabase PostgreSQL using the schema defined in Section 2.6
- All existing application data must be migrated to the new Supabase database with full data integrity verification post-migration
- All API routes, environment variables, connection strings, and SDK calls must be updated to reference the Supabase project URL and API keys
- All authentication, real-time, and storage functionalities must be correctly integrated with Supabase services
- All code, configuration files, and dependencies related to MySQL (e.g., mysql2, sequelize, knex MySQL adapters, MySQL connection pool configurations) must be completely removed

#### 2.2.2 Environment Variables (Supabase)

```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
```

#### 2.2.3 Supabase Client Initialization

- Backend client initialized at `src/config/supabaseClient.js` using the service role key
- Frontend client initialized using the anon key only
- Service role key is never exposed in frontend code or public repositories

### 2.3 Email Service Configuration (SMTP)

- **Email Service Provider**: Zoho Mail
- **Previous Provider (decommissioned)**: Juvlon (juvlon.com) — old API key and SMTP configuration must be deactivated and removed from all configuration files
- **SMTP Server Address**: smtp.zoho.com
- **SMTP Port**: 587 (with STARTTLS, recommended) or 465 (with SSL/TLS)
- **Security/Encryption**: TLS/SSL (STARTTLS on port 587 recommended)
- **Authentication**: Required
- **Username**: Full Zoho Mail email address
- **Password**: App Password generated from Zoho Mail security settings
- All email sending logic in Node.js backend must reference the Zoho Mail SMTP configuration exclusively
- Update all environment variables and configuration files to replace Juvlon credentials with Zoho Mail credentials
- After updating configuration, new credentials must be immediately propagated to the backend mailing system without requiring a server restart
- **SMTP Nodemailer Transport Fix**: Resolve the bufio partial-read error by ensuring the Nodemailer SMTP transport is initialized with explicit `socketTimeout`, `greetingTimeout`, and `connectionTimeout` values; use `secure: false` with `requireTLS: true` for port 587 STARTTLS; ensure the transport object is properly destroyed and recreated on each credential update rather than reusing a stale transport instance

### 2.4 Payment Confirmation

- TRC-20 automatic transaction confirmation
- BEP-20 (BSC) automatic transaction confirmation
- Transaction hash verification and auto-approval

### 2.5 TRC-20 / BEP-20 API Configuration

- TRC-20 and BEP-20 API credentials and endpoint URLs are stored in Supabase via Node.js backend
- Admin can view and update TRC-20 and BEP-20 API settings from the Platform Settings section of the admin panel
- Configuration fields for TRC-20:
  - API Provider Name (text input)
  - API Base URL (text input)
  - API Key (masked input, stored encrypted at rest)
  - Wallet Address to monitor (text input)
  - Confirmation threshold (number of block confirmations required)
  - Enable/Disable toggle for TRC-20 auto-confirmation
- Configuration fields for BEP-20 (BSC):
  - API Provider Name (text input)
  - API Base URL (text input)
  - API Key (masked input, stored encrypted at rest)
  - Wallet Address to monitor (text input)
  - Confirmation threshold (number of block confirmations required)
  - Enable/Disable toggle for BEP-20 auto-confirmation
- Save button for each network section to persist changes
- Test Connection button for each network to verify API reachability and key validity
- On save, the Node.js backend immediately reloads the active API configuration without requiring a server restart
- API keys are never returned in plain text via any GET response
- **Deposit Auto-Confirmation Fetch Logic**:
  - When a user submits a deposit with a transaction hash, the backend queries the relevant blockchain API using stored credentials
  - The backend fetches transaction details: sender address, recipient address, amount (in USDT), transaction status, and confirmation count
  - If recipient address matches the platform wallet address, amount matches declared deposit amount (within acceptable tolerance), and confirmation count meets or exceeds configured threshold, the deposit is automatically approved
  - If any condition is not met, the deposit remains in pending state for manual admin review
  - All auto-confirmation attempts are logged with transaction hash, network, fetched details, match result, and timestamp
- **API Endpoints for TRC/BEP API Configuration**:
  - GET /api/admin/blockchain-api-settings
  - PUT /api/admin/blockchain-api-settings/trc20
  - PUT /api/admin/blockchain-api-settings/bep20
  - POST /api/admin/blockchain-api-settings/trc20/test
  - POST /api/admin/blockchain-api-settings/bep20/test

**Database Schema — blockchain_api_settings table (Supabase PostgreSQL)**:
- id (SERIAL PRIMARY KEY)
- network (VARCHAR(10), NOT NULL): TRC20 or BEP20
- provider_name (VARCHAR(255), NULLABLE)
- api_base_url (VARCHAR(500), NOT NULL)
- api_key_encrypted (TEXT, NOT NULL): AES-256 encrypted API key
- wallet_address (VARCHAR(255), NOT NULL)
- confirmation_threshold (INT, NOT NULL, DEFAULT 1)
- is_enabled (BOOLEAN, DEFAULT TRUE)
- updated_by_admin_id (UUID, NULLABLE)
- updated_at (TIMESTAMPTZ, DEFAULT NOW())
- created_at (TIMESTAMPTZ, DEFAULT NOW())

### 2.6 Supabase Database Schema

All tables are created in Supabase PostgreSQL. RLS is enabled on all tables. The following schema replaces all previously defined MySQL schemas.

**profiles table**
- id (UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE)
- email (TEXT NOT NULL UNIQUE)
- full_name (TEXT)
- phone_number (TEXT)
- country (TEXT)
- state (TEXT)
- city (TEXT)
- pincode (TEXT)
- referred_by_user_id (UUID NULLABLE REFERENCES profiles(id) ON DELETE SET NULL)
- role (TEXT NOT NULL DEFAULT 'user')
- is_deleted (BOOLEAN NOT NULL DEFAULT FALSE)
- deleted_at (TIMESTAMPTZ NULLABLE)
- terms_accepted (BOOLEAN NOT NULL DEFAULT FALSE)
- terms_accepted_at (TIMESTAMPTZ NULLABLE)
- kyc_status (TEXT NOT NULL DEFAULT 'pending')
- auto_withdrawal_enabled (BOOLEAN NOT NULL DEFAULT FALSE)
- auto_withdrawal_wallet_address (TEXT NULLABLE)
- cumulative_direct_referral_deposits (NUMERIC(20,8) NOT NULL DEFAULT 0)
- created_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())
- updated_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

**transactions table**
- id (BIGSERIAL PRIMARY KEY)
- user_id (UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE)
- type (TEXT NOT NULL)
- amount (NUMERIC(20,8) NOT NULL)
- fee (NUMERIC(20,8) NOT NULL DEFAULT 0)
- net_amount (NUMERIC(20,8) NOT NULL)
- status (TEXT NOT NULL DEFAULT 'pending')
- transaction_hash (TEXT NULLABLE)
- network (TEXT NULLABLE)
- coupon_code_id (BIGINT NULLABLE)
- notes (TEXT NULLABLE)
- created_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())
- updated_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

**wallets table**
- id (BIGSERIAL PRIMARY KEY)
- user_id (UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE)
- deposit_balance (NUMERIC(20,8) NOT NULL DEFAULT 0)
- roi_balance (NUMERIC(20,8) NOT NULL DEFAULT 0)
- bonus_balance (NUMERIC(20,8) NOT NULL DEFAULT 0)
- withdrawal_balance (NUMERIC(20,8) NOT NULL DEFAULT 0)
- total_fees_paid (NUMERIC(20,8) NOT NULL DEFAULT 0)
- created_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())
- updated_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

**referral_structure table**
- id (BIGSERIAL PRIMARY KEY)
- user_id (UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE)
- referrer_id (UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE)
- level (INT NOT NULL)
- created_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

**kyc_records table**
- id (BIGSERIAL PRIMARY KEY)
- user_id (UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE)
- document_type (TEXT NOT NULL)
- document_url (TEXT NOT NULL)
- status (TEXT NOT NULL DEFAULT 'pending')
- reviewed_by_admin_id (UUID NULLABLE)
- reviewed_at (TIMESTAMPTZ NULLABLE)
- rejection_reason (TEXT NULLABLE)
- created_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())
- updated_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

**coupon_codes table**
- id (BIGSERIAL PRIMARY KEY)
- code (TEXT NOT NULL UNIQUE)
- discount_percentage (NUMERIC(5,2) NOT NULL)
- valid_from (TIMESTAMPTZ NOT NULL)
- valid_until (TIMESTAMPTZ NOT NULL)
- usage_limit (INT NOT NULL DEFAULT 1)
- usage_count (INT NOT NULL DEFAULT 0)
- is_active (BOOLEAN NOT NULL DEFAULT TRUE)
- created_by_admin_id (UUID NULLABLE)
- created_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())
- updated_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

**support_tickets table**
- id (BIGSERIAL PRIMARY KEY)
- user_id (UUID NULLABLE REFERENCES profiles(id) ON DELETE SET NULL)
- subject (TEXT NOT NULL)
- message (TEXT NOT NULL)
- status (TEXT NOT NULL DEFAULT 'open')
- priority (TEXT NOT NULL DEFAULT 'normal')
- admin_response (TEXT NULLABLE)
- responded_by_admin_id (UUID NULLABLE)
- responded_at (TIMESTAMPTZ NULLABLE)
- created_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())
- updated_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

**notifications table**
- id (BIGSERIAL PRIMARY KEY)
- user_id (UUID NULLABLE REFERENCES profiles(id) ON DELETE CASCADE)
- type (TEXT NOT NULL)
- title (TEXT NOT NULL)
- message (TEXT NOT NULL)
- is_read (BOOLEAN NOT NULL DEFAULT FALSE)
- created_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

**system_settings table**
- id (BIGSERIAL PRIMARY KEY)
- setting_key (TEXT NOT NULL UNIQUE)
- setting_value (TEXT NOT NULL)
- updated_by_admin_id (UUID NULLABLE)
- updated_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

**landing_page_content table**
- id (BIGSERIAL PRIMARY KEY)
- section_key (TEXT NOT NULL UNIQUE)
- content_json (JSONB NOT NULL)
- updated_by_admin_id (UUID NULLABLE)
- updated_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

**legal_policy_content table**
- id (BIGSERIAL PRIMARY KEY)
- policy_type (TEXT NOT NULL UNIQUE)
- content (TEXT NOT NULL)
- version (INT NOT NULL DEFAULT 1)
- updated_by_admin_id (UUID NULLABLE)
- updated_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

**referral_performance table**
- id (BIGSERIAL PRIMARY KEY)
- user_id (UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE)
- direct_referral_count_override (INT NULLABLE)
- performance_score_override (NUMERIC NULLABLE)
- contribution_value_override (NUMERIC NULLABLE)
- last_modified_by_admin_id (UUID NULLABLE)
- last_modified_at (TIMESTAMPTZ NULLABLE)
- created_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())
- updated_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

**roi_settings table**
- id (BIGSERIAL PRIMARY KEY)
- monthly_roi_rate (NUMERIC(8,4) NOT NULL)
- updated_by_admin_id (UUID NULLABLE)
- updated_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

**daily_roi_logs table**
- id (BIGSERIAL PRIMARY KEY)
- run_date (DATE NOT NULL)
- status (TEXT NOT NULL DEFAULT 'pending')
- total_users_processed (INT NOT NULL DEFAULT 0)
- total_roi_distributed (NUMERIC(20,8) NOT NULL DEFAULT 0)
- error_message (TEXT NULLABLE)
- started_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())
- completed_at (TIMESTAMPTZ NULLABLE)

**admin_settings table**
- id (BIGSERIAL PRIMARY KEY)
- setting_key (TEXT NOT NULL UNIQUE)
- setting_value (TEXT NOT NULL)
- updated_by_admin_id (UUID NULLABLE)
- updated_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

**blockchain_api_settings table**: as defined in Section 2.5

**admin_audit_log table**
- id (BIGSERIAL PRIMARY KEY)
- action_type (TEXT NOT NULL)
- admin_user_id (UUID NOT NULL)
- target_user_id (UUID NULLABLE)
- field_name (TEXT NULLABLE)
- previous_value (TEXT NULLABLE)
- new_value (TEXT NULLABLE)
- correction_reason (TEXT NULLABLE)
- is_immutable (BOOLEAN NOT NULL DEFAULT TRUE)
- created_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())

### 2.7 Deployment Configuration

The application must include complete, production-ready deployment configuration files and scripts for hosting on Netlify, Vercel, and other compatible platforms. All deployment configurations must correctly handle the Node.js backend, Supabase database connection, environment variables, and build processes.

#### 2.7.1 General Deployment Requirements

- All sensitive credentials (SMTP, Supabase keys, API keys, JWT secrets, encryption keys) must be managed exclusively via environment variables; no hardcoded secrets in source code
- A comprehensive `.env.example` file must be provided listing all required environment variables with descriptions and placeholder values
- All deployment configurations must support environment-specific settings (development, staging, production)
- CORS configuration must be correctly set for each deployment target's domain
- All deployment platforms must serve the application over HTTPS only
- Static frontend assets must be built and served from the appropriate CDN or edge network
- Health check endpoint (GET /api/health) must be implemented and referenced in deployment configurations

#### 2.7.2 Deployment Pipeline Error Resolution

- Examine build and deployment logs from GitHub Actions, Vercel, and Netlify
- Compile a complete list of all errors and warnings
- Categorize and diagnose each error, including:
  - Environment variable configuration and secrets
  - Build script commands and dependencies (package.json scripts)
  - Framework-specific configuration files (vercel.json, netlify.toml)
  - Incorrect file paths or missing modules
  - Compatibility issues between Node.js versions and project dependencies
- Implement fixes for each identified issue and test builds locally after each significant change
- Push corrections to the repository and trigger new deployments on all platforms
- Confirm successful builds and deploys without errors

#### 2.7.3 Netlify Deployment

- **netlify.toml** configuration file at project root:
  - Build command for frontend
  - Publish directory pointing to the frontend build output folder
  - Node.js version specification
  - Redirect rules: all frontend routes redirected to `index.html` for SPA routing
  - API proxy rules: `/api/*` requests proxied to the Node.js backend service URL
  - Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Content-Security-Policy)
- **Environment Variables**: All required environment variables documented for entry in Netlify dashboard, including: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DB_URL, JWT_SECRET, ENCRYPTION_KEY, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NODE_ENV, FRONTEND_URL, BACKEND_URL
- Fix and verify all existing Netlify-related configuration errors

#### 2.7.4 Vercel Deployment

- **vercel.json** configuration file at project root:
  - Build command and output directory for frontend
  - Routes configuration: API routes proxied to Node.js backend; all other routes rewritten to `index.html`
  - Security headers applied to all responses
  - Region configuration for optimal latency
- **Environment Variables**: All required environment variables documented for Vercel dashboard with separate sets for Production, Preview, and Development environments
- Fix and verify all existing Vercel-related configuration errors

#### 2.7.5 Other Platform Deployment Configurations

**Railway**: `railway.toml` configuration file; start command for Node.js backend; environment variables configured via Railway dashboard; port binding via `PORT` environment variable

**Render**: `render.yaml` Blueprint configuration file defining web service for Node.js backend, static site service for frontend, and external Supabase database connection; environment variable groups defined

**Heroku**: `Procfile` specifying web process; `package.json` engines field; `app.json` for Heroku app configuration; port binding via `process.env.PORT`

**DigitalOcean App Platform**: `.do/app.yaml` specification file defining service components, build and run commands, environment variable references, and HTTP routes

**VPS / Self-Hosted**:
- `Dockerfile` for containerized deployment: multi-stage build, official Node.js LTS Alpine base image, non-root user, EXPOSE directive, CMD to start Node.js server
- `docker-compose.yml` for local development: `app` service for Node.js backend; environment variables loaded from `.env` file; no local database service (Supabase is the database)
- **PM2 Configuration** (`ecosystem.config.js`): app name, script entry point, cluster mode, max memory restart threshold, log file paths
- **Nginx Configuration** (`nginx.conf`): reverse proxy to Node.js application port, SSL/TLS termination, gzip compression, static file serving, security headers, rate limiting

#### 2.7.6 Database Migration and Seeding for Deployment

- Database migration scripts must be included and runnable as a pre-deployment or post-deployment step against the Supabase PostgreSQL database
- Migration command documented in deployment guides (e.g., `npm run migrate`)
- Initial admin seed script provided to create the first super-admin account on fresh deployments
- Migration scripts must be idempotent

#### 2.7.7 CI/CD Pipeline

- **GitHub Actions** workflow file (`.github/workflows/deploy.yml`):
  - Trigger: push to `main` branch (production) and `develop` branch (staging)
  - Steps: checkout code, set up Node.js, install dependencies, run linting, run tests, build frontend, deploy to target platform
  - Secrets management: all sensitive values referenced from GitHub repository secrets
  - Separate jobs for frontend build verification and backend test execution

#### 2.7.8 Deployment Audit and Fix

- Audit all existing deployment-related files, scripts, and configurations across the entire codebase
- Identify and fix all deployment errors including but not limited to:
  - Incorrect build commands or output directories
  - Missing or misconfigured redirect/rewrite rules causing 404 errors on page refresh
  - Hardcoded localhost URLs or ports that break in production
  - Missing environment variable declarations
  - CORS misconfigurations blocking frontend-to-backend API calls in production
  - Database connection failures due to missing SSL configuration or incorrect Supabase connection string format
  - Static asset paths broken after build
  - Missing `start` script in `package.json`
  - Incorrect Node.js version specifications
  - Session or cookie configuration not set for production domain
  - File upload paths using local filesystem references (must use Supabase Storage)
- Verify that the application starts correctly and all features function as expected after deployment on each supported platform
- Document all identified issues and their resolutions in the post-development audit report (Section 19.36)

#### 2.7.9 Deployment Documentation

- A `DEPLOYMENT.md` file must be included at the project root covering:
  - Prerequisites (Node.js version, Supabase account, required accounts)
  - Step-by-step deployment guide for each supported platform
  - Complete list of all required environment variables with descriptions, types, and example values
  - Supabase setup and migration instructions
  - Post-deployment verification checklist
  - Troubleshooting section for common deployment errors
  - SSL/TLS setup instructions for self-hosted deployments
  - How to rotate credentials (SMTP, API keys, JWT secret, Supabase keys) in production without downtime

---

## 3. Branding and Proprietary Mark Removal

### 3.1 Overview

All hardcoded branding, proprietary marks, and third-party attributions must be removed from the entire codebase and replaced with neutral, configurable placeholders. This applies to all source files, configuration files, asset files, comments, and metadata.

### 3.2 Audit and Removal Scope

- Conduct a comprehensive audit of the entire codebase and assets directory to identify all instances of:
  - Any platform name, logo, or mark belonging to a previous or third-party brand
  - Any other brand names, logos, trademarks, or watermarks
  - Copyright notices or metadata attributing any brand other than the application itself
- Remove or replace all identified elements:
  - Replace hardcoded brand names in UI text, configuration files, and comments with generic placeholders (e.g., [Project Name], [App Name])
  - Delete all logo image files (.svg, .png, .ico, etc.) and favicons; replace with neutral placeholder graphics if necessary for layout integrity
  - Update `manifest.json`, HTML title tags, and meta tags to use generic or admin-configurable values
  - Remove any brand-specific color themes or styling that is not configurable via Admin Settings

### 3.3 Admin-Configurable Branding

- All branding elements (application name, logo, favicon, color scheme, typography) are exclusively managed via the Admin Settings module
- No branding values are hardcoded anywhere in the source code
- On first deployment, all branding fields display neutral placeholder values until configured by the admin

---

## 4. Page Structure

### 4.1 Home Page (Landing)

- Investment plan information
- Platform features and benefits
- Testimonials section
- Sign-up call-to-action
- Footer with Privacy Policy, Terms & Conditions, KYC Policy, Refund Policy, and Contact links
- Professional, modern UI design with enhanced visual appeal
- No admin setup option displayed
- All content sections fully editable via admin Landing Page Editor
- KYC Policy and Refund Policy pages dynamically populated from admin-managed content
- Site title, tagline, meta tags, Open Graph tags, and analytics code injected dynamically from Admin Settings

### 4.2 Authentication Pages

#### Sign Up

- Email registration
- Phone number input (required, numeric only)
- Country selection (required)
- State selection based on country (required)
- City selection based on state (required)
- Pincode input (numeric only)
- **Terms & Conditions Acceptance Checkbox**:
  - A clearly visible checkbox displayed near the bottom of the signup form, above the submit button
  - Label text: I have read and agree to the Terms & Conditions (with Terms & Conditions as a clickable hyperlink opening the Terms & Conditions page in a new tab)
  - The checkbox is unchecked by default
  - The signup/submit button is disabled until the checkbox is checked
  - If the user attempts to submit the form without checking the box, an inline validation error is displayed: You must accept the Terms & Conditions to create an account
  - Client-side and server-side validation both enforce this requirement
  - The accepted state (true/false) and acceptance timestamp are recorded in the profiles table in Supabase upon successful registration
- **Email confirmation link activation**:
  - Upon form submission, system sends a professionally designed HTML confirmation email to the user's provided email address via Zoho Mail SMTP
  - Confirmation link must be delivered successfully to the user's inbox
  - Upon clicking the confirmation link, the user's account is activated
  - User is automatically redirected to the login page upon successful activation
  - Confirmation links are time-bound and expire after a defined period
  - Resend confirmation link option available on the pending activation screen
- OSS Google login support
- Referral code (ref parameter) preserved and correctly attributed across all registration methods including Google Sign-In and Email/Password

#### Login

- Email/password login
- Email OTP verification required for admin login only
- OSS Google login option
- **Password Reset Flow (Forgot Password)**:
  - User requests a password reset by entering their registered email address
  - System sends a professionally designed HTML password reset email via Zoho Mail SMTP
  - Clicking the link directs the user to a secure password reset page with New Password and Confirm New Password fields
  - Upon successful submission, the system updates the credentials for the user associated with that email
  - Reset links are time-bound and expire after a defined period
- Referral code preserved across all login types and correctly attributed to referrer upon successful registration

#### Email Confirmation Page

- Dedicated page displayed when user clicks the confirmation link from their email
- Shows activation success message and redirects to login page automatically
- Shows appropriate error message if the link is expired or invalid, with option to request a new confirmation email

#### Password Reset Page

- Accessible only via the time-bound reset link sent to the user's email
- Two input fields: New Password and Confirm New Password
- Client-side and server-side validation
- Success message displayed upon completion; user directed to login page
- Error message displayed if the reset link is expired or invalid

### 4.3 User Dashboard

- Current balance display (Deposit, ROI, Bonus, Withdrawal wallets)
- Monthly ROI percentage display (admin-configurable)
- Daily ROI percentage display (derived from Monthly ROI Rate)
- Daily ROI countdown timer display: Show remaining time until next ROI credit (24 hours from last deposit time)
- Deposit button
- Withdrawal button
- Referral details with 15-level structure display including all performance levels with targets and progress
- Income details (ROI and referral earnings)
- Transaction history summary
- Activity log
- Referral stats summary
- Download My Data button (one-click Excel export)
- Auto withdrawal toggle switch with status display
- Real-time sync of referral commission percentages from admin panel
- Performance-based referral level status display (levels 5-15)
- Direct referral cumulative deposit progress display
- Professional, clean UI design

### 4.4 Deposit Page

- USDT wallet address display (BEP-20 and TRC-20 options)
- Minimum deposit: 100 USDT compulsory
- Deposit fee: 5%
- **Coupon code input field**:
  - Optional text input field for coupon code
  - Apply button to validate and apply coupon
  - Display discount percentage when valid coupon is applied
  - Show original amount, discount amount, and final amount after discount
  - Coupon discount applies to deposit fee only
- Display total deposit amount remaining after fee deduction (with coupon discount if applied)
- Transaction hash verification
- Automatic confirmation for TRC-20 and BEP-20 transactions
- Deposit confirmation page
- Daily ROI credit based on admin-configured Monthly ROI Rate formula, credited automatically 24 hours after deposit time
- Tutorial section with reduced size:
  - How to deposit
  - How to use coupon codes
  - How to request withdrawal
  - How to enable auto payment
  - How to link wallet
  - Admin can upload and delete tutorial content
  - YouTube video link support for deposit help (clickable, redirects to admin-configured link)
- Professional UI design

### 4.5 Withdrawal Page

- KYC verification check (compulsory before withdrawal)
- Withdrawal request form
- Minimum withdrawal amount display
- Withdrawal fee: 5%
- Withdrawal cooling period: 48 hours for normal withdrawals, 30 days for referral bonus
- Auto withdrawal toggle switch:
  - When enabled: Display wallet address entry field
  - Save button to store wallet address
  - Display auto withdrawal date: 20th of every month
  - Show next payout date: 20th
- Manual withdrawal locked when auto withdrawal cooling period is active
- Send payment request to admin for approval
- Fix withdrawal approval reflection: When admin approves withdrawal, ensure funds are properly reflected in withdrawal wallet for both user and admin sides
- YouTube video link support for withdrawal help
- Professional UI design

### 4.6 Referral Level Income Page

- Referral link display
- 15-level commission breakdown:
  - Basic levels (1-4): Admin-configurable percentages with real-time sync
  - Performance levels (5-15): Display with unlock status, cumulative target progress, and commission percentages
- Display all 15 referral levels with complete details:
  - Level number
  - Commission percentage
  - Target requirement (for performance levels 5-15)
  - Current cumulative progress toward target
  - Lock/unlock status
- Referral tree visualization with detailed user information
- Commission earnings history
- 30-day lock period on referral bonus withdrawals
- Auto credit on referral's completed deposit
- Real-time update when admin changes referral structure percentages
- Professional UI design

### 4.7 Profile Page

- User information display and editing
- Phone number display and editing (numeric only)
- Country, state, city, pincode selection and editing
- **Auto-Withdrawal Wallet Address section**:
  - Field label: Auto-Withdrawal Wallet Address
  - Text input field with validation for blockchain/crypto wallet address format
  - Dedicated Save button
  - Clear visual feedback on save
- KYC document upload section with proper error handling and validation
- KYC verification status
- Privacy settings
- Password change option
- YouTube video link support for KYC help
- Professional UI design

### 4.8 User Transaction Page

- View all user transactions: deposits, ROI credits, withdrawals, referral commissions, coupon usage, and all other transaction types
- Transaction filtering options: transaction type, date range, status
- Transaction details display
- Search functionality
- Professional UI design

### 4.9 Support Center

- FAQ section with common questions and answers
- Support ticket submission form
- Ticket history and status tracking
- Help resources with clickable links redirecting to admin-configured YouTube videos
- Professional UI design

### 4.10 Admin Panel

#### 4.10.1 User Management

- Customer management (view/edit email, mobile number, password, address, phone number, country, state, city, pincode)
- Create User button
- Fix create user error to ensure successful user creation
- Delete User button (super-admin only, with confirmation and activity log)
  - Upon deletion, triggers the User Deletion and Referral Recalculation workflow defined in Section 19.31
- Download All Users as Excel button (full export)
- User details edit page:
  - Display total fee collected from particular user
  - Edit all user data
  - Performance-based referral level management
  - **Direct Referral Performance section** (see Section 4.10.17)
- Professional admin UI design

#### 4.10.2 Transaction Management

- Deposit request approval/rejection with error handling and validation
- Deposit management: view all deposits, set ROI for individual deposits
- Filter options: date range, status, user, amount range
- Withdrawal request approval/rejection with proper functionality
- Fix withdrawal approval reflection
- Fix withdrawal rejection to ensure proper operation
- Transactions page: view all transactions, filter options, Excel download, page load failure fix
- Professional admin UI design

#### 4.10.3 Platform Settings

- **Wallet Address Management**: Edit TRC-20 and BEP-20 deposit wallet addresses
- **TRC-20 / BEP-20 API Configuration** (see Section 2.5)
- **Email Service Configuration**: View and update SMTP provider settings, test email delivery
- **Referral Options**: Basic referral commission percentage management, performance-based referral level configuration, referral tree view
- **Logs**: User activity monitoring and system logs; admin_audit_log entries visible here; log entries not editable or deletable
- **Global Auto Withdrawal Control**
- **ROI Settings Module** (see Section 4.10.18)
- **Monthly ROI Management**
- **ROI Adjustments** for individual users
- **Website Management**: Contact email editing, logo upload/editing, favicon upload/editing
- **Content Management**: Terms & Conditions, Privacy Policy, KYC Policy, Refund Policy, YouTube video link management, FAQ management
- **KYC Management**
- **Coupon Code Management**
- Professional admin UI design

#### 4.10.4 Dashboard Statistics

- Analytics dashboard
- **Total Fee Display**: Total fee display showing all collected fees from deposits and withdrawals
- **Non-KYC User Count**: Clickable to show user list
- **Completed KYC User Count**: Clickable to show user list
- **KYC Pending Count**: Clickable to show user list
- **Coupon Usage Statistics**: Total coupon usage and discount amounts
- Professional admin UI design

#### 4.10.5 Auto Withdrawal Control

- **Global Auto Withdrawal Control**: Master toggle to enable/disable all auto withdrawals
- **Individual User Auto Withdrawal Management**: Enable/disable, configure, view status, edit parameters, manage schedule (20th of every month)
- Professional admin UI design

#### 4.10.6 Tutorial Management

- Upload/delete tutorial content (images/videos)
- Add YouTube video links for deposit help, KYC help, and withdrawal help
- Professional admin UI design

#### 4.10.7 Support Ticket Management

- View all support tickets
- Fix ticket reception issue
- Fix page load failure
- Filter options: status, date range, user, priority
- Ticket response and resolution functionality
- Professional admin UI design

#### 4.10.8 KYC Management

- View all KYC submissions
- Filter options: status, date range, user
- Approve/reject KYC submissions
- Professional admin UI design

#### 4.10.9 Deposit Management

- View all deposit requests
- Filter options: status, date range, user, amount range
- Approve/reject deposit requests
- Set ROI for individual deposits
- View coupon code usage for each deposit
- Professional admin UI design

#### 4.10.10 Withdrawal Management

- View all withdrawal requests
- Filter options: status, date range, user, amount range
- Approve/reject withdrawal requests
- Fix withdrawal approval reflection
- Fix withdrawal rejection errors
- Professional admin UI design

#### 4.10.11 Notification Center

- Display all notifications: new member registrations, deposit requests, withdrawal requests, KYC submissions, support tickets, coupon code usage, and all other system events
- Real-time notification updates
- Notification filtering and search
- Professional admin UI design

#### 4.10.12 Performance-Based Referral Management

- Configure 11 performance-based referral levels (levels 5-15)
- Set commission percentages and cumulative direct referral deposit targets
- Enable/disable performance levels globally
- Manual control for individual users
- Automatic unlock system with real-time sync
- Professional admin UI design

#### 4.10.13 Coupon Code Management

- **Coupon Code List**: View all created coupon codes with filter/search
- **Create Coupon Code**: Code text, discount percentage, validity period, usage limit, status toggle
- **Edit Coupon Code**: Modify all coupon parameters
- **Delete Coupon Code**: Remove with confirmation
- **Coupon Usage Tracking**: View usage per user, total usage count, total discount amount, export to Excel
- Professional admin UI design

#### 4.10.14 Landing Page Editor

- Dedicated separate page within the admin panel
- **Editable Sections**: Hero/Banner, Investment Plan, Platform Features & Benefits, Testimonials, Call-to-Action, Footer, General Landing Page Settings
- **Save & Preview**: Save button, preview option, confirmation prompt before saving
- **Data Storage**: All landing page content stored in Supabase via Node.js backend
- Professional admin UI design

#### 4.10.15 Legal Policy Management

- **KYC Policy Section**: Rich text WYSIWYG editor, Update button, versioned with audit trail
- **Refund Policy Section**: Rich text WYSIWYG editor, Update button, versioned with audit trail
- All policy content stored in Supabase via Node.js backend
- Public landing page dynamically pulls and displays latest saved content
- Professional admin UI design

#### 4.10.16 Full Access

- Full access to manage and edit website content without coding

#### 4.10.17 Direct Referral Performance Management

- **Interface Location**: Accessible from the User Details Edit page
- **Access Control**: Super-admin role required
- **Viewable and Editable Fields**: Number of direct referrals, performance score or ranking, contribution value of direct referrals, current cumulative direct referral deposit total (read-only, editable only via manual correction tool with audit trail)
- **Edit Workflow**: Admin selects user, modifies fields, submits via Save button; Cancel button available; secondary confirmation (admin password re-entry) required; changes immediately synced to user dashboard
- **Validation Rules**: All fields validated client-side and server-side; non-negative values required
- **Audit Logging**: Every change recorded in admin_audit_log with action type REFERRAL_PERFORMANCE_EDIT, admin user ID, target user ID, field name, previous value, new value, and timestamp; log entries are immutable
- **API Endpoints**:
  - GET /api/admin/users/:userId/referral-performance
  - PUT /api/admin/users/:userId/referral-performance
- Professional admin UI design

#### 4.10.18 ROI Settings Module

- **Monthly ROI Rate Configuration**: Display current rate, input field to update, auto-calculated Daily ROI Rate display, Save button, secondary confirmation required, change logged immediately, updated rate instantly synced to user dashboard
- **Daily ROI Calculation Engine**: Automated backend cron job; formula: Daily ROI = (User's Qualified Investment Balance * (Monthly ROI Rate / 100)) / [Number of Days in the Month]; credited 24 hours after deposit time; fault tolerance with retry logic and idempotency
- **Calculation Run Log Viewer**: Read-only log of last several automated daily calculation runs
- **Manual Recalculation Tool**: Admin selects target date and provides reason; secondary confirmation required; all adjustments recorded in admin_audit_log
- Professional admin UI design

#### 4.10.19 Admin Settings

- **Access Control**: Accessible only to authorized admin users
- **SEO Optimization Module**: Site title, meta description, Open Graph tags, robots.txt, XML sitemap
- **Branding & Assets Management**: Logo upload, favicon upload, color scheme, typography; all values stored in Supabase and applied dynamically; no hardcoded branding
- **SMTP Credential Management**: Secure runtime update of Zoho Mail SMTP credentials, immediate Nodemailer transport re-initialization without server restart, Test Connection and Save & Verify functionality, connection status display, bufio partial-read error fix
- **Additional Site Configuration Options**: Contact email, announcement bar, analytics code injection
- **Save & Apply**: Changes persisted to Supabase and applied immediately
- Professional admin UI design with tabbed layout

### 4.11 Additional Pages

- Terms & Conditions
- Privacy Policy
- KYC Policy (content dynamically loaded from admin-managed Supabase storage)
- Refund Policy (content dynamically loaded from admin-managed Supabase storage)
- Contact/Support: contact form with email display (no call or address options)
- Events page (show coming soon message)
- Professional UI design across all pages

---

## 5. Investment Plan Details

### 5.1 Investment Parameters

- Minimum Investment: 100 USDT (compulsory without fee)
- Maximum Investment: Unlimited
- Deposit Fee: 5% (can be reduced with coupon code)
- Withdrawal Fee: 5%
- Daily ROI: Automatically calculated from admin-configured Monthly ROI Rate using the formula: Daily ROI = (User's Qualified Investment Balance * (Monthly ROI Rate / 100)) / [Number of Days in the Month]; credited automatically 24 hours after deposit time
- Monthly ROI: Admin-configurable percentage displayed in user dashboard
- Compounding: NO

### 5.2 Referral Commission Structure

#### 5.2.1 Basic Levels (1-4)

- Level 1: Admin-configurable percentage (default 8%)
- Level 2: Admin-configurable percentage (default 4%)
- Level 3: Admin-configurable percentage (default 2%)
- Level 4: Admin-configurable percentage (default 1%)
- Real-time synchronization when admin updates percentages

#### 5.2.2 Performance-Based Levels (5-15)

| Level | Commission Rate | Unlock Target (Cumulative Direct Referral Deposits) |
|-------|----------------|-----------------------------------------------------|
| 5 | 0.1% | 10,000 USDT |
| 6 | 0.2% | 25,000 USDT |
| 7 | 0.3% | 50,000 USDT |
| 8 | 0.4% | 75,000 USDT |
| 9 | 0.5% | 100,000 USDT |
| 10 | 0.6% | 150,000 USDT |
| 11 | 0.7% | 200,000 USDT |
| 12 | 0.8% | 300,000 USDT |
| 13 | 0.9% | 400,000 USDT |
| 14 | 1.0% | 500,000 USDT |
| 15 | 4.0% | 1,000,000 USDT |

---

## 6. Wallet System

### 6.1 Wallet Types

- Deposit Wallet: For investment deposits
- ROI Wallet: For daily ROI earnings
- Bonus Wallet: For referral commissions
- Withdrawal Wallet: For processed withdrawals
- Auto-Withdrawal Wallet Address: Stored on user profile for automated monthly payouts on the 20th

### 6.2 Payment Integration

- USDT payment support (BEP-20 and TRC-20 networks)
- Automatic transaction confirmation for TRC-20 and BEP-20
- Secure payment gateway integration
- Transaction hash verification

---

## 7. Features & Functionality

### 7.1 User Features

- **Terms & Conditions acceptance checkbox on signup page (required before account creation)**
- **Email confirmation link for new user registration** via Zoho Mail SMTP using professionally designed HTML template
- **Secure email link for password reset** via Zoho Mail SMTP using professionally designed HTML template
- Phone number, country, state, city, and pincode registration (required fields)
- OSS Google login support
- Real-time balance updates
- Auto-Withdrawal Wallet Address on profile page
- Referral attribution across all login methods
- Coupon code application during deposit
- Daily ROI credit and countdown timer
- Monthly ROI percentage display in dashboard
- In-app and email notifications
- Transaction history tracking
- 15-level referral system
- Performance-based referral level unlocking
- Support center with FAQ and ticket system
- Dark/light mode toggle
- PWA support
- One-click Excel data export
- Auto withdrawal toggle
- KYC verification compulsory before withdrawal
- Clickable help links redirecting to admin-configured YouTube videos
- Professional, modern UI design

### 7.2 Admin Features

- OTP verification for admin login and signup (delivered via Zoho Mail SMTP)
- User management (view, edit, delete)
- Create User functionality
- Delete User functionality (super-admin only)
- Download All Users as Excel
- User details edit with total fee display
- **Direct Referral Performance Management**
- Deposit approval/rejection
- Withdrawal approval/rejection
- **Coupon Code Management**
- **Landing Page Editor**
- **Legal Policy Management**
- **ROI Settings Module**
- **Admin Settings** including **SMTP Credential Management** and **Branding & Assets Management** (all neutral, no hardcoded brand)
- **TRC-20/BEP-20 API Configuration** within Platform Settings
- Platform Settings with all options
- Dashboard Statistics
- Notification Center
- Transactions Page
- Filter Options across all management pages
- Global auto withdrawal control
- Tutorial content management
- Support ticket management
- KYC management
- Performance-based referral management
- Full website management capabilities
- Professional admin UI design

### 7.3 Security Features

- Rate limiting
- CAPTCHA integration
- Secure authentication flow
- **Terms & Conditions acceptance enforced client-side and server-side; acceptance timestamp stored in Supabase**
- Email confirmation link for new user registration (unique, time-bound, delivered via Zoho Mail SMTP)
- Secure time-bound email link for password reset (delivered via Zoho Mail SMTP)
- Email OTP verification for admin login and signup via Zoho Mail SMTP
- Activity logging
- Secondary confirmation (admin password re-entry) for financially impactful actions
- Role-based access control
- SQL injection prevention
- XSS prevention
- Input sanitization and validation
- Secure file upload handling via Supabase Storage
- SMTP password stored encrypted at rest (AES-256); never returned in plain text
- Blockchain API keys stored encrypted at rest; never returned in plain text
- All credential management operations over HTTPS only
- Confirmation link and password reset link tokens stored securely with expiry enforcement; tokens invalidated after single use
- Supabase RLS enforced on all tables; service role key used only in Node.js backend

### 7.4 Automated Features

- Daily ROI credit based on admin-configured Monthly ROI Rate
- Performance-based referral level unlocking
- Coupon code validation and application
- Referral attribution automation
- Referral recalculation on user deletion
- SEO meta tags and analytics code injected dynamically
- Nodemailer SMTP transport auto-reinitialization upon SMTP credential update
- TRC-20/BEP-20 deposit auto-confirmation service reloads API configuration immediately upon admin update
- Automatic expiry and invalidation of email confirmation links and password reset links

---

## 8. Design Requirements

### 8.1 Theme

- Professional, modern UI design with enhanced visual appeal
- Black-themed color scheme as primary theme
- Dark theme as default
- Responsive layout for all devices
- Smooth animations and transitions
- Primary brand colors and typography configurable via Admin Settings

### 8.2 Branding

- Application name: Gold X Usdt (configurable via Admin Settings)
- Custom logo (admin can edit via Admin Settings; no hardcoded logo files)
- Favicon (admin can edit via Admin Settings; no hardcoded favicon files)
- All branding is neutral on fresh deployment until configured by admin

### 8.3 UI Components

- Balance display cards
- Transaction history tables
- Referral tree visualization
- Admin dashboard with statistics
- Form inputs with validation
- Modal dialogs for confirmations
- Toast notifications
- Loading states
- Country, state, and city selection dropdowns
- Auto withdrawal toggle
- Filter components
- Notification center interface
- Performance level progress indicators
- Daily ROI countdown timer
- Coupon code input field
- Landing page editor interface
- Legal policy WYSIWYG editor panels
- Direct Referral Performance edit panel
- ROI Settings Module interface
- Admin Settings interface with tabbed layout
- SMTP Credential Management panel
- **TRC-20/BEP-20 API Configuration panel with masked API key inputs, Test Connection buttons, enable/disable toggles, and save buttons per network**
- Email confirmation pending screen with resend option
- Password reset page
- **Terms & Conditions acceptance checkbox on signup form with inline validation error display**
- **Button Styling Rule**: All interactive buttons must maintain a single, standard color at all times across default, active, and focused states. Hover interaction feedback must use alternative visual cues only (box-shadow, border style, or text underline) — not a primary color change.
- Professional, modern design across all components

---

## 9. Email Interfaces

### 9.1 Email Service

- **Provider**: Zoho Mail
- **SMTP Server Address**: smtp.zoho.com
- **SMTP Port**: 587 (STARTTLS, recommended) or 465 (SSL/TLS)
- **Security/Encryption**: TLS/SSL
- **Authentication**: Required
- All outbound emails routed through Zoho Mail SMTP
- Old Juvlon API key and SMTP credentials must be deactivated and removed
- SMTP credentials manageable at runtime via Admin Settings without server restart

### 9.2 Email Templates

All transactional emails must use professionally designed, fully rendered HTML email templates. Each template must be responsive, visually consistent with the platform branding, and render correctly across major email clients (Gmail, Outlook web, Apple Mail).

#### 9.2.1 Signup Email Verification Template

- **Trigger**: Sent immediately upon successful user registration form submission
- **Subject line**: Verify Your Email Address — Gold X Usdt
- **Recipient personalization**: The email must address the user by their registered username in the greeting line (e.g., Hello {{USER_NAME}},)
- **Template design specifications**:
  - Background color: #f4f4f7 (soft light gray)
  - Centered single-column layout, maximum width 600px
  - White card container with rounded corners (border-radius: 8px) and subtle box-shadow
  - Font: Arial, Helvetica, sans-serif (system-safe)
  - All CSS must be inline only — no external stylesheets, no `<style>` blocks, no JavaScript
  - Mobile-responsive using percentage-based widths and max-width constraints
- **Template structure**:
  - **Header**: Platform logo loaded dynamically from Admin Settings branding configuration; logo centered on a dark or branded background header bar
  - **Personalized greeting**: Hello {{USER_NAME}}, — displayed in bold, larger font
  - **Body copy**:
    - Welcome message confirming successful registration
    - Clear instruction informing the user that they must verify their email address to activate their account
    - Statement that the account will remain inactive until the verification link is clicked
  - **Primary CTA button**:
    - Label: Verify Email
    - Link: {{VERIFICATION_LINK}}
    - Style: large, rounded button (border-radius: 6px); background color green (#28a745 or equivalent); white text; bold font; generous padding (14px 32px); centered
    - Hover state not applicable in email; button must be visually prominent at rest
  - **Fallback plain-text URL**: Displayed below the CTA button with instructional text such as: If the button above does not work, copy and paste the following link into your browser: followed by the raw {{VERIFICATION_LINK}} URL in a smaller, muted font
  - **Time-sensitivity notice**: A clearly visible line stating the verification link will expire within a defined period
  - **Non-request notice**: A clearly visible paragraph stating — If you did not create an account or did not request this verification email, please ignore this message. Your email address will not be used without verification. No further action is required.
  - **Security reminder**: Do not share this link with anyone.
  - **Optional context placeholders**: IP address placeholder ({{IP_ADDRESS}}), device placeholder ({{DEVICE_INFO}}), and location placeholder ({{LOCATION}}) may be included in a small muted section below the security notice if available at send time
  - **Footer**: Platform name ({{APP_NAME}}), copyright line (© {{YEAR}} {{APP_NAME}}. All rights reserved.), Need help? Contact support line with a support email or link, legal disclaimer
- **Post-click redirect behavior**: Upon clicking the verification link, the backend validates the token, activates the user account, invalidates the token, and redirects the user to the login page of the application
- **Technical requirements**:
  - Unique time-bound confirmation URL generated per registration using {{VERIFICATION_LINK}}
  - Token validated server-side on click
  - Token invalidated after single use
  - Rendered server-side in Node.js using HTML template engine (.hbs, .ejs, or .html partials)
  - Inline CSS styles only for maximum email client compatibility
  - Mobile-responsive single-column layout with maximum width of 600px
  - Tested for rendering in Gmail, Outlook (web), and Apple Mail before deployment
  - Template variables: {{USER_NAME}}, {{VERIFICATION_LINK}}, {{YEAR}}, {{APP_NAME}}, {{IP_ADDRESS}} (optional), {{DEVICE_INFO}} (optional), {{LOCATION}} (optional)

#### 9.2.2 Password Reset Email Template

- **Trigger**: Sent when a user submits a password reset request via the Forgot Password flow
- **Subject line**: Reset Your Password — Gold X Usdt
- **Recipient personalization**: The email must address the user by their registered username in the greeting line (e.g., Hello {{USER_NAME}},)
- **Template design specifications**:
  - Background color: #f4f4f7 (soft light gray)
  - Centered single-column layout, maximum width 600px
  - White card container with rounded corners (border-radius: 8px) and subtle box-shadow
  - Font: Arial, Helvetica, sans-serif (system-safe)
  - All CSS must be inline only — no external stylesheets, no `<style>` blocks, no JavaScript
  - Mobile-responsive using percentage-based widths and max-width constraints
- **Template structure**:
  - **Header**: Platform logo loaded dynamically from Admin Settings branding configuration; logo centered on a dark or branded background header bar
  - **Personalized greeting**: Hello {{USER_NAME}}, — displayed in bold, larger font
  - **Body copy**:
    - Statement that a password reset request was received for this account
    - Clear instruction to click the button below to reset the password
    - Explicit statement: This link will expire in 10–15 minutes
  - **Primary CTA button**:
    - Label: Reset Password
    - Link: {{RESET_LINK}}
    - Style: large, rounded button (border-radius: 6px); background color blue (#007bff) or red (#dc3545); white text; bold font; generous padding (14px 32px); centered
    - Hover state not applicable in email; button must be visually prominent at rest
  - **Fallback plain-text URL**: Displayed below the CTA button with instructional text such as: If the button above does not work, copy and paste the following link into your browser: followed by the raw {{RESET_LINK}} URL in a smaller, muted font
  - **Time-sensitivity notice**: Prominent line reiterating — This password reset link will expire in 10–15 minutes.
  - **Security warning**: A clearly visible paragraph stating — If you did not request a password reset, please ignore this email. Your password will not be changed. No further action is required.
  - **Additional security warning**: Do not share this link with anyone. Our team will never ask for this link.
  - **Optional context placeholders**: IP address placeholder ({{IP_ADDRESS}}), device placeholder ({{DEVICE_INFO}}), and location placeholder ({{LOCATION}}) may be included in a small muted section below the security warning if available at send time
  - **Footer**: Platform name ({{APP_NAME}}), copyright line (© {{YEAR}} {{APP_NAME}}. All rights reserved.), Need help? Contact support line with a support email or link, legal disclaimer
- **Technical requirements**:
  - Unique time-bound reset URL generated per request using {{RESET_LINK}}
  - Token validated server-side on click
  - Token invalidated after single use
  - Reset request for non-existent email must not reveal whether the email exists
  - Rendered server-side in Node.js using HTML template engine (.hbs, .ejs, or .html partials)
  - Inline CSS styles only for maximum email client compatibility
  - Mobile-responsive single-column layout with maximum width of 600px
  - Tested for rendering in Gmail, Outlook (web), and Apple Mail before deployment
  - Template variables: {{USER_NAME}}, {{RESET_LINK}}, {{YEAR}}, {{APP_NAME}}, {{IP_ADDRESS}} (optional), {{DEVICE_INFO}} (optional), {{LOCATION}} (optional)

#### 9.2.3 Template Implementation Requirements

- Both templates implemented as server-side HTML template files (.hbs, .ejs, or .html partials)
- Inline CSS styles only for maximum email client compatibility — no external CSS, no `<style>` blocks, no JavaScript
- Mobile-responsive single-column layout with maximum width of 600px
- Both templates tested for rendering in Gmail, Outlook (web), and Apple Mail before deployment
- All legacy plain-text-only email sending code replaced by these templates
- Production-ready HTML output: clean, well-structured, no placeholder comments left in final code
- Template variables used across both templates: {{USER_NAME}}, {{VERIFICATION_LINK}}, {{RESET_LINK}}, {{YEAR}}, {{APP_NAME}}, {{IP_ADDRESS}} (optional), {{DEVICE_INFO}} (optional), {{LOCATION}} (optional)

### 9.3 Email Notifications

- Registration email confirmation link
- Password reset link
- Admin OTP verification codes
- Deposit confirmation
- Withdrawal request confirmation
- Withdrawal approval/rejection
- Daily ROI credit notification
- Referral commission credit
- Performance level unlock notification
- KYC verification status updates
- Auto withdrawal execution notification
- Coupon code usage confirmation

---

## 10. Admin Credentials

### 10.1 Admin Access

- Username: (to be configured)
- Password: (to be configured)
- Email OTP verification required for admin login and signup
- Full access to admin panel features
- Super-admin role for user deletion functionality
- Global auto withdrawal control access
- All module access as defined in Section 4.10

---

## 11. Withdrawal Rules

### 11.1 KYC Requirement

- KYC verification is compulsory before any withdrawal
- Withdrawal requests blocked until KYC is approved

### 11.2 Cooling Periods

- Normal withdrawals: 48-hour cooling period
- Referral bonus withdrawals: 30-day lock period from credit date
- Auto withdrawal cooling period: Auto-calculated when auto withdrawal is enabled

### 11.3 Processing

- All withdrawal requests require admin approval
- 5% withdrawal fee applied
- Minimum withdrawal amount enforced
- Manual withdrawal locked when auto withdrawal cooling period is active
- Fix withdrawal approval reflection for both user and admin sides
- Fix withdrawal rejection functionality

### 11.4 Auto Withdrawal

- User can enable/disable auto withdrawal via toggle switch
- When enabled: User must enter wallet address and save
- Display auto withdrawal date: 20th of every month
- Admin can manage and edit auto withdrawal settings
- Global admin control with master toggle

---

## 12. Contact Page Requirements

- Contact form for user inquiries
- Display contact email address (admin-configurable via Admin Settings)
- Remove call and physical address options
- Form submission sends to admin-configured email
- Professional UI design

---

## 13. Data Export Requirements

### 13.1 Admin Export

- Download All Users as Excel button
- Full export of all user data including name, email, phone number, country, state, city, pincode, referred by, auto withdrawal enabled status, fund information, fee column, month column, referral level status, coupon usage history
- Fix Excel export calculator errors

### 13.2 User Export

- One-click Download My Data button
- Direct file download
- Export user's personal data and transaction history in Excel format

### 13.3 Transaction Export

- Excel download option in Transactions page
- Export all transaction data with filters applied

### 13.4 Coupon Export

- Excel download option for coupon usage data

---

## 14. Tutorial Requirements

### 14.1 Deposit Page Tutorials

- Reduced size tutorial section
- Admin can upload and delete tutorial content
- YouTube video link support for deposit help
- Tutorial topics: How to deposit, How to use coupon codes, How to request withdrawal, How to enable auto payment, How to link wallet

### 14.2 KYC Help

- YouTube video link support for KYC help
- Step-by-step KYC submission guide

### 14.3 Withdrawal Help

- YouTube video link support for withdrawal help
- Withdrawal process guide

---

## 15. Performance-Based Referral System

### 15.1 System Overview

- 11 additional performance-based referral levels (levels 5-15)
- Automatic unlock based on cumulative direct referral deposit targets
- Full admin control for manual enable/disable override
- Visible in both user and admin dashboards
- Recalculation of cumulative progress upon deletion of a direct referral

### 15.2 Unlock Mechanism

- System automatically monitors cumulative direct referral deposit totals per user in real-time
- When cumulative total meets or exceeds a level's target, that level unlocks automatically
- Admin can manually enable or disable any level for any user
- Real-time sync to user dashboard when level status changes
- Upon deletion of a direct referral, cumulative progress is recalculated; already-unlocked levels are not rolled back

### 15.3 Admin Control

- Configure commission percentages and targets for each performance level
- Enable/disable performance levels globally
- Manual control for individual users

### 15.4 User Experience

- Display all 15 referral levels with complete details
- Show unlock status and cumulative target progress
- Real-time updates and notifications when levels unlock

---

## 16. Coupon Code System

### 16.1 System Overview

- Promotional discount system for deposit fees
- Admin-managed coupon codes
- Comprehensive tracking and analytics

### 16.2 Coupon Code Features

#### 16.2.1 User Features

- Coupon code input field in deposit page with Apply button
- Real-time validation feedback
- Discount display: original fee, discount percentage, discount amount, final amount
- One coupon per deposit transaction

#### 16.2.2 Admin Features

- Create, edit, delete coupon codes
- Set parameters: code, discount percentage, validity period, usage limit, status
- View coupon usage statistics and track usage per user
- Export coupon usage data to Excel

### 16.3 Coupon Code Rules

- Coupon discount applies only to deposit fee (5%)
- One coupon code per deposit transaction
- Coupon must be active and within validity period
- Coupon usage must not exceed set limit
- Invalid/expired coupons display error message

---

## 17. Landing Page Editor

### 17.1 Overview

- Dedicated separate page within the admin panel
- All edits saved to Supabase via Node.js backend and reflected live

### 17.2 Editable Content Sections

- Hero / Banner, Investment Plan, Platform Features & Benefits, Testimonials, Call-to-Action (CTA), Footer, General Settings

### 17.3 Save & Preview

- Save button, preview option, confirmation prompt before saving

---

## 18. Legal Policy Management

### 18.1 Overview

- Dedicated sections within the admin content management page
- Content stored in Supabase via Node.js backend

### 18.2 KYC Policy

- Rich text WYSIWYG editor, Update button, versioned with audit trail

### 18.3 Refund Policy

- Rich text WYSIWYG editor, Update button, versioned with audit trail

---

## 19. Critical Bug Fixes and Enhancements

### 19.1 SMTP Migration: Juvlon to Zoho Mail

- Replace Juvlon email service with Zoho Mail SMTP
- Decommission and remove all Juvlon-related credentials and configuration
- Update all environment variables and configuration files
- Post-migration testing and documentation update

### 19.2 Email Template Fix and Implementation

- **Root Cause**: Previous email implementation delivered only a bare true message or empty body
- **Fix**: Replace all legacy plain-text or bare-response email sending code with the professionally designed HTML templates defined in Sections 9.2.1 and 9.2.2
- Comprehensive end-to-end testing of all registration confirmation link and password reset link flow scenarios

### 19.3 Withdrawal Approval Reflection Fix

- Fix withdrawal approval functionality
- Ensure funds are properly reflected in withdrawal wallet for both user and admin sides

### 19.4 Referral Level Display Enhancement

- Display all 15 referral levels in user referral page with complete details
- Real-time updates when levels unlock

### 19.5 Daily ROI Timer Display

- Add countdown timer in user dashboard
- Display time remaining until next ROI credit
- Update timer in real-time; reset after ROI credit

### 19.6 Backend Migration to Node.js and Supabase

- Migrate entire backend and database from MySQL to Supabase (PostgreSQL)
- Remove all MySQL-related code, configuration files, connection strings, ORM configurations, and npm dependencies
- Update all API routes, environment variables, and SDK calls to reference Supabase
- Verify data integrity post-migration
- Integrate Supabase authentication, real-time, and storage functionalities

### 19.7 Excel Export Enhancement

- Fix Excel export calculator errors
- Ensure all columns are properly filled

### 19.8 User Creation and Signup Fix

- Fix admin create user error
- Fix new user signup error

### 19.9 Support Ticket Reception Fix

- Fix issue where tickets are not received in admin panel

### 19.10 Withdrawal Approval and Rejection Fix

- Fix withdrawal request approval and rejection functionality

### 19.11 Filter Options Addition

- Add filter options in support ticket management, KYC management, deposit management, withdrawal management, and coupon management

### 19.12 Auto Withdrawal Date Change

- Change all auto withdrawal dates to 20th of the month

### 19.13 Notification Center Implementation

- Add notification center in admin panel with all system notifications and real-time updates

### 19.14 Transactions Page Addition

- Add Transactions page in admin panel with all transaction types, filter options, Excel download, and page load failure fix

### 19.15 Platform Settings Enhancement

- Restore TRC/BSC API update option, global auto withdrawal toggle, and logs option
- Add coupon code management, email service configuration, ROI Settings Module, and TRC-20/BEP-20 API Configuration options

### 19.16 Content Management Enhancement

- Add YouTube link management for deposit help, KYC help, and withdrawal help
- Add KYC Policy and Refund Policy WYSIWYG editors

### 19.17 Admin Dashboard KYC Statistics Enhancement

- Make KYC pending count, completed KYC count, and non-KYC count clickable

### 19.18 KYC Document Management Enhancement

- Add KYC document management functionality in admin panel
- KYC documents stored in Supabase Storage (kyc-documents private bucket)

### 19.19 User Details Edit Enhancement

- Add total fee collected display
- Enable editing of all user data
- Add Direct Referral Performance section

### 19.20 Daily ROI Implementation Enhancement

- Implement daily ROI credit using formula and automated cron job with fault tolerance

### 19.21 User Transaction Page Addition

- Add transaction page for users with all transaction types, filtering, and search

### 19.22 Help Link Redirect Implementation

- Make deposit help, KYC help, and withdrawal help links clickable and redirect to admin-configured YouTube links

### 19.23 Performance-Based Referral System Implementation

- Implement 11 performance-based referral levels (levels 5-15) with finalized commission rates and cumulative targets

### 19.24 UI Design Enhancement

- Implement professional, modern UI design across entire platform
- **Button Hover Color Change Removal**: Audit all interactive button styles; remove any CSS rules that change a button's primary color exclusively on hover; hover feedback must use alternative visual cues only

### 19.25 Coupon Code System Implementation

- Implement coupon code input, validation, discount calculation, admin management, usage tracking, analytics, and export

### 19.26 Landing Page Editor Implementation

- Create dedicated Landing Page Editor page in admin panel

### 19.27 Auto-Withdrawal Wallet Address on Profile Page

- Design and implement Auto-Withdrawal Wallet Address section on user profile page

### 19.28 Referral Attribution Fix Across All Login Methods

- Fix referral code preservation and attribution across all login methods

### 19.29 Admin Panel Page Load Failure Fixes

- Fix Support page and Transactions page load failures

### 19.30 Legal Policy Pages Implementation

- Create KYC Policy and Refund Policy management sections with WYSIWYG editors, versioning, and dynamic public pages

### 19.31 User Deletion with Referral Recalculation

#### 19.31.1 Overview

When a super-admin deletes a user account, the system must execute a structured deletion and cleanup workflow enforcing three core business rules:
1. All funds belonging to the deleted user are permanently rescinded with no recovery or redistribution.
2. No previously unlocked performance level or rank for any other user in the referral chain is rolled back or altered.
3. The cumulative referral deposit progress of any user who had the deleted user as a direct referral is recalculated to exclude the deleted user's deposit contributions.

#### 19.31.2 Step-by-Step Deletion and Cleanup Logic Flow

- Step 1: Pre-Deletion Validation
- Step 2: Fund Rescission
- Step 3: User Account Soft-Deletion
- Step 4: Referral Progress Recalculation for Affected Referrers
- Step 5: Referral Tree Integrity
- Step 6: Audit Logging

#### 19.31.3 Key Function Descriptions

- deleteUser(adminId, targetUserId)
- identifyAffectedReferrers(targetUserId)
- rescindUserFunds(targetUserId)
- softDeleteUser(targetUserId)
- recalculateReferralProgress(referrerIds)
- writeAuditLog(adminId, targetUserId, rescindedFunds, recalculationResults)

#### 19.31.4 Database Fields and Status Flags

**profiles table**: is_deleted, deleted_at, cumulative_direct_referral_deposits, referred_by_user_id

**admin_audit_log table** — action_type values: USER_DELETION, REFERRAL_RECALCULATION, REFERRAL_PERFORMANCE_EDIT, ROI_RATE_CHANGE, ROI_MANUAL_RECALCULATION; additional fields: field_name, previous_value, new_value, correction_reason, is_immutable

#### 19.31.5 Audit Log Visibility

- admin_audit_log entries must be visible in the admin Logs section under Platform Settings
- Log entries must not be editable or deletable by any admin role through the UI

### 19.32 Direct Referral Performance Management Implementation

- Implement referral_performance table in Supabase
- Build admin UI section within User Details Edit page
- Implement Save and Cancel buttons, validation, secondary confirmation modal, immutable audit logging, real-time sync, and new API endpoints

### 19.33 ROI Settings Module Implementation

- Implement roi_settings table and daily_roi_logs table in Supabase
- Build ROI Settings Module UI within Platform Settings
- Implement automated daily cron job with fault tolerance
- Implement manual recalculation tool with full audit trail
- Implement new API endpoints

### 19.34 Admin Settings Implementation

- Implement admin_settings table in Supabase
- Build Admin Settings UI with tabbed layout covering SEO, Branding, Site Configuration, Analytics, and SMTP Credential Management
- Implement file upload handling for logo and favicon via Supabase Storage (platform-assets public bucket)
- Implement color picker and typography selection
- Implement robots.txt view/edit and XML sitemap generation
- Implement new API endpoints including PUT /api/admin/settings/smtp and POST /api/admin/settings/smtp/test

### 19.35 TRC-20 / BEP-20 API Configuration Implementation

- Implement blockchain_api_settings table in Supabase (schema defined in Section 2.5)
- Build TRC-20/BEP-20 API Configuration UI panel within Platform Settings
- Implement deposit auto-confirmation fetch logic in Node.js backend
- Implement new API endpoints as defined in Section 2.5
- Protect all endpoints with admin authentication
- API keys stored encrypted at rest (AES-256); decrypted only in Node.js backend memory at runtime
- On save, deposit auto-confirmation service reloads active API configuration immediately without server restart

### 19.36 Post-Development Code Audit and Quality Assurance

#### 19.36.1 Overview

Upon completion of initial development, perform a comprehensive, line-by-line code review of the entire application codebase (both front-end and back-end) to identify and resolve all errors, security vulnerabilities, performance issues, and code quality concerns.

#### 19.36.2 Error Identification and Fixing

- Syntax Errors, Runtime and Logical Errors, Security Vulnerabilities (SQL injection, XSS, improper auth, insecure file uploads, sensitive data exposure, CSRF), Performance Bottlenecks, Broken Links and Incorrect Routes

#### 19.36.3 Code Quality and Best Practices Audit

- Consistent Formatting and Style, DRY Principles, Code Commenting and Documentation, HTML Validation and Accessibility, CSS Quality (including button hover color change verification), JavaScript Standards
- Verify complete removal of all MySQL dependencies and configuration
- Verify complete removal of all hardcoded branding, logos, and proprietary marks
- Verify all Supabase integration points are correctly implemented

#### 19.36.4 Audit Report Deliverable

- Detailed audit report containing summary, complete list of identified issues categorized by type, description and fix for each issue, and confirmation that all issues have been resolved
- Audit report stored and accessible within the admin panel or delivered as a downloadable document

#### 19.36.5 Final Deliverable

- A fully functional web application with a secure admin panel featuring all specified Admin Settings
- The detailed audit report
- The final, error-free, and audited source code

### 19.37 Deployment Configuration Implementation

#### 19.37.1 Overview

Implement complete, production-ready deployment configuration files and scripts for all supported hosting platforms as defined in Section 2.7.

#### 19.37.2 Netlify Configuration

- Create `netlify.toml` at project root with correct build command, publish directory, Node.js version, SPA redirect rules, API proxy rules, and security headers
- Document all required environment variables for Netlify dashboard entry
- Verify build succeeds and all routes function correctly after deployment
- Fix any existing Netlify configuration errors

#### 19.37.3 Vercel Configuration

- Create `vercel.json` at project root with correct build configuration, SPA rewrite rules, API proxy or serverless function routing, security headers, and region settings
- Document all required environment variables for Vercel dashboard entry with separate sets for Production, Preview, and Development
- Verify build succeeds and all routes function correctly after deployment
- Fix any existing Vercel configuration errors

#### 19.37.4 Other Platform Configurations

- Create `railway.toml` for Railway deployment
- Create `render.yaml` for Render deployment
- Create `Procfile`, `app.json`, and engines field in `package.json` for Heroku deployment
- Create `.do/app.yaml` for DigitalOcean App Platform deployment
- Create `Dockerfile`, `docker-compose.yml`, `ecosystem.config.js` (PM2), and `nginx.conf` for VPS/self-hosted deployment
- Verify each configuration is syntactically correct and functionally complete

#### 19.37.5 CI/CD Pipeline

- Create `.github/workflows/deploy.yml` GitHub Actions workflow
- Configure triggers for main (production) and develop (staging) branches
- Include steps for dependency installation, linting, testing, frontend build, and platform deployment
- Reference all sensitive values from GitHub repository secrets

#### 19.37.6 Database Migration for Deployment

- Ensure all migration scripts are idempotent and runnable as pre/post-deployment steps against the Supabase PostgreSQL database
- Document migration command in DEPLOYMENT.md
- Provide initial admin seed script for fresh deployments

#### 19.37.7 Deployment Audit and Fix

- Audit entire codebase for deployment-breaking issues and fix all identified problems
- Verify application starts correctly and all features function as expected on each supported platform
- Document all identified issues and resolutions in the post-development audit report (Section 19.36)

#### 19.37.8 Deployment Documentation

- Create `DEPLOYMENT.md` at project root covering prerequisites, step-by-step deployment guides for all supported platforms, complete environment variable reference (Supabase-based), database setup and migration instructions, post-deployment verification checklist, troubleshooting section, SSL/TLS setup instructions, and credential rotation procedures

### 19.38 Terms & Conditions Acceptance on Signup

#### 19.38.1 Overview

Add a mandatory Terms & Conditions acceptance checkbox to the user signup form.

#### 19.38.2 Implementation Requirements

- **Frontend**:
  - Add a checkbox input element below the form fields and above the submit button
  - Label: I have read and agree to the Terms & Conditions (Terms & Conditions text is a hyperlink to the Terms & Conditions page, opening in a new tab)
  - Checkbox is unchecked by default
  - Submit button is disabled until the checkbox is checked
  - If the form is submitted without the checkbox checked, display inline validation error: You must accept the Terms & Conditions to create an account

- **Backend**:
  - The signup API endpoint must validate that the terms_accepted field is present and set to true
  - If terms_accepted is false or missing, the API returns a 400 error: Terms & Conditions acceptance is required
  - Upon successful registration, store terms_accepted (BOOLEAN) and terms_accepted_at (TIMESTAMPTZ) in the profiles table in Supabase

- **Google Sign-In Flow**:
  - Display the Terms & Conditions acceptance checkbox on the post-OAuth profile completion screen before finalizing account creation
  - The same server-side validation applies

#### 19.38.3 Validation Rules

- Client-side: checkbox must be checked before form submission is allowed
- Server-side: terms_accepted must be true; request rejected with descriptive error if not
- Both validations are independent and must both be implemented

### 19.39 Branding and Proprietary Mark Removal Implementation

#### 19.39.1 Overview

Conduct a full codebase audit and remove all hardcoded branding, proprietary marks, and third-party attributions as defined in Section 3.

#### 19.39.2 Deliverables

- All hardcoded brand names replaced with generic placeholders or admin-configurable values
- All logo and favicon image files removed from the repository; replaced with neutral placeholder graphics
- All `manifest.json`, HTML title tags, and meta tags updated to use generic or admin-configurable values
- All brand-specific color themes removed or made configurable via Admin Settings
- Confirmation included in the post-development audit report (Section 19.36) that no proprietary marks remain in the codebase

### 19.40 Supabase Setup File Creation

#### 19.40.1 Overview

Create a standalone `SUPABASE_SETUP.md` file at the project root providing a complete, beginner-friendly, step-by-step Supabase configuration guide. This file is the primary database setup guide for the application.

#### 19.40.2 Deliverable

- File name: `SUPABASE_SETUP.md`
- Location: project root
- Content: Full step-by-step setup guide covering the following sections in order:
  - Section 1: Project Initialization and Core Setup (account creation, API key retrieval, CLI setup, environment variable configuration, client library installation, client initialization)
  - Section 2: Database Schema and Table Creation — complete, ready-to-execute SQL script with DROP TABLE IF EXISTS CASCADE statements, CREATE TABLE statements with explicit PostgreSQL data types, primary keys, foreign key constraints, indexes, and ENABLE ROW LEVEL SECURITY statements for all tables as defined in Section 2.6
  - Section 3: Row Level Security Policies — complete, ready-to-execute SQL script with explicit RLS policies for all tables and a trigger-based auto-profile-creation function for new user sign-ups
  - Section 4: Database Management and Operations
  - Section 5: Client-Side Integration Example
  - Section 6: Storage Bucket Configuration (kyc-documents private bucket, platform-assets public bucket, bucket policies, Node.js upload example)
  - Section 7: Realtime Subscriptions setup
  - Section 8: Authentication Configuration
  - Section 9: Edge Functions deployment
  - Section 10: Hosting Platform Environment Variable Configuration
  - Section 11: Connection Testing
  - Section 12: Database Migration and Admin Seeding
  - Section 13: Final Checklist and Next Steps
  - Section 14: Troubleshooting
  - Section 15: Security Reminders
- Format: Numbered step-by-step format with clear section headings, labeled code blocks, bullet points, bold emphasis for critical warnings, and inline security notes
- The document must be self-contained and followable linearly by a complete beginner

---

## 20. Acceptance Criteria

- Entire backend and database successfully migrated to Supabase (PostgreSQL); all MySQL code and dependencies removed and verified absent
- All deployment pipeline errors on GitHub Actions, Vercel, and Netlify identified, fixed, and confirmed resolved with successful builds
- All hardcoded branding, logos, proprietary marks, and third-party attributions removed from the entire codebase; all branding is neutral and admin-configurable
- Full code audit completed; all critical and high-priority bugs fixed; final smoke test passes on deployed application
- All 15 referral levels display correctly with real-time unlock status
- Daily ROI countdown timer displays and resets correctly
- Withdrawal approval correctly reflects in withdrawal wallet for both user and admin
- Email confirmation link and password reset link flows work end-to-end via Zoho Mail SMTP
- Signup email verification template addresses user by {{USER_NAME}}, clearly instructs email verification, includes Verify Email CTA button (green, rounded, inline CSS only) that redirects to login page upon successful activation, includes fallback plain-text URL, includes time-sensitivity notice, and includes non-request notice paragraph
- Password reset email template addresses user by {{USER_NAME}}, includes Reset Password CTA button (blue or red, rounded, inline CSS only), includes explicit 10–15 minute expiry notice, includes fallback plain-text URL, and includes security warning paragraph
- Both email templates use inline CSS only, are mobile-responsive with max-width 600px, render correctly in Gmail, Outlook (web), and Apple Mail, and include footer with {{APP_NAME}}, copyright © {{YEAR}}, and contact support line
- All template variables ({{USER_NAME}}, {{VERIFICATION_LINK}}, {{RESET_LINK}}, {{YEAR}}, {{APP_NAME}}) correctly populated at send time
- Terms & Conditions checkbox enforced client-side and server-side on signup
- Coupon code system functions correctly for deposit fee discounts
- All admin management pages load without errors
- All filter options present across management pages
- Auto withdrawal date set to 20th of every month
- Support tickets received correctly in admin panel
- Excel exports contain correct data without calculation errors
- TRC-20 and BEP-20 auto-confirmation functions correctly
- SMTP credentials updatable at runtime without server restart
- Blockchain API credentials updatable at runtime without server restart
- All deployment configuration files present and syntactically correct for all supported platforms
- `DEPLOYMENT.md` and `SUPABASE_SETUP.md` present at project root and complete
- Post-development audit report delivered confirming all issues resolved
- All interactive buttons maintain consistent color; hover uses shadow/border/underline cues only
- No admin setup option visible on any public page
- All application data stored exclusively in Supabase; no local filesystem storage for user-uploaded files

## 21. Out of Scope

- Native mobile applications (iOS/Android)
- Multi-currency support beyond USDT
- Fiat payment gateway integration
- Third-party KYC verification API integration (manual admin review only)
- Advanced analytics beyond admin dashboard statistics
- Multi-language / internationalization support
- Automated tax reporting
- Social media feed integration