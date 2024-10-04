# SaaS Billing App

A serverless billing application that manages customer subscriptions, generates invoices, processes payments, and sends notifications. This app uses Cloudflare Workers for scalability and KV Storage for persistence, and integrates with SendGrid for email notifications.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Scheduled Jobs](#scheduled-jobs)
- [Testing](#testing)

## Features

- Customer management: Create and manage customer profiles.
- Subscription plans: Create, update, and assign subscription plans to customers.
- Invoicing: Automatically generate invoices based on the customer’s subscription plan.
- Payment processing: Process payments via credit card or PayPal.
- Email notifications: Send notifications via SendGrid (e.g., invoices, payment confirmations).
- Cron-triggered scheduled jobs for automatic invoice generation.

## Tech Stack

- **Cloudflare Workers**: Serverless execution environment.
- **KV Storage**: Durable key-value storage for customer, subscription, and invoice data.
- **SendGrid**: Email service provider for sending transactional emails.
- **itty-router**: Lightweight router for handling API routes.

## Setup and Installation

### Prerequisites

- Node.js (v16 or higher)
- Cloudflare Account
- Wrangler CLI (to deploy Cloudflare Workers)
- SendGrid Account (for email service)

### Installation

### Clone the repository:

```
bash
git clone https://github.com/shaeelkhan/saas-billing-app.git
cd saas-billing-app

Install dependencies:
npm install

```

### Set up Cloudflare Wrangler:

```
bash
npm install -g wrangler
wrangler login

```

### Set up environment variables by creating a .env file in the root directory.

### Deployment

### Make sure your wrangler.toml file is correctly configured with your Cloudflare KV namespaces and the SendGrid API key in the root directory.

To deploy run :
wrangler publish OR run npm run deploy

### To start the development server locally:

wrangler dev OR npm run dev
This will serve locally on port 8787

### Environment Variables

Create a .env file in the root directory of your project and add the following environment variables

SENDGRID_API_KEY=your_sendgrid_api_key
KV_CUSTOMERS=your_customers_kv_namespace_id
KV_SUBSCRIPTION_PLANS=your_subscription_plans_kv_namespace_id
KV_INVOICES=your_invoices_kv_namespace_id
KV_PAYMENTS=your_payments_kv_namespace_id

### Testing

Testing is done using the jest framework. To run test cases run following command
npm run tests
