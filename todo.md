# BLACKLORD TECH INC - Development TODO

## Database & Schema
- [x] Configure Neon database connection
- [x] Create users table with JWT token support
- [x] Create wallets table for balance tracking
- [x] Create transactions table for deposit/withdrawal history
- [x] Create orders table for service purchases
- [x] Create products table for hosting plans and bot services
- [x] Run Drizzle migrations

## Authentication & Backend
- [x] Implement JWT token generation and validation (via Manus OAuth)
- [x] Create signup endpoint with password hashing (via Manus OAuth)
- [x] Create login endpoint with JWT token issuance (via Manus OAuth)
- [x] Create logout endpoint
- [x] Implement protected procedure middleware
- [x] Create admin role verification middleware

## Wallet & Transactions
- [x] Create wallet balance query endpoint
- [x] Create transaction history endpoint
- [x] Create deposit endpoint (generic)
- [x] Implement transaction logging for all deposits

## Payment Integrations
- [/] Currency Conversion (1 SD = 5 KSH) implemented in Wallet
- [ ] Integrate Paystack payment API
- [ ] Integrate M-Pesa STK Push API
- [ ] Integrate Pesapal payment gateway
- [ ] Create payment verification endpoints for each gateway
- [ ] Implement webhook handlers for payment confirmations

## Pterodactyl Integration
- [x] Create Pterodactyl API settings in Admin Panel
- [x] Implement Pterodactyl User sync logic
- [x] Implement Pterodactyl Server provisioning logic in Orders
- [x] Add Pterodactyl technical fields to Products schema

## Frontend - Layout & Design
- [x] Upload fire/coal background image to S3
- [x] Create dark cyberpunk color theme (neon blue/purple)
- [x] Build main layout with navigation
- [x] Create responsive design system with Tailwind

## Frontend - Pages
- [x] Build landing/home page with hero section
- [x] Build login page (via Manus OAuth)
- [x] Build signup page (via Manus OAuth)
- [x] Build dashboard page with wallet balance display (SD Currency)
- [x] Build wallet/deposit page with payment method selection (SD Currency)
- [x] Build products/plans page with pricing in SD
- [ ] Build transaction history page
- [x] Build admin panel (users management)
- [x] Build admin panel (transactions management)
- [x] Build admin panel (orders management)
- [x] Build admin panel (system settings)

## Frontend - Components
- [x] Create payment method selector component
- [x] Create wallet balance display component
- [x] Create transaction history table component
- [x] Create product card component
- [ ] Create admin data table component

## Integration & Testing
- [ ] Test signup/login flow
- [ ] Test wallet balance updates
- [ ] Test Paystack integration end-to-end
- [ ] Test M-Pesa STK Push integration end-to-end
- [ ] Test Pesapal integration end-to-end
- [ ] Test admin panel access control
- [ ] Test transaction history accuracy

## Deployment
- [ ] Configure environment variables for production
- [ ] Set up Neon database connection string
- [ ] Add payment gateway API keys
- [ ] Test on staging environment
- [ ] Deploy to Vercel
