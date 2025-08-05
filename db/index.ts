import "dotenv/config";

//Connect Drizzle ORM to the database
import { drizzle } from "drizzle-orm/node-postgres";
export const db = drizzle(process.env.DATABASE_URL!);
