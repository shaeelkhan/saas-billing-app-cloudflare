import { KVNamespace } from "@cloudflare/workers-types/experimental";

export interface Customer {
  id: string;
  name: string;
  email: string;
  subscription_plan_id: string;
  subscription_status: "active" | "cancelled";
  subscription_start_date: string;
  subscription_end_date: string;
  billing_cycle: "monthly" | "yearly";
  payment_method: "credit_card" | "paypal" | null;
  payment_status: "pending" | "paid" | "failed" | null;
  payment_date: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  billing_cycle: "monthly" | "yearly";
  price: string;
  duration: Date;
  status: "active" | "inactive";
}

export interface Invoice {
  id: string;
  customer_id: string;
  amount: string;
  due_date: string;
  payment_status: "pending" | "generated" | "paid" | "failed";
  payment_date?: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: "credit_card" | "paypal";
  payment_date: string;
}

export interface Env {
  KV_CUSTOMERS: KVNamespace;
  KV_SUBSCRIPTION_PLANS: KVNamespace;
  KV_INVOICES: KVNamespace;
  KV_PAYMENTS: KVNamespace;
  SENDGRID_API_KEY: string;
}
