import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { infographicDB } from "./db";

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
  infographicData: {
    title: string;
    sections: Array<{
      type: 'header' | 'stats' | 'chart' | 'content' | 'footer';
      content: any;
    }>;
    colors: string[];
    fonts: {
      heading: string;
      body: string;
    };
  };
}

// Generates an infographic with specified format and options.
export const generateInfographic = api<GenerateInfographicRequest, GenerateInfographicResponse>(
  { expose: true, method: "POST", path: "/generate", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    // Get template configuration
    const template = await infographicDB.queryRow<{
      id: string;
      name: string;
      config: any;
    }>`
      SELECT id, name, config FROM templates WHERE id = ${req.templateId}
    `;

    if (!template) {
      throw new Error("Template not found");
    }

    // Get brand configuration if specified
    let brand = null;
    if (req.brandId) {
      brand = await infographicDB.queryRow<{
        colorPalette: string[];
        headingFont: string;
        bodyFont: string;
        watermarkText?: string;
      }>`
        SELECT color_palette as "colorPalette", heading_font as "headingFont", body_font as "bodyFont", watermark_text as "watermarkText"
        FROM brands 
        WHERE id = ${req.brandId} AND user_id = ${auth.userID}
      `;
    }

    // Parse and analyze content
    const parsedContent = parseContent(req.content);
    const infographicData = generateInfographicStructure(parsedContent, template, brand);
    
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
      infographicData,
    };
  }
);

function parseContent(content: string) {
  // Extract key information from content
  const lines = content.split('\n').filter(line => line.trim());
  const title = lines[0] || 'Untitled';
  
  // Extract numbers and statistics
  const numbers = content.match(/\d+(?:\.\d+)?%?/g) || [];
  const statistics = numbers.slice(0, 4).map((num, index) => ({
    value: num,
    label: `Metric ${index + 1}`,
  }));

  // Extract key points
  const keyPoints = lines
    .filter(line => line.includes('•') || line.includes('-') || line.includes('*'))
    .slice(0, 5)
    .map(point => point.replace(/^[•\-*]\s*/, ''));

  // Detect content themes
  const themes = detectThemes(content);

  return {
    title,
    content: content,
    statistics,
    keyPoints,
    themes,
    wordCount: content.split(' ').length,
  };
}

function detectThemes(content: string): string[] {
  const themes = [];
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('growth') || lowerContent.includes('increase') || lowerContent.includes('revenue')) {
    themes.push('growth');
  }
  if (lowerContent.includes('data') || lowerContent.includes('analytics') || lowerContent.includes('metrics')) {
    themes.push('data');
  }
  if (lowerContent.includes('process') || lowerContent.includes('step') || lowerContent.includes('workflow')) {
    themes.push('process');
  }
  if (lowerContent.includes('comparison') || lowerContent.includes('vs') || lowerContent.includes('versus')) {
    themes.push('comparison');
  }
  
  return themes;
}

function generateInfographicStructure(parsedContent: any, template: any, brand: any) {
  const templateConfig = template.config;
  const colors = brand?.colorPalette || templateConfig.colors || ['#3B82F6', '#10B981', '#F59E0B'];
  
  const sections = [];

  // Header section
  sections.push({
    type: 'header',
    content: {
      title: parsedContent.title,
      subtitle: `${parsedContent.wordCount} words analyzed`,
    },
  });

  // Statistics section (if we have numbers)
  if (parsedContent.statistics.length > 0) {
    sections.push({
      type: 'stats',
      content: {
        stats: parsedContent.statistics,
        layout: parsedContent.statistics.length <= 2 ? 'horizontal' : 'grid',
      },
    });
  }

  // Chart section (based on themes)
  if (parsedContent.themes.includes('growth')) {
    sections.push({
      type: 'chart',
      content: {
        type: 'line',
        title: 'Growth Trend',
        data: generateMockChartData('growth'),
      },
    });
  } else if (parsedContent.themes.includes('comparison')) {
    sections.push({
      type: 'chart',
      content: {
        type: 'bar',
        title: 'Comparison',
        data: generateMockChartData('comparison'),
      },
    });
  }

  // Content section (key points)
  if (parsedContent.keyPoints.length > 0) {
    sections.push({
      type: 'content',
      content: {
        points: parsedContent.keyPoints,
        layout: 'list',
      },
    });
  }

  // Footer section
  sections.push({
    type: 'footer',
    content: {
      watermark: brand?.watermarkText || 'AIgraphy',
      timestamp: new Date().toLocaleDateString(),
    },
  });

  return {
    title: parsedContent.title,
    sections,
    colors,
    fonts: {
      heading: brand?.headingFont || 'Inter',
      body: brand?.bodyFont || 'Inter',
    },
  };
}

function generateMockChartData(type: string) {
  if (type === 'growth') {
    return [
      { label: 'Q1', value: 25 },
      { label: 'Q2', value: 45 },
      { label: 'Q3', value: 65 },
      { label: 'Q4', value: 85 },
    ];
  } else if (type === 'comparison') {
    return [
      { label: 'Option A', value: 75 },
      { label: 'Option B', value: 45 },
      { label: 'Option C', value: 60 },
    ];
  }
  return [];
}
