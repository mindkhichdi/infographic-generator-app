import { api } from "encore.dev/api";
import { infographicDB } from "./db";
import type { Brand } from "./create_brand";

export interface ListBrandsResponse {
  brands: Brand[];
}

// Retrieves all brands, ordered by creation date (latest first).
export const listBrands = api<void, ListBrandsResponse>(
  { expose: true, method: "GET", path: "/brands" },
  async () => {
    const brands = await infographicDB.queryAll<Brand>`
      SELECT id, name, watermark_text as "watermarkText", watermark_logo_url as "watermarkLogoUrl", color_palette as "colorPalette", heading_font as "headingFont", body_font as "bodyFont", created_at as "createdAt", updated_at as "updatedAt"
      FROM brands
      ORDER BY created_at DESC
    `;
    
    return { brands };
  }
);
