# Stripe Payment Integration Setup Guide

This guide explains how to set up and test the Stripe Checkout payment integration with webhooks.

## Overview

The payment system uses **Stripe Checkout** (hosted payment page) instead of embedded card elements. When a user clicks "Pay Now", they are redirected to Stripe's secure checkout page. After payment, Stripe sends a webhook to update the booking status automatically.

## Architecture

1. **User clicks "Pay Now"** → Frontend calls `/payments/create-checkout-session`
2. **Backend creates Stripe Checkout Session** → Returns session URL
3. **User redirects to Stripe** → Completes payment on Stripe's hosted page
4. **Stripe sends webhook** → Backend receives `checkout.session.completed` event
5. **Backend updates database** → Booking status changes to "In Review"
6. **User redirects back** → 
   - **Success**: Redirects to `/payment-success` page with payment details
   - **Cancel**: Redirects to `/payment-cancel` page with retry option

## Environment Variables

### Backend (.env)

Add these variables to your `server/.env` file:

```env
# Existing variables
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**⚠️ IMPORTANT**: Make sure `CLIENT_URL` is set correctly! The payment system uses this to redirect users after payment. If not set, it defaults to `http://localhost:5173`.

### Frontend (.env.local)

The frontend no longer needs the Stripe publishable key for this implementation, but you can keep it for future use:

```env
VITE_API_URL=http://localhost:5000
VITE_Payment_Key=pk_test_...  # Optional, not used in current implementation
```

## Getting Your Stripe Keys

### 1. Stripe Secret Key

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy the **Secret key** (starts with `sk_test_` for test mode)
4. Add to `server/.env` as `STRIPE_SECRET_KEY`

### 2. Stripe Webhook Secret

You have two options for webhook setup:

#### Option A: Local Testing with Stripe CLI (Recommended for Development)

1. **Install Stripe CLI**:
   ```bash
   # Windows (using Scoop)
   scoop install stripe
   
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Linux
   wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
   tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
   sudo mv stripe /usr/local/bin
   ```

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Forward webhooks to your local server**:
   ```bash
   stripe listen --forward-to localhost:5000/payments/webhook
   ```

4. **Copy the webhook signing secret** from the output (starts with `whsec_`)
5. Add it to `server/.env` as `STRIPE_WEBHOOK_SECRET`

#### Option B: Production Webhook Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Enter your endpoint URL: `https://yourdomain.com/payments/webhook`
5. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded` (optional)
   - `payment_intent.payment_failed` (optional)
6. Click **Add endpoint**
7. Copy the **Signing secret** (starts with `whsec_`)
8. Add to `server/.env` as `STRIPE_WEBHOOK_SECRET`

## Testing the Payment Flow

### 1. Start Your Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

**Terminal 3 - Stripe CLI (for local testing):**
```bash
stripe listen --forward-to localhost:5000/payments/webhook
```

### 2. Create a Test Booking

1. Navigate to the trips page
2. Select a package
3. Fill in the booking form
4. Submit the booking (status will be "Pending")

### 3. Make a Test Payment

1. Go to **Dashboard** → **My Bookings**
2. Find the pending booking
3. Click **Pay Now**
4. You'll be redirected to Stripe Checkout
5. Use Stripe test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Requires Authentication**: `4000 0025 0000 3155`
   - Use any future expiry date (e.g., 12/34)
   - Use any 3-digit CVC (e.g., 123)
   - Use any ZIP code (e.g., 12345)

6. Complete the payment
7. You'll be redirected to the **Payment Success** page
8. Click "View My Bookings" to see your confirmed booking
9. The booking status should now be "In Review"

**To test cancellation:**
1. Click "Pay Now" on a pending booking
2. On the Stripe checkout page, click the back arrow or close the window
3. You'll be redirected to the **Payment Cancel** page
4. You can retry the payment or go back to bookings

### 4. Verify Webhook Received

Check your Stripe CLI terminal (Terminal 3). You should see:
```
✔ Received event: checkout.session.completed
```

Check your backend logs for:
```
Payment saved: { bookingId: '...', sessionId: '...', ... }
Booking updated: { acknowledged: true, modifiedCount: 1, ... }
```