import { EmailSubjects } from "../enums/enums";
import { sendEmail } from "../services/email.service";
import { Env } from "../types/types";

export const notifyCustomer = async (
  email: string,
  subject: string,
  message: string,
  env: Env
) => {
  try {
    await sendEmail(email, subject, message, env);
  } catch (error) {
    throw error;
  }
};

export const invoiceGeneratedNotification = async (
  customerEmail: string,
  invoiceId: string,
  env: Env
) => {
  try {
    const subject = `Your Invoice ${invoiceId} has been generated`;
    const message = `Dear customer, your invoice ${invoiceId} is generated. Please check your account for details.`;
    await notifyCustomer(customerEmail, subject, message, env);
  } catch (error) {
    throw error;
  }
};

export const paymentSuccessNotification = async (
  customerEmail: string,
  paymentId: string,
  env: Env
) => {
  try {
    const subject = EmailSubjects.PAYMENT_SUCCESS;
    const message = `Dear customer, your payment ${paymentId} was successful. Thank you!`;
    await notifyCustomer(customerEmail, subject, message, env);
  } catch (error) {
    throw error;
  }
};
export const paymentFailureNotification = async (
  customerEmail: string,
  paymentId: string,
  env: Env
) => {
  try {
    const subject = EmailSubjects.PAYMENT_FAILURE;
    const message = `Dear customer, your payment ${paymentId} has failed. Please try again.`;
    await notifyCustomer(customerEmail, subject, message, env);
  } catch (error) {
    throw error;
  }
};
