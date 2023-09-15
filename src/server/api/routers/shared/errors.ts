import { TRPCError } from "@trpc/server";

export class NotFoundError extends TRPCError {
  public constructor(message: string) {
    super({
      code: "NOT_FOUND",
      message: `Not found: ${message}`,
    });
  }
}

export class InternalError extends TRPCError {
  public constructor(message: string) {
    super({
      code: "INTERNAL_SERVER_ERROR",
      message,
    });
  }
}
