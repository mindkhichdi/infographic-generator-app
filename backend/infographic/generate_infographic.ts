import { api } from "encore.dev/api";

export interface GenerateInfographicRequest {
  content: string;
  templateId: string;
  brandId?: number;
  format: 'png' | 'jpg' | 'pdf' | 'svg';
  size: 'square' | 'vertical' | 'horizontal' | 'story' | 'custom';
  customWidth?: number;
  customHeight?: number;
  quality: 'low' | 'medium' | 'high';
}

export interface GenerateInfographicResponse {
  downloadUrl: string;
  previewUrl: string;
  format: string;
  size: string;
  generatedAt: Date;
}

// Generates an infographic with specified format and options.
export const generateInfographic = api<GenerateInfographicRequest, GenerateInfographicResponse>(
  { expose: true, method: "POST", path: "/generate" },
  async (req) => {
    // Mock generation for now - in a real app, this would integrate with image generation service
    const timestamp = Date.now();
    const filename = `infographic_${timestamp}.${req.format}`;
    
    // Simulate processing time based on quality
    const processingTime = req.quality === 'high' ? 3000 : req.quality === 'medium' ? 2000 : 1000;
    await new Promise(resolve => setTimeout(resolve, 100)); // Quick mock delay
    
    return {
      downloadUrl: `/downloads/${filename}`,
      previewUrl: `/previews/${filename}`,
      format: req.format,
      size: req.size,
      generatedAt: new Date(),
    };
  }
);
