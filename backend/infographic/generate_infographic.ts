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
      type: 'header' | 'stats' | 'chart' | 'content' | 'footer' | 'bullets' | 'steps' | 'comparison' | 'features' | 'tips';
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
  const title = extractTitle(lines);
  
  // Extract numbers and statistics
  const numbers = content.match(/\d+(?:\.\d+)?%?/g) || [];
  const statistics = numbers.slice(0, 6).map((num, index) => ({
    value: num,
    label: generateStatLabel(num, index),
  }));

  // Extract bullet points
  const bulletPoints = extractBulletPoints(content);
  
  // Extract numbered steps
  const steps = extractSteps(content);

  // Extract key points (non-bullet)
  const keyPoints = lines
    .filter(line => !line.match(/^[•\-*\d+\.]/))
    .filter(line => line.length > 10 && line.length < 100)
    .slice(0, 5);

  // Detect content themes
  const themes = detectThemes(content);

  // Extract comparisons
  const comparisons = extractComparisons(content);

  return {
    title,
    content: content,
    statistics,
    bulletPoints,
    steps,
    keyPoints,
    themes,
    comparisons,
    wordCount: content.split(' ').length,
  };
}

function extractTitle(lines: string[]): string {
  // Look for markdown headers first
  const headerLine = lines.find(line => line.startsWith('#'));
  if (headerLine) {
    return headerLine.replace(/^#+\s*/, '');
  }
  
  // Look for lines that might be titles (short, at the beginning)
  const potentialTitle = lines.find(line => 
    line.length > 5 && 
    line.length < 80 && 
    !line.includes('.') && 
    !line.match(/^[•\-*\d+\.]/)
  );
  
  return potentialTitle || 'Untitled Infographic';
}

function extractBulletPoints(content: string): string[] {
  const lines = content.split('\n');
  const bulletPoints = lines
    .filter(line => line.match(/^[\s]*[•\-*]\s+/))
    .map(line => line.replace(/^[\s]*[•\-*]\s+/, '').trim())
    .filter(point => point.length > 0);
  
  return bulletPoints.slice(0, 8); // Limit to 8 bullet points
}

function extractSteps(content: string): string[] {
  const lines = content.split('\n');
  const steps = lines
    .filter(line => line.match(/^\s*\d+[\.\)]\s+/))
    .map(line => line.replace(/^\s*\d+[\.\)]\s+/, '').trim())
    .filter(step => step.length > 0);
  
  return steps.slice(0, 6); // Limit to 6 steps
}

function extractComparisons(content: string): Array<{before: string, after: string}> {
  const comparisons = [];
  const lowerContent = content.toLowerCase();
  
  // Look for before/after patterns
  if (lowerContent.includes('before') && lowerContent.includes('after')) {
    comparisons.push({
      before: 'Previous State',
      after: 'Improved State'
    });
  }
  
  // Look for vs patterns
  if (lowerContent.includes(' vs ') || lowerContent.includes(' versus ')) {
    comparisons.push({
      before: 'Option A',
      after: 'Option B'
    });
  }
  
  return comparisons;
}

function generateStatLabel(num: string, index: number): string {
  if (num.includes('%')) {
    const labels = ['Growth Rate', 'Success Rate', 'Improvement', 'Efficiency', 'Satisfaction', 'Performance'];
    return labels[index % labels.length];
  }
  
  const labels = ['Users', 'Revenue', 'Projects', 'Customers', 'Sales', 'Conversions'];
  return labels[index % labels.length];
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
  if (lowerContent.includes('feature') || lowerContent.includes('benefit') || lowerContent.includes('advantage')) {
    themes.push('features');
  }
  if (lowerContent.includes('tip') || lowerContent.includes('advice') || lowerContent.includes('recommendation')) {
    themes.push('tips');
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
      subtitle: `${parsedContent.wordCount} words • Generated with AI`,
    },
  });

  // Template-specific content generation
  switch (template.id) {
    case 'bullet-points':
      if (parsedContent.bulletPoints.length > 0) {
        sections.push({
          type: 'bullets',
          content: {
            points: parsedContent.bulletPoints,
            style: 'modern',
          },
        });
      }
      break;

    case 'infographic-steps':
      if (parsedContent.steps.length > 0) {
        sections.push({
          type: 'steps',
          content: {
            steps: parsedContent.steps.map((step, index) => ({
              number: index + 1,
              title: step.split('.')[0] || `Step ${index + 1}`,
              description: step,
            })),
          },
        });
      }
      break;

    case 'statistics-dashboard':
    case 'data-visualization':
      if (parsedContent.statistics.length > 0) {
        sections.push({
          type: 'stats',
          content: {
            stats: parsedContent.statistics,
            layout: parsedContent.statistics.length <= 3 ? 'horizontal' : 'grid',
          },
        });
      }
      break;

    case 'comparison-chart':
    case 'before-after':
      if (parsedContent.comparisons.length > 0) {
        sections.push({
          type: 'comparison',
          content: {
            comparisons: parsedContent.comparisons,
            layout: 'side-by-side',
          },
        });
      }
      break;

    case 'feature-highlights':
      sections.push({
        type: 'features',
        content: {
          features: parsedContent.keyPoints.slice(0, 4).map((point, index) => ({
            title: `Feature ${index + 1}`,
            description: point,
            icon: getFeatureIcon(index),
          })),
        },
      });
      break;

    case 'tips-tricks':
      sections.push({
        type: 'tips',
        content: {
          tips: parsedContent.keyPoints.slice(0, 5).map((tip, index) => ({
            number: index + 1,
            title: `Tip ${index + 1}`,
            description: tip,
          })),
        },
      });
      break;

    default:
      // Default content structure
      if (parsedContent.bulletPoints.length > 0) {
        sections.push({
          type: 'bullets',
          content: {
            points: parsedContent.bulletPoints,
            style: 'simple',
          },
        });
      } else if (parsedContent.statistics.length > 0) {
        sections.push({
          type: 'stats',
          content: {
            stats: parsedContent.statistics,
            layout: 'grid',
          },
        });
      } else {
        sections.push({
          type: 'content',
          content: {
            points: parsedContent.keyPoints,
            layout: 'list',
          },
        });
      }
  }

  // Add chart section if themes suggest it
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
        title: 'Comparison Analysis',
        data: generateMockChartData('comparison'),
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

function getFeatureIcon(index: number): string {
  const icons = ['⭐', '🚀', '💡', '🎯', '📈', '🔧'];
  return icons[index % icons.length];
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
