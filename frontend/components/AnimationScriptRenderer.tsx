import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Palette, Type } from 'lucide-react';

interface AnimationScene {
  sceneNumber: number;
  keyText: string;
  visualDescription: string;
  lottieAnimationDescription: string;
  duration: number;
}

interface AnimationScript {
  scenes: AnimationScene[];
  overallStyle: string;
  colorPalette: string[];
  typography: string;
  totalDuration: number;
  generatedAt: Date;
}

interface AnimationScriptRendererProps {
  script: AnimationScript;
}

export default function AnimationScriptRenderer({ script }: AnimationScriptRendererProps) {
  const { scenes, overallStyle, colorPalette, typography, totalDuration } = script;

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Script Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Animation Script Overview</span>
            <Badge variant="secondary" className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDuration(totalDuration)}
            </Badge>
          </CardTitle>
          <CardDescription>
            Lottie animation script with {scenes.length} scenes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Style</p>
                <p className="text-sm text-gray-600 capitalize">{overallStyle.replace('-', ' ')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Typography</p>
                <p className="text-sm text-gray-600">{typography}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Colors</p>
                <div className="flex space-x-1 mt-1">
                  {colorPalette.slice(0, 4).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded border border-gray-200"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  {colorPalette.length > 4 && (
                    <span className="text-xs text-gray-500">+{colorPalette.length - 4}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scene-by-Scene Script */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Scene-by-Scene Script</h3>
        {scenes.map((scene, index) => (
          <Card key={scene.sceneNumber} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                  >
                    {scene.sceneNumber}
                  </div>
                  <div>
                    <CardTitle className="text-lg">Scene {scene.sceneNumber}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(scene.duration)}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Text</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg font-medium">
                  "{scene.keyText}"
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Visual Description</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {scene.visualDescription}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Lottie Animation Description</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {scene.lottieAnimationDescription}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Technical Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Notes for Motion Designer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>Use ease-in-out transitions for smooth, professional animations</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>Maintain consistent timing between scenes for narrative flow</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>Apply the specified color palette consistently across all scenes</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>Optimize for web delivery - keep file size under 500KB when possible</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>Test animations at different playback speeds for accessibility</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
