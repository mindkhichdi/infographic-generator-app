import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

interface InfographicData {
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
            className="text-center p-6 rounded-lg"
            style={{ 
              backgroundColor: `${colors[0]}20`,
              fontFamily: fonts.heading 
            }}
          >
            <h1 
              className="text-2xl font-bold mb-2"
              style={{ color: colors[0] }}
            >
              {section.content.title}
            </h1>
            {section.content.subtitle && (
              <p className="text-gray-600">{section.content.subtitle}</p>
            )}
          </div>
        );

      case 'stats':
        return (
          <div key={index} className="grid grid-cols-2 gap-4">
            {section.content.stats.map((stat: any, statIndex: number) => (
              <div 
                key={statIndex}
                className="p-4 rounded-lg text-center"
                style={{ backgroundColor: `${colors[statIndex % colors.length]}20` }}
              >
                <div 
                  className="text-3xl font-bold"
                  style={{ 
                    color: colors[statIndex % colors.length],
                    fontFamily: fonts.heading 
                  }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-sm text-gray-600 mt-1"
                  style={{ fontFamily: fonts.body }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        );

      case 'chart':
        return (
          <div key={index} className="p-4">
            <h3 
              className="text-lg font-semibold mb-4 text-center"
              style={{ 
                color: colors[0],
                fontFamily: fonts.heading 
              }}
            >
              {section.content.title}
            </h3>
            <div className="h-48">
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
          <div key={index} className="p-4">
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
          <div key={index} className="text-center p-4">
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
    <Card className="aspect-[3/4] p-6 bg-white overflow-hidden">
      <div className="h-full flex flex-col space-y-4">
        {sections.map((section, index) => renderSection(section, index))}
      </div>
    </Card>
  );
}
