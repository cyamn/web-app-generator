import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";

const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();
  const { name, email, password } = body;
  console.error(body);
}
