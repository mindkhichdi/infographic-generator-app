import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { CheckCircle, ArrowRight, Star, Target, TrendingUp, Lightbulb } from 'lucide-react';

interface InfographicData {
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
}

interface InfographicRendererProps {
  data: InfographicData;
}

export default function InfographicRenderer({ data }: InfographicRendererProps) {
  const { sections, colors, fonts } = data;

  const renderSection = (section: any, index: number) => {
    switch (section.type) {
      case 'header':
        return (
          <div 
            key={index}
            className="text-center p-6 rounded-lg mb-6"
            style={{ 
              backgroundColor: `${colors[0]}20`,
              fontFamily: fonts.heading 
            }}
          >
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: colors[0] }}
            >
              {section.content.title}
            </h1>
            {section.content.subtitle && (
              <p className="text-gray-600 text-sm">{section.content.subtitle}</p>
            )}
          </div>
        );

      case 'bullets':
        return (
          <div key={index} className="mb-6">
            <h3 
              className="text-xl font-semibold mb-4 text-center"
              style={{ 
                color: colors[0],
                fontFamily: fonts.heading 
              }}
            >
              Key Points
            </h3>
            <div className="space-y-3">
              {section.content.points.map((point: string, pointIndex: number) => (
                <div key={pointIndex} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <CheckCircle 
                    className="h-5 w-5 mt-0.5 flex-shrink-0"
                    style={{ color: colors[pointIndex % colors.length] }}
                  />
                  <p 
                    className="text-gray-700 flex-1"
                    style={{ fontFamily: fonts.body }}
                  >
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'steps':
        return (
          <div key={index} className="mb-6">
            <h3 
              className="text-xl font-semibold mb-4 text-center"
              style={{ 
                color: colors[0],
                fontFamily: fonts.heading 
              }}
            >
              Step-by-Step Process
            </h3>
            <div className="space-y-4">
              {section.content.steps.map((step: any, stepIndex: number) => (
                <div key={stepIndex} className="flex items-start space-x-4">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: colors[stepIndex % colors.length] }}
                  >
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h4 
                      className="font-semibold mb-1"
                      style={{ 
                        color: colors[stepIndex % colors.length],
                        fontFamily: fonts.heading 
                      }}
                    >
                      {step.title}
                    </h4>
                    <p 
                      className="text-gray-700 text-sm"
                      style={{ fontFamily: fonts.body }}
                    >
                      {step.description}
                    </p>
                  </div>
                  {stepIndex < section.content.steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-400 mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'stats':
        return (
          <div key={index} className="mb-6">
            <div className={`grid gap-4 ${section.content.layout === 'horizontal' ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {section.content.stats.map((stat: any, statIndex: number) => (
                <div 
                  key={statIndex}
                  className="p-4 rounded-lg text-center"
                  style={{ backgroundColor: `${colors[statIndex % colors.length]}20` }}
                >
                  <div 
                    className="text-3xl font-bold mb-1"
                    style={{ 
                      color: colors[statIndex % colors.length],
                      fontFamily: fonts.heading 
                    }}
                  >
                    {stat.value}
                  </div>
                  <div 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: fonts.body }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div key={index} className="mb-6">
            <h3 
              className="text-xl font-semibold mb-4 text-center"
              style={{ 
                color: colors[0],
                fontFamily: fonts.heading 
              }}
            >
              Comparison
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {section.content.comparisons.map((comp: any, compIndex: number) => (
                <div key={compIndex} className="space-y-4">
                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{ backgroundColor: `${colors[0]}20` }}
                  >
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: colors[0] }}
                    >
                      Before
                    </h4>
                    <p className="text-gray-700">{comp.before}</p>
                  </div>
                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{ backgroundColor: `${colors[1]}20` }}
                  >
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: colors[1] }}
                    >
                      After
                    </h4>
                    <p className="text-gray-700">{comp.after}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'features':
        return (
          <div key={index} className="mb-6">
            <h3 
              className="text-xl font-semibold mb-4 text-center"
              style={{ 
                color: colors[0],
                fontFamily: fonts.heading 
              }}
            >
              Key Features
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {section.content.features.map((feature: any, featureIndex: number) => (
                <div 
                  key={featureIndex}
                  className="p-4 rounded-lg text-center"
                  style={{ backgroundColor: `${colors[featureIndex % colors.length]}20` }}
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h4 
                    className="font-semibold mb-2"
                    style={{ 
                      color: colors[featureIndex % colors.length],
                      fontFamily: fonts.heading 
                    }}
                  >
                    {feature.title}
                  </h4>
                  <p 
                    className="text-gray-700 text-sm"
                    style={{ fontFamily: fonts.body }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tips':
        return (
          <div key={index} className="mb-6">
            <h3 
              className="text-xl font-semibold mb-4 text-center"
              style={{ 
                color: colors[0],
                fontFamily: fonts.heading 
              }}
            >
              Pro Tips
            </h3>
            <div className="space-y-3">
              {section.content.tips.map((tip: any, tipIndex: number) => (
                <div 
                  key={tipIndex}
                  className="flex items-start space-x-3 p-3 rounded-lg"
                  style={{ backgroundColor: `${colors[tipIndex % colors.length]}20` }}
                >
                  <Lightbulb 
                    className="h-5 w-5 mt-0.5 flex-shrink-0"
                    style={{ color: colors[tipIndex % colors.length] }}
                  />
                  <div className="flex-1">
                    <h4 
                      className="font-semibold mb-1"
                      style={{ 
                        color: colors[tipIndex % colors.length],
                        fontFamily: fonts.heading 
                      }}
                    >
                      {tip.title}
                    </h4>
                    <p 
                      className="text-gray-700 text-sm"
                      style={{ fontFamily: fonts.body }}
                    >
                      {tip.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'chart':
        return (
          <div key={index} className="mb-6">
            <h3 
              className="text-lg font-semibold mb-4 text-center"
              style={{ 
                color: colors[0],
                fontFamily: fonts.heading 
              }}
            >
              {section.content.title}
            </h3>
            <div className="h-48 bg-white rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                {section.content.type === 'line' ? (
                  <LineChart data={section.content.data}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={colors[0]} 
                      strokeWidth={3}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={section.content.data}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Bar dataKey="value" fill={colors[1]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'content':
        return (
          <div key={index} className="mb-6">
            <div className="space-y-3">
              {section.content.points.map((point: string, pointIndex: number) => (
                <div key={pointIndex} className="flex items-start space-x-3">
                  <div 
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: colors[pointIndex % colors.length] }}
                  />
                  <p 
                    className="text-gray-700"
                    style={{ fontFamily: fonts.body }}
                  >
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'footer':
        return (
          <div key={index} className="text-center p-4 mt-6">
            <div 
              className="inline-block px-4 py-2 rounded text-sm text-white"
              style={{ 
                backgroundColor: colors[0],
                fontFamily: fonts.body 
              }}
            >
              {section.content.watermark}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Generated on {section.content.timestamp}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="aspect-[3/4] p-6 bg-white overflow-auto">
      <div className="h-full">
        {sections.map((section, index) => renderSection(section, index))}
      </div>
    </Card>
  );
}
