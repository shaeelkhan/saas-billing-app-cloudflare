import { HttpStatus } from "../enums/enums";

export function handleError(error: unknown): Response {
  if (error instanceof Error) {
    return new Response(`Error: ${error.message}`, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  } else {
    return new Response("An unknown error occurred, please try again.", {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
