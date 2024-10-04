import supertest from "supertest";
import { describe, it, expect } from "@jest/globals";

jest.mock("../src/storage/storage", () => ({
  getCustomer: jest.fn(),
  saveCustomer: jest.fn(),
  saveSubscriptionPlan: jest.fn(),
  getSubscriptionPlan: jest.fn(),
}));

jest.mock("../src/handlers/payments", () => ({
  processPayment: jest.fn(),
}));

jest.mock("../src/handlers/billing", () => ({
  generateInvoice: jest.fn(),
}));

jest.mock("../src/handlers/subscription", () => ({
  assignSubscriptionToCustomer: jest.fn(),
  cancelSubscription: jest.fn(),
  updateSubscription: jest.fn(),
  getSubscriptionDetails: jest.fn(),
}));

import {
  getCustomer,
  saveCustomer,
  saveSubscriptionPlan,
} from "../storage/storage";
import { processPayment } from "../handlers/payments";
import { generateInvoice } from "../handlers/billing";
import {
  assignSubscriptionToCustomer,
  cancelSubscription,
  updateSubscription,
  getSubscriptionDetails,
} from "../handlers/subscription";
import { handleRequest } from "../api/api";

describe("API Routes", () => {
  const request = supertest(handleRequest as any); // Using the handleRequest function directly

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // Test for creating a new customer
  it("POST /customers should create a new customer", async () => {
    const customer = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      subscription_plan_id: "",
      subscription_status: "active",
      subscription_start_date: "",
      subscription_end_date: "",
      billing_cycle: "monthly",
      payment_method: null,
      payment_status: null,
      payment_date: "",
    };

    (saveCustomer as jest.Mock).mockResolvedValue(customer);

    const response = await request.post("/customers").send(customer);
    expect(response.status).toBe(201);
    expect(response.text).toBe("Customer created");
  });

  it("POST /customers should return error when saving fails", async () => {
    (saveCustomer as jest.Mock).mockRejectedValue(new Error("Failed to save"));

    const response = await request.post("/customers").send({
      id: "123",
      name: "John Doe",
    });
    expect(response.status).toBe(500);
    expect(response.text).toContain("Error fetching customers: Failed to save");
  });

  // Test for getting all customers
  it("GET /customers/all should return all customers", async () => {
    const customers = [
      {
        id: "123",
        name: "John Doe",
        email: "john@example.com",
        subscription_plan_id: "",
        subscription_status: "active",
        subscription_start_date: "",
        subscription_end_date: "",
        billing_cycle: "monthly",
        payment_method: null,
        payment_status: null,
        payment_date: "",
      },
    ];

    (getCustomer as jest.Mock).mockResolvedValue(customers);

    const response = await request.get("/customers/all");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(customers);
  });

  // Test for creating a new subscription plan
  it("POST /subscription-plans/create should create a new subscription plan", async () => {
    const plan = {
      id: "456",
      name: "Basic Plan",
      billing_cycle: "monthly",
      price: "10.00",
      duration: new Date(),
      status: "active",
    };

    (saveSubscriptionPlan as jest.Mock).mockResolvedValue(plan);

    const response = await request
      .post("/subscription-plans/create")
      .send(plan);
    expect(response.status).toBe(201);
    expect(response.text).toBe("Subscription plan created");
  });

  // Test for getting a customer's subscription details
  it("GET /customers/:id/subscription should return subscription details", async () => {
    const subscriptionDetails = {
      planId: "456",
      status: "active",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    };

    (getSubscriptionDetails as jest.Mock).mockResolvedValue(
      subscriptionDetails
    );

    const response = await request.get("/customers/123/subscription");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(subscriptionDetails);
  });

  // Test for subscribing a customer to a plan
  it("POST /customers/:id/subscribe-plan should subscribe a customer to a plan", async () => {
    const customer = {
      id: "123",
      name: "John Doe",
      subscription_plan_id: "456",
      subscription_status: "active",
      subscription_start_date: "",
      subscription_end_date: "",
      billing_cycle: "monthly",
      payment_method: null,
      payment_status: null,
      payment_date: "",
    };
    const planId = "456";

    (assignSubscriptionToCustomer as jest.Mock).mockResolvedValue(customer);

    const response = await request
      .post("/customers/123/subscribe-plan")
      .send({ planId });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(customer);
  });

  // Test for canceling a customer's subscription
  it("POST /customers/:id/cancel-subscription should cancel a customer's subscription", async () => {
    const customer = {
      id: "123",
      name: "John Doe",
      subscription_plan_id: "456",
      subscription_status: "active",
      subscription_start_date: "",
      subscription_end_date: "",
      billing_cycle: "monthly",
      payment_method: null,
      payment_status: null,
      payment_date: "",
    };

    (cancelSubscription as jest.Mock).mockResolvedValue(customer);

    const response = await request.post("/customers/123/cancel-subscription");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(customer);
  });

  // Test for updating a customer's subscription
  it("POST /customers/:id/update-subscription should update a customer's subscription", async () => {
    const customer = {
      id: "123",
      name: "John Doe",
      subscription_plan_id: "456",
      subscription_status: "active",
      subscription_start_date: "",
      subscription_end_date: "",
      billing_cycle: "monthly",
      payment_method: null,
      payment_status: null,
      payment_date: "",
    };
    const newPlanId = "789";

    (updateSubscription as jest.Mock).mockResolvedValue(customer);

    const response = await request
      .post("/customers/123/update-subscription")
      .send({ newPlanId });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(customer);
  });

  // Test for generating an invoice
  it("POST /generate-invoice should generate an invoice", async () => {
    const invoice = {
      id: "inv_001",
      customer_id: "123",
      amount: "10.00",
      due_date: "2024-12-31",
      payment_status: "pending",
    };

    (generateInvoice as jest.Mock).mockResolvedValue(invoice);

    const response = await request
      .post("/generate-invoice")
      .send({ customerId: "123", planId: "456" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(invoice);
  });

  // Test for processing a payment
  it("POST /process-payment should process a payment", async () => {
    const payment = {
      id: "pay_001",
      invoice_id: "inv_001",
      amount: 10.0,
      payment_method: "credit_card",
      payment_date: "2024-10-01",
    };

    (processPayment as jest.Mock).mockResolvedValue(payment);

    const response = await request.post("/process-payment").send({
      invoiceId: "inv_001",
      amount: 10.0,
      method: "credit_card",
      customerId: "123",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(payment);
  });

  // Test for undefined routes
  it("should return 404 for undefined routes", async () => {
    const response = await request.get("/undefined-route");
    expect(response.status).toBe(404);
    expect(response.text).toBe("Not found");
  });
});
