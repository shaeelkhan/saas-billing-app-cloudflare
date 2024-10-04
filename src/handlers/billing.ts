import { listAllCustomers } from "../api/api";
import { PaymentStatus } from "../enums/enums";
import { getSubscriptionPlan, saveInvoice } from "../storage/storage";
import { Customer, Invoice } from "../types/types";
import { Env } from "../types/types";
import { invoiceGeneratedNotification } from "./notifications";
import { v4 as uuidv4 } from "uuid";

export const generateInvoice = async (
  customerId: string,
  planId: string,
  env: Env
): Promise<Invoice> => {
  try {
    const plan = await getSubscriptionPlan(planId, env);
    if (!plan) {
      throw new Error("Subscription plan not found");
    }
    const invoice: Invoice = {
      id: uuidv4(),
      customer_id: customerId,
      amount: plan.price,
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), //  Default - due in 30 days
      payment_status: PaymentStatus.PENDING,
    };
    await saveInvoice(invoice, env);
    return invoice;
  } catch (error) {
    throw error;
  }
};

export const generateInvoicesForBillingCycles = async (
  env: Env
): Promise<void> => {
  try {
    const customers: Customer[] = await listAllCustomers(env);
    const now = new Date();
    for (const customer of customers) {
      const billingCycleEnd = calculateBillingCycleEnd(
        customer.subscription_start_date,
        customer.billing_cycle
      );
      if (now >= billingCycleEnd) {
        const plan = await getSubscriptionPlan(
          customer.subscription_plan_id,
          env
        );

        if (plan) {
          const invoice: Invoice = {
            id: uuidv4(),
            customer_id: customer.id,
            amount: plan.price,
            due_date: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(), // due in 30 days
            payment_status: PaymentStatus.PENDING,
          };
          await saveInvoice(invoice, env);
          await invoiceGeneratedNotification(customer.email, invoice.id, env);
        }
      }
    }
  } catch (error) {
    throw error;
  }
};

function calculateBillingCycleEnd(
  startDate: string,
  billingCycle: "monthly" | "yearly"
): Date {
  const start = new Date(startDate);
  const end = new Date(start);
  if (billingCycle === "monthly") {
    end.setMonth(end.getMonth() + 1);
  } else if (billingCycle === "yearly") {
    end.setFullYear(end.getFullYear() + 1);
  }
  return end;
}

export const generateInvoicesForAllCustomers = async (
  env: Env
): Promise<void> => {
  try {
    const customers = await listAllCustomers(env);
    for (const customer of customers) {
      const subscriptionPlanId = customer.subscription_plan_id;
      if (subscriptionPlanId) {
        try {
          await generateInvoice(customer.id, subscriptionPlanId, env);
          console.log(`Invoice generated for customer ${customer.id}`);
        } catch (error) {
          console.error(
            `Error generating invoice for customer ${customer.id}:`,
            error
          );
        }
      } else {
        console.warn(`Customer ${customer.id} has no active subscription.`);
      }
    }
  } catch (error) {
    throw error;
  }
};
