import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { notesTable } from "./schema/notes-schema";
import { profilesTable } from "./schema/profiles-schema";


config({ path: ".env.local" });

const schema = {
  profiles: profilesTable,
  notes: notesTable
};

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });