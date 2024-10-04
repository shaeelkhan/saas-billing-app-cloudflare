import { SubscriptionStatus } from "../enums/enums";
import {
  getCustomer,
  saveCustomer,
  getSubscriptionPlan,
} from "../storage/storage";
import { Customer, Env } from "../types/types";

// assign a subscription plan to a customer
export const assignSubscriptionToCustomer = async (
  customerId: string,
  planId: string,
  env: Env
): Promise<Customer> => {
  try {
    const customer = await getCustomer(customerId, env);
    const plan = await getSubscriptionPlan(planId, env);
    if (!customer) {
      throw new Error("Customer not found");
    }
    if (!plan || plan.status === "inactive") {
      throw new Error("Subscription plan not found or inactive");
    }
    customer.subscription_plan_id = planId;
    customer.subscription_status = SubscriptionStatus.ACTIVE;
    customer.subscription_start_date = new Date().toISOString();
    await saveCustomer(customer, env);
    return customer;
  } catch (error) {
    throw error;
  }
};

// cancel a customer's subscription
export const cancelSubscription = async (
  customerId: string,
  env: Env
): Promise<Customer> => {
  try {
    const customer = await getCustomer(customerId, env);
    if (!customer) {
      throw new Error("Customer not found");
    }
    customer.subscription_status = SubscriptionStatus.CANCELLED;
    customer.subscription_plan_id = "";
    customer.subscription_start_date = "";
    customer.subscription_end_date = "";

    await saveCustomer(customer, env);
    return customer;
  } catch (error) {
    throw error;
  }
};

export const updateSubscription = async (
  customerId: string,
  newPlanId: string,
  env: Env
): Promise<Customer> => {
  try {
    const customer = await getCustomer(customerId, env);
    const newPlan = await getSubscriptionPlan(newPlanId, env);
    if (!customer) {
      throw new Error("Customer not found");
    }
    if (!newPlan || newPlan.status === "inactive") {
      throw new Error("New subscription plan not found or inactive");
    }
    // Update the customer's subscription details
    customer.subscription_plan_id = newPlanId;
    await saveCustomer(customer, env);
    return customer;
  } catch (error) {
    throw error;
  }
};
export const getSubscriptionDetails = async (customerId: string, env: Env) => {
  try {
    const customer = await getCustomer(customerId, env);
    if (!customer) {
      throw new Error("Customer not found");
    }

    if (!customer.subscription_plan_id) {
      return {
        message: "No active subscription plan found for this customer.",
      };
    }

    const subscriptionPlan = await getSubscriptionPlan(
      customer.subscription_plan_id,
      env
    );
    if (!subscriptionPlan) {
      throw new Error("Subscription plan not found");
    }

    // Return customer and subscription plan details
    return {
      customerId: customer.id,
      customerName: customer.name,
      subscriptionPlanId: subscriptionPlan.id,
      subscriptionPlanName: subscriptionPlan.name,
      subscriptionStatus: customer.subscription_status,
      subscriptionStartDate: customer.subscription_start_date,
      subscriptionEndDate: customer.subscription_end_date,
      subscriptionPlanPrice: subscriptionPlan.price,
    };
  } catch (error) {
    throw error;
  }
};
