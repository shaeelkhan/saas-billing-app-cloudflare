import { Customer, SubscriptionPlan, Invoice, Payment } from "../types/types";
import { Env } from "../types/types";

// Accessing the KV namespaces as defined in the wrangler.toml
export const saveCustomer = async (customer: Customer, env: Env) => {
  await env.KV_CUSTOMERS.put(customer.id, JSON.stringify(customer));
};

export const getCustomer = async (id: string, env: Env): Promise<Customer> => {
  const data = await env.KV_CUSTOMERS.get(id);
  return data ? JSON.parse(data) : null;
};

export const saveSubscriptionPlan = async (
  plan: SubscriptionPlan,
  env: Env
) => {
  await env.KV_SUBSCRIPTION_PLANS.put(plan.id, JSON.stringify(plan));
};

export const getSubscriptionPlan = async (
  id: string,
  env: Env
): Promise<SubscriptionPlan | null> => {
  const data = await env.KV_SUBSCRIPTION_PLANS.get(id);
  return data ? JSON.parse(data) : null;
};

export const saveInvoice = async (invoice: Invoice, env: Env) => {
  await env.KV_INVOICES.put(invoice.id, JSON.stringify(invoice));
};

export const getInvoice = async (
  id: string,
  env: Env
): Promise<Invoice | null> => {
  const data = await env.KV_INVOICES.get(id);
  return data ? JSON.parse(data) : null;
};

export const savePayment = async (payment: Payment, env: Env) => {
  await env.KV_PAYMENTS.put(payment.id, JSON.stringify(payment));
};

export const getPayment = async (
  id: string,
  env: Env
): Promise<Payment | null> => {
  const data = await env.KV_PAYMENTS.get(id);
  return data ? JSON.parse(data) : null;
};
