import { api, APIError } from "encore.dev/api";
import { infographicDB } from "./db";
import type { Project } from "./create_project";

export interface UpdateProjectParams {
  id: number;
}

export interface UpdateProjectRequest {
  title?: string;
  content?: string;
  templateId?: string;
  designData?: Record<string, any>;
}

// Updates an existing infographic project.
export const updateProject = api<UpdateProjectParams & UpdateProjectRequest, Project>(
  { expose: true, method: "PUT", path: "/projects/:id" },
  async (req) => {
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
    if (req.designData !== undefined) {
      updates.push(`design_data = $${paramIndex++}`);
      values.push(JSON.stringify(req.designData));
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("no fields to update");
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.id);

    const query = `
      UPDATE projects 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, title, content, template_id as "templateId", design_data as "designData", created_at as "createdAt", updated_at as "updatedAt"
    `;

    const project = await infographicDB.rawQueryRow<Project>(query, ...values);
    
    if (!project) {
      throw APIError.notFound("project not found");
    }
    
    return project;
  }
);
