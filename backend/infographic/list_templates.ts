import { api } from "encore.dev/api";
import { infographicDB } from "./db";

export interface Template {
  id: string;
  name: string;
  category: string;
  previewUrl: string;
  config: Record<string, any>;
  createdAt: Date;
}

export interface ListTemplatesResponse {
  templates: Template[];
}

// Retrieves all available infographic templates.
export const listTemplates = api<void, ListTemplatesResponse>(
  { expose: true, method: "GET", path: "/templates" },
  async () => {
    const templates = await infographicDB.queryAll<Template>`
      SELECT id, name, category, preview_url as "previewUrl", config, created_at as "createdAt"
      FROM templates
      ORDER BY category, name
    `;
    
    return { templates };
  }
);
