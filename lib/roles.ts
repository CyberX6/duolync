import { Role } from "@/lib/generated/prisma";

/** Public API / Better Auth client convention (lowercase). */
export type UserType = "brand" | "creator";

/** Normalize signup/session strings into the Prisma `Role` enum. */
export function toPrismaRole(role: unknown): Role {
  if (role === Role.BRAND || role === "BRAND" || role === "brand") {
    return Role.BRAND;
  }
  return Role.CREATOR;
}

/** Map Prisma `Role` (or legacy strings) to the public user type. */
export function fromPrismaRole(role: Role | string | null | undefined): UserType {
  if (role === Role.BRAND || role === "BRAND" || role === "brand") {
    return "brand";
  }
  return "creator";
}
