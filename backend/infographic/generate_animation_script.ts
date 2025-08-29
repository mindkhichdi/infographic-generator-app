import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

export interface GenerateAnimationScriptRequest {
  content: string;
  targetAudience: string;
  designStyle: string;
  colorPalette: string[];
  typography: string;
  pacing: 'fast' | 'moderate' | 'slow';
  sceneCount: number;
}

export interface AnimationScene {
  sceneNumber: number;
  keyText: string;
  visualDescription: string;
  lottieAnimationDescription: string;
  duration: number;
}

export interface GenerateAnimationScriptResponse {
  scenes: AnimationScene[];
  overallStyle: string;
  colorPalette: string[];
  typography: string;
  totalDuration: number;
  generatedAt: Date;
}

// Generates an animated infographic script for Lottie animations.
export const generateAnimationScript = api<GenerateAnimationScriptRequest, GenerateAnimationScriptResponse>(
  { expose: true, method: "POST", path: "/generate/animation-script", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    // Parse and analyze content
    const parsedContent = parseContentForAnimation(req.content);
    const scenes = generateAnimationScenes(parsedContent, req);
    
    const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
    
    return {
      scenes,
      overallStyle: req.designStyle,
      colorPalette: req.colorPalette,
      typography: req.typography,
      totalDuration,
      generatedAt: new Date(),
    };
  }
);

function parseContentForAnimation(content: string) {
  const lines = content.split('\n').filter(line => line.trim());
  const title = extractTitle(lines);
  
  // Extract key statistics and numbers
  const statistics = content.match(/\d+(?:\.\d+)?%?/g) || [];
  const keyStats = statistics.slice(0, 4).map((stat, index) => ({
    value: stat,
    context: extractStatContext(content, stat),
  }));

  // Extract bullet points
  const bulletPoints = lines
    .filter(line => line.match(/^[\s]*[•\-*]\s+/))
    .map(line => line.replace(/^[\s]*[•\-*]\s+/, '').trim())
    .filter(point => point.length > 0)
    .slice(0, 6);

  // Extract numbered steps
  const steps = lines
    .filter(line => line.match(/^\s*\d+[\.\)]\s+/))
    .map(line => line.replace(/^\s*\d+[\.\)]\s+/, '').trim())
    .filter(step => step.length > 0)
    .slice(0, 5);

  // Extract key themes
  const themes = detectContentThemes(content);
  
  // Extract main message/conclusion
  const conclusion = extractConclusion(lines);

  return {
    title,
    keyStats,
    bulletPoints,
    steps,
    themes,
    conclusion,
    wordCount: content.split(' ').length,
  };
}

function extractTitle(lines: string[]): string {
  const headerLine = lines.find(line => line.startsWith('#'));
  if (headerLine) {
    return headerLine.replace(/^#+\s*/, '');
  }
  
  const potentialTitle = lines.find(line => 
    line.length > 5 && 
    line.length < 80 && 
    !line.includes('.') && 
    !line.match(/^[•\-*\d+\.]/)
  );
  
  return potentialTitle || 'Animated Infographic';
}

function extractStatContext(content: string, stat: string): string {
  const sentences = content.split(/[.!?]+/);
  const contextSentence = sentences.find(sentence => sentence.includes(stat));
  
  if (contextSentence) {
    const words = contextSentence.trim().split(' ');
    const statIndex = words.findIndex(word => word.includes(stat));
    
    if (statIndex > 0) {
      const contextWords = words.slice(Math.max(0, statIndex - 3), statIndex);
      return contextWords.join(' ').replace(/[^\w\s]/g, '');
    }
  }
  
  const contextLabels = ['growth', 'increase', 'improvement', 'users', 'revenue', 'conversion'];
  return contextLabels[Math.floor(Math.random() * contextLabels.length)];
}

function detectContentThemes(content: string): string[] {
  const themes = [];
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('growth') || lowerContent.includes('increase')) {
    themes.push('growth');
  }
  if (lowerContent.includes('process') || lowerContent.includes('step')) {
    themes.push('process');
  }
  if (lowerContent.includes('data') || lowerContent.includes('analytics')) {
    themes.push('data');
  }
  if (lowerContent.includes('comparison') || lowerContent.includes('vs')) {
    themes.push('comparison');
  }
  if (lowerContent.includes('benefit') || lowerContent.includes('advantage')) {
    themes.push('benefits');
  }
  
  return themes;
}

function extractConclusion(lines: string[]): string {
  const lastMeaningfulLine = lines
    .reverse()
    .find(line => 
      line.length > 20 && 
      !line.match(/^[•\-*\d+\.]/) &&
      !line.startsWith('#')
    );
  
  return lastMeaningfulLine || 'Transform your approach with these insights.';
}

