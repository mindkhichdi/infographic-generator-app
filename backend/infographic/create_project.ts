import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { infographicDB } from "./db";

export interface CreateProjectRequest {
  title: string;
  content: string;
  templateId: string;
  brandId?: number;
}

export interface Project {
  id: number;
  title: string;
  content: string;
  templateId: string;
  brandId?: number;
  designData: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Creates a new infographic project.
export const createProject = api<CreateProjectRequest, Project>(
  { expose: true, method: "POST", path: "/projects", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    const project = await infographicDB.queryRow<Project>`
      INSERT INTO projects (title, content, template_id, brand_id, design_data, user_id)
      VALUES (${req.title}, ${req.content}, ${req.templateId}, ${req.brandId || null}, '{}', ${auth.userID})
      RETURNING id, title, content, template_id as "templateId", brand_id as "brandId", design_data as "designData", created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    if (!project) {
      throw new Error("Failed to create project");
    }
    
    return project;
  }
);
