import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { infographicDB } from "./db";
import type { Project } from "./create_project";

export interface UpdateProjectParams {
  id: number;
}

export interface UpdateProjectRequest {
  title?: string;
  content?: string;
  templateId?: string;
  brandId?: number;
  designData?: Record<string, any>;
}

// Updates an existing infographic project for the authenticated user.
export const updateProject = api<UpdateProjectParams & UpdateProjectRequest, Project>(
  { expose: true, method: "PUT", path: "/projects/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (req.title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(req.title);
    }
    if (req.content !== undefined) {
      updates.push(`content = $${paramIndex++}`);
      values.push(req.content);
    }
    if (req.templateId !== undefined) {
      updates.push(`template_id = $${paramIndex++}`);
      values.push(req.templateId);
    }
    if (req.brandId !== undefined) {
      updates.push(`brand_id = $${paramIndex++}`);
      values.push(req.brandId);
    }
    if (req.designData !== undefined) {
      updates.push(`design_data = $${paramIndex++}`);
      values.push(JSON.stringify(req.designData));
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("no fields to update");
    }

    updates.push(`updated_at = NOW()`);
    values.push(auth.userID);
    values.push(req.id);

    const query = `
      UPDATE projects 
      SET ${updates.join(', ')}
      WHERE user_id = $${paramIndex++} AND id = $${paramIndex}
      RETURNING id, title, content, template_id as "templateId", brand_id as "brandId", design_data as "designData", created_at as "createdAt", updated_at as "updatedAt"
    `;

    const project = await infographicDB.rawQueryRow<Project>(query, ...values);
    
    if (!project) {
      throw APIError.notFound("project not found");
    }
    
    return project;
  }
);
