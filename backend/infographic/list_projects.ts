import { api } from "encore.dev/api";
import { infographicDB } from "./db";
import type { Project } from "./create_project";

export interface ListProjectsResponse {
  projects: Project[];
}

// Retrieves all infographic projects, ordered by creation date (latest first).
export const listProjects = api<void, ListProjectsResponse>(
  { expose: true, method: "GET", path: "/projects" },
  async () => {
    const projects = await infographicDB.queryAll<Project>`
      SELECT id, title, content, template_id as "templateId", design_data as "designData", created_at as "createdAt", updated_at as "updatedAt"
      FROM projects
      ORDER BY created_at DESC
    `;
    
    return { projects };
  }
);
