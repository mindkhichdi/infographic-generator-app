import { api, APIError } from "encore.dev/api";
import { infographicDB } from "./db";
import type { Project } from "./create_project";

export interface GetProjectParams {
  id: number;
}

// Retrieves a specific infographic project by ID.
export const getProject = api<GetProjectParams, Project>(
  { expose: true, method: "GET", path: "/projects/:id" },
  async (params) => {
    const project = await infographicDB.queryRow<Project>`
      SELECT id, title, content, template_id as "templateId", design_data as "designData", created_at as "createdAt", updated_at as "updatedAt"
      FROM projects
      WHERE id = ${params.id}
    `;
    
    if (!project) {
      throw APIError.notFound("project not found");
    }
    
    return project;
  }
);
