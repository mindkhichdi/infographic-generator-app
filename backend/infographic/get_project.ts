import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { infographicDB } from "./db";
import type { Project } from "./create_project";

export interface GetProjectParams {
  id: number;
}

// Retrieves a specific infographic project by ID for the authenticated user.
export const getProject = api<GetProjectParams, Project>(
  { expose: true, method: "GET", path: "/projects/:id", auth: true },
  async (params) => {
    const auth = getAuthData()!;
    
    const project = await infographicDB.queryRow<Project>`
      SELECT id, title, content, template_id as "templateId", brand_id as "brandId", design_data as "designData", created_at as "createdAt", updated_at as "updatedAt"
      FROM projects
      WHERE id = ${params.id} AND user_id = ${auth.userID}
    `;
    
    if (!project) {
      throw APIError.notFound("project not found");
    }
    
    return project;
  }
);
