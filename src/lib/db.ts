import { Pool } from "pg";

import { loadConfig } from "../config/env";

const config = loadConfig();

export const pool = new Pool({
  connectionString: config.DATABASE_URL
});