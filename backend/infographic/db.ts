import { SQLDatabase } from "encore.dev/storage/sqldb";

export const infographicDB = new SQLDatabase("infographic", {
  migrations: "./migrations",
});
