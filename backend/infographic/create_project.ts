import { api } from "encore.dev/api";
import { infographicDB } from "./db";

export interface CreateProjectRequest {
  title: string;
  content: string;
  templateId: string;
}

export interface Project {
  id: number;
  title: string;
  content: string;
  templateId: string;
  designData: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Creates a new infographic project.
export const createProject = api<CreateProjectRequest, Project>(
  { expose: true, method: "POST", path: "/projects" },
  async (req) => {
    const project = await infographicDB.queryRow<Project>`
      INSERT INTO projects (title, content, template_id, design_data)
      VALUES (${req.title}, ${req.content}, ${req.templateId}, '{}')
      RETURNING id, title, content, template_id as "templateId", design_data as "designData", created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    if (!project) {
      throw new Error("Failed to create project");
    }
    
    return project;
  }
);
