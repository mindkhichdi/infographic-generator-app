import { api, APIError } from "encore.dev/api";
import { infographicDB } from "./db";

export interface DeleteProjectParams {
  id: number;
}

// Deletes an infographic project.
export const deleteProject = api<DeleteProjectParams, void>(
  { expose: true, method: "DELETE", path: "/projects/:id" },
  async (params) => {
    const result = await infographicDB.exec`
      DELETE FROM projects WHERE id = ${params.id}
    `;
    
    // Note: PostgreSQL doesn't return affected rows count in this context
    // We'll assume the delete was successful if no error was thrown
  }
);
