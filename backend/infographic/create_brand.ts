import { api } from "encore.dev/api";
import { infographicDB } from "./db";

export interface CreateBrandRequest {
  name: string;
  watermarkText?: string;
  watermarkLogoUrl?: string;
  colorPalette: string[];
  headingFont: string;
  bodyFont: string;
}

export interface Brand {
  id: number;
  name: string;
  watermarkText?: string;
  watermarkLogoUrl?: string;
  colorPalette: string[];
  headingFont: string;
  bodyFont: string;
  createdAt: Date;
  updatedAt: Date;
}

// Creates a new brand.
export const createBrand = api<CreateBrandRequest, Brand>(
  { expose: true, method: "POST", path: "/brands" },
  async (req) => {
    const brand = await infographicDB.queryRow<Brand>`
      INSERT INTO brands (name, watermark_text, watermark_logo_url, color_palette, heading_font, body_font)
      VALUES (${req.name}, ${req.watermarkText || null}, ${req.watermarkLogoUrl || null}, ${JSON.stringify(req.colorPalette)}, ${req.headingFont}, ${req.bodyFont})
      RETURNING id, name, watermark_text as "watermarkText", watermark_logo_url as "watermarkLogoUrl", color_palette as "colorPalette", heading_font as "headingFont", body_font as "bodyFont", created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    if (!brand) {
      throw new Error("Failed to create brand");
    }
    
    return brand;
  }
);
