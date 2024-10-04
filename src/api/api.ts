import { Router } from "itty-router";
import { processPayment } from "../handlers/payments";
import {
  getCustomer,
  saveCustomer,
  saveSubscriptionPlan,
} from "../storage/storage";
import { Env } from "../types/types";
import { Customer, SubscriptionPlan } from "../types/types";
import {
  assignSubscriptionToCustomer,
  cancelSubscription,
  getSubscriptionDetails,
  updateSubscription,
} from "../handlers/subscription";
import { handleError } from "../middleware/errorHandler";
import { HttpStatus } from "../enums/enums";
import { generateInvoice } from "../handlers/billing";

const router = Router();
// Create a new customer
router.post("/customers", async (request) => {
  try {
    const customer = (await request.json()) as Customer;
    await saveCustomer(customer, request.env as Env);
    return new Response("Customer created", { status: HttpStatus.CREATED });
  } catch (error) {
    return handleError(error);
  }
});

export const listAllCustomers = async (env: Env): Promise<Customer[]> => {
  const customerKeys = await env.KV_CUSTOMERS.list();
  const customers: Customer[] = [];
  for (const key of customerKeys.keys) {
    const customer = await getCustomer(key.name, env);
    if (customer) {
      customers.push(customer);
    }
  }
  return customers;
};
// Get all customers
router.get("/customers/all", async (request) => {
  try {
    const customers = await listAllCustomers(request.env as Env);
    return new Response(JSON.stringify(customers), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(`Error fetching customers: ${error.message}`, {
        status: 500,
      });
    } else {
      return new Response(
        "An unknown error occurred while fetching customers",
        { status: 500 }
      );
    }
  }
});

// Create a new subscription plan
router.post("/subscription-plans/create", async (request) => {
  console.log("Inside post subscription plan");
  try {
    const plan = (await request.json()) as SubscriptionPlan;
    await saveSubscriptionPlan(plan, request.env as Env);
    return new Response("Subscription plan created", {
      status: HttpStatus.CREATED,
    });
  } catch (error) {
    return handleError(error);
  }
});
// Get a customer's subscription details
router.get("/customers/:id/subscription", async (request) => {
  try {
    const { id } = request.params;
    const subscriptionDetails = await getSubscriptionDetails(
      id,
      request.env as Env
    );
    return new Response(JSON.stringify(subscriptionDetails), { status: 200 });
  } catch (error) {
    return handleError(error);
  }
});
// Subscribe a customer to a plan
router.post("/customers/:id/subscribe-plan", async (request) => {
  try {
    const { id } = request.params;
    const { planId } = (await request.json()) as { planId: string };
    const customer = await assignSubscriptionToCustomer(
      id,
      planId,
      request.env as Env
    );
    return new Response(JSON.stringify(customer), { status: HttpStatus.OK });
  } catch (error) {
    return handleError(error);
  }
});
// Cancel a customer's subscription
router.post("/customers/:id/cancel-subscription", async (request) => {
  try {
    const { id } = request.params;
    const customer = await cancelSubscription(id, request.env as Env);
    return new Response(JSON.stringify(customer), { status: HttpStatus.OK });
  } catch (error) {
    return handleError(error);
  }
});
// Update a customer's subscription
router.post("/customers/:id/update-subscription", async (request) => {
  try {
    const { id } = request.params;
    const { newPlanId } = (await request.json()) as { newPlanId: string };
    const customer = await updateSubscription(
      id,
      newPlanId,
      request.env as Env
    );
    return new Response(JSON.stringify(customer), { status: HttpStatus.OK });
  } catch (error) {
    return handleError(error);
  }
});
// Generate an invoice
router.post("/generate-invoice", async (request) => {
  try {
    const { customerId, planId } = (await request.json()) as {
      customerId: string;
      planId: string;
    };
    const invoice = await generateInvoice(
      customerId,
      planId,
      request.env as Env
    );
    return new Response(JSON.stringify(invoice), {
      status: HttpStatus.CREATED,
    });
  } catch (error) {
    return handleError(error);
  }
});
// Process payment
router.post("/process-payment", async (request) => {
  try {
    const { invoiceId, amount, method, customerId } =
      (await request.json()) as {
        invoiceId: string;
        amount: number;
        method: "credit_card" | "paypal";
        customerId: string;
      };
    const payment = await processPayment(
      invoiceId,
      amount,
      method as "credit_card" | "paypal",
      request.env as Env,
      customerId
    );
    return new Response(JSON.stringify(payment), {
      status: HttpStatus.CREATED,
    });
  } catch (error) {
    return handleError(error);
  }
});

// Default route handler for undefined routes
router.all(
  "*",
  () => new Response("Not found", { status: HttpStatus.NOT_FOUND })
);

export const handleRequest = (request: Request) => {
  try {
    return router.handle(request);
  } catch (error) {
    console.log("Error inside handleRequest function");
    return handleError(error);
  }
};
