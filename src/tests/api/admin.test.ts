import { describe, expect, it } from "vitest";
import prisma from "../helpers/prisma";
import { getCaller } from "@/utils/get-serverside";
import { appRouter } from "@/server/api/root";

// create trpc caller
const caller = appRouter.createCaller({ session: null, prisma: prisma });

describe("administration endpoints", async () => {
  it("should get correct status", async () => {
    const result = await caller.admin.status({});
    expect(result.status).toBe("ok");
  });
  it("should ping back the message", async () => {
    const result = await caller.admin.ping({ message: "hello" });
    expect(result.message).toBe("hello");
  });
});
