"use client";

import { api } from "@/utils/api";

export const TrpcProvider = api.withTRPC(
  (properties: React.PropsWithChildren) => properties.children
) as React.ComponentType<React.PropsWithChildren>;
