export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  PENDING = "pending",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  UNAUTHORIZED = 401,
  CREATED = 201,
}

export enum EmailSubjects {
  SUBSCRIPTION_PAYMENT = "Subscription Payment",
  INVOICE = "Invoice",
  PAYMENT_FAILURE = "Payment Failure",
  PAYMENT_SUCCESS = "Payment Success",
}