function generateAnimationScenes(parsedContent: any, req: GenerateAnimationScriptRequest): AnimationScene[] {
  const scenes: AnimationScene[] = [];
  const baseDuration = req.pacing === 'fast' ? 2 : req.pacing === 'slow' ? 5 : 3;
  
  // Scene 1: Title Introduction
  scenes.push({
    sceneNumber: 1,
    keyText: parsedContent.title,
    visualDescription: "Large, bold title text centered on screen with subtle geometric background elements. Clean, minimalist layout with primary brand color accents.",
    lottieAnimationDescription: "Title text writes on character by character with a typewriter effect (0.5s per character). Background geometric shapes fade in simultaneously with a gentle scale-up animation (ease-out). Subtle particle effects or light rays emanate from behind the text. The entire composition settles with a gentle bounce effect.",
    duration: baseDuration + 1,
  });

  // Scene 2: Key Statistics (if available)
  if (parsedContent.keyStats.length > 0) {
    const statsText = parsedContent.keyStats.map(stat => `${stat.value} ${stat.context}`).join(' • ');
    scenes.push({
      sceneNumber: scenes.length + 1,
      keyText: statsText,
      visualDescription: "Circular progress indicators or animated counters displaying key statistics. Each stat is contained within a modern card or circular element with icons representing the metric type.",
      lottieAnimationDescription: "Statistics appear one by one with a staggered delay (0.3s between each). Numbers count up from 0 to their final value with an easing animation. Progress circles fill clockwise as numbers count up. Icons scale in with a bounce effect. Background cards slide in from the bottom with a smooth ease-out transition.",
      duration: baseDuration + 2,
    });
  }

  // Scene 3: Main Content (Bullet Points or Steps)
  if (parsedContent.bulletPoints.length > 0) {
    scenes.push({
      sceneNumber: scenes.length + 1,
      keyText: "Key Benefits",
      visualDescription: "Vertical list of bullet points with checkmark icons or modern bullet symbols. Each point is accompanied by a relevant icon (lightbulb, target, graph, etc.). Clean typography hierarchy with the main heading and supporting bullet text.",
      lottieAnimationDescription: "Heading fades in with a subtle slide-down motion. Bullet points appear sequentially from top to bottom with a 0.4s delay between each. Each bullet point slides in from the left while its icon scales up from the center with a bounce effect. Checkmarks draw themselves with a smooth line animation. The entire list settles with a gentle wave effect cascading down.",
      duration: baseDuration + (parsedContent.bulletPoints.length * 0.5),
    });
  } else if (parsedContent.steps.length > 0) {
    scenes.push({
      sceneNumber: scenes.length + 1,
      keyText: "Step-by-Step Process",
      visualDescription: "Numbered steps arranged in a flowing timeline or vertical sequence. Each step has a numbered circle connected by animated lines or arrows. Modern step indicators with descriptive text for each phase.",
      lottieAnimationDescription: "Steps reveal sequentially from top to bottom. Numbered circles scale in with a bounce effect, followed by connecting lines drawing themselves smoothly. Step text fades in with a slight slide-right animation. Arrows between steps animate with a subtle pulse effect. The entire timeline completes with a success checkmark at the end.",
      duration: baseDuration + (parsedContent.steps.length * 0.6),
    });
  }

  // Scene 4: Visual Metaphor or Chart (based on themes)
  if (parsedContent.themes.includes('growth')) {
    scenes.push({
      sceneNumber: scenes.length + 1,
      keyText: "Exponential Growth",
      visualDescription: "Animated line chart or growth arrow trending upward. Bar charts or area graphs showing progression over time. Growth metaphors like sprouting plants or ascending stairs.",
      lottieAnimationDescription: "Chart axes draw in first with clean line animations. Data points appear sequentially with a gentle bounce. The growth line draws itself smoothly from left to right with an ease-in-out curve. Bar charts fill from bottom to top with a liquid-like animation. Growth arrow scales up dramatically with trailing particle effects. Background grid fades in subtly to support the data visualization.",
      duration: baseDuration + 1,
    });
  } else if (parsedContent.themes.includes('process')) {
    scenes.push({
      sceneNumber: scenes.length + 1,
      keyText: "Streamlined Process",
      visualDescription: "Flowchart or process diagram with connected elements. Gears, arrows, or pipeline metaphors showing workflow. Clean geometric shapes representing different process stages.",
      lottieAnimationDescription: "Process elements appear in sequence following the workflow direction. Connecting arrows animate with a flowing motion from start to finish. Gears rotate smoothly in sync with each other. Process boxes scale in with a subtle rotation effect. Data or elements flow through the pipeline with particle animations. The entire system pulses gently to show it's active and optimized.",
      duration: baseDuration + 1,
    });
  }

  // Final Scene: Call to Action or Conclusion
  scenes.push({
    sceneNumber: scenes.length + 1,
    keyText: parsedContent.conclusion,
    visualDescription: "Strong call-to-action text with supporting visual elements. Button or action-oriented graphics. Clean, focused layout that draws attention to the next step.",
    lottieAnimationDescription: "Conclusion text fades in with a confident scale-up animation. Supporting graphics (arrows, buttons, or icons) pulse gently to draw attention. Background elements create a subtle spotlight effect focusing on the CTA. The entire scene has a gentle breathing animation to maintain engagement. Final logo or brand element appears with a satisfying completion animation.",
    duration: baseDuration,
  });

  // Ensure we don't exceed the requested scene count
  return scenes.slice(0, req.sceneCount);
}
