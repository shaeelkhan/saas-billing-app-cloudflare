import { ScheduledEvent } from "@cloudflare/workers-types/experimental";
import { handleRequest } from "./api/api";
import { generateInvoicesForAllCustomers } from "./handlers/billing";
import { handleError } from "./middleware/errorHandler";
import { Env } from "./types/types";

export default {
  // Handle HTTP requests
  async fetch(request: Request, env: Env) {
    try {
      return await handleRequest(request);
    } catch (error) {
      return handleError(error);
    }
  },

  // Handle scheduled events (cron job for generating invoices)
  async scheduled(event: ScheduledEvent, env: Env) {
    try {
      console.log(
        `Scheduled event triggered at: ${new Date(
          event.scheduledTime
        ).toISOString()}`
      );
      await generateInvoicesForAllCustomers(env); // Generate invoices for all customers on schedule
    } catch (error) {
      console.error("Error generating invoices:", error);
    }
  },
};
