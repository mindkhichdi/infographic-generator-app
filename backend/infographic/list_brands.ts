import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { infographicDB } from "./db";
import type { Brand } from "./create_brand";

export interface ListBrandsResponse {
  brands: Brand[];
}

// Retrieves all brands for the authenticated user, ordered by creation date (latest first).
export const listBrands = api<void, ListBrandsResponse>(
  { expose: true, method: "GET", path: "/brands", auth: true },
  async () => {
    const auth = getAuthData()!;
    
    const brands = await infographicDB.queryAll<Brand>`
      SELECT id, name, watermark_text as "watermarkText", watermark_logo_url as "watermarkLogoUrl", color_palette as "colorPalette", heading_font as "headingFont", body_font as "bodyFont", created_at as "createdAt", updated_at as "updatedAt"
      FROM brands
      WHERE user_id = ${auth.userID}
      ORDER BY created_at DESC
    `;
    
    return { brands };
  }
);
