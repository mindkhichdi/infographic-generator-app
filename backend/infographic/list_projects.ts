import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { infographicDB } from "./db";
import type { Project } from "./create_project";

export interface ListProjectsResponse {
  projects: Project[];
}

// Retrieves all infographic projects for the authenticated user, ordered by creation date (latest first).
export const listProjects = api<void, ListProjectsResponse>(
  { expose: true, method: "GET", path: "/projects", auth: true },
  async () => {
    const auth = getAuthData()!;
    
    const projects = await infographicDB.queryAll<Project>`
      SELECT id, title, content, template_id as "templateId", brand_id as "brandId", design_data as "designData", created_at as "createdAt", updated_at as "updatedAt"
      FROM projects
      WHERE user_id = ${auth.userID}
      ORDER BY created_at DESC
    `;
    
    return { projects };
  }
);
