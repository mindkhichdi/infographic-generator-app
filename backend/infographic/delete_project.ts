import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { infographicDB } from "./db";

export interface DeleteProjectParams {
  id: number;
}

// Deletes an infographic project for the authenticated user.
export const deleteProject = api<DeleteProjectParams, void>(
  { expose: true, method: "DELETE", path: "/projects/:id", auth: true },
  async (params) => {
    const auth = getAuthData()!;
    
    await infographicDB.exec`
      DELETE FROM projects WHERE id = ${params.id} AND user_id = ${auth.userID}
    `;
  }
);
