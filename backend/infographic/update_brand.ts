import { api, APIError } from "encore.dev/api";
import { infographicDB } from "./db";
import type { Brand } from "./create_brand";

export interface UpdateBrandParams {
  id: number;
}

export interface UpdateBrandRequest {
  name?: string;
  watermarkText?: string;
  watermarkLogoUrl?: string;
  colorPalette?: string[];
  headingFont?: string;
  bodyFont?: string;
}

// Updates an existing brand.
export const updateBrand = api<UpdateBrandParams & UpdateBrandRequest, Brand>(
  { expose: true, method: "PUT", path: "/brands/:id" },
  async (req) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (req.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(req.name);
    }
    if (req.watermarkText !== undefined) {
      updates.push(`watermark_text = $${paramIndex++}`);
      values.push(req.watermarkText || null);
    }
    if (req.watermarkLogoUrl !== undefined) {
      updates.push(`watermark_logo_url = $${paramIndex++}`);
      values.push(req.watermarkLogoUrl || null);
    }
    if (req.colorPalette !== undefined) {
      updates.push(`color_palette = $${paramIndex++}`);
      values.push(JSON.stringify(req.colorPalette));
    }
    if (req.headingFont !== undefined) {
      updates.push(`heading_font = $${paramIndex++}`);
      values.push(req.headingFont);
    }
    if (req.bodyFont !== undefined) {
      updates.push(`body_font = $${paramIndex++}`);
      values.push(req.bodyFont);
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("no fields to update");
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.id);

    const query = `
      UPDATE brands 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, watermark_text as "watermarkText", watermark_logo_url as "watermarkLogoUrl", color_palette as "colorPalette", heading_font as "headingFont", body_font as "bodyFont", created_at as "createdAt", updated_at as "updatedAt"
    `;

    const brand = await infographicDB.rawQueryRow<Brand>(query, ...values);
    
    if (!brand) {
      throw APIError.notFound("brand not found");
    }
    
    return brand;
  }
);
