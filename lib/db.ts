import { PrismaClient } from "@/lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: false },
    // Keep connections alive and recover quickly from transient DB blips
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  });

  // Log and swallow idle-client errors so they don't crash the process
  pool.on("error", (err) => {
    console.error("[pg pool] unexpected error on idle client:", err.message);
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// Prevent multiple PrismaClient instances across Next.js hot reloads in development.
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = createPrismaClient();
}

export const db = globalForPrisma.prisma;
