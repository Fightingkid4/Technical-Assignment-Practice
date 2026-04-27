import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  //DATABASE_URL: z.string().min(1)
});

export type AppConfig = z.infer<typeof envSchema>;

export const loadConfig = (input: NodeJS.ProcessEnv = process.env): AppConfig =>
  envSchema.parse(input);