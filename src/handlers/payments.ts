import { Payment } from "../types/types";
import {
  getCustomer,
  getInvoice,
  saveInvoice,
  savePayment,
} from "../storage/storage";
import { Env } from "../types/types";
import {
  paymentFailureNotification,
  paymentSuccessNotification,
} from "./notifications";
import { v4 as uuidv4 } from "uuid";
import { PaymentStatus } from "../enums/enums";

export const processPayment = async (
  invoiceId: string,
  amount: number,
  method: "credit_card" | "paypal",
  env: Env,
  customerId: string
): Promise<Payment> => {
  const customer = await getCustomer(customerId, env);
  const invoice = await getInvoice(invoiceId, env);
  const payment: Payment = {
    id: uuidv4(),
    invoice_id: invoiceId,
    amount,
    payment_method: method,
    payment_date: new Date().toISOString(),
  };
  try {
    if (!invoice || invoice.payment_status !== PaymentStatus.PENDING) {
      throw new Error("Invalid invoice or payment already processed");
    }
    await savePayment(payment, env);
    invoice.payment_status = "paid";
    invoice.payment_date = payment.payment_date;
    await saveInvoice(invoice, env);
    await paymentSuccessNotification(customer.email, payment.id, env);
    return payment;
  } catch (error) {
    await paymentFailureNotification(customer.email, payment.id, env);
    throw error;
  }
};
