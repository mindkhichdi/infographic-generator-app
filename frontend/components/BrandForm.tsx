import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Plus, X, Upload } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface BrandFormProps {
  brand?: any;
  onSuccess: () => void;
}

const fontOptions = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 
  'Source Sans Pro', 'Nunito', 'Raleway', 'Ubuntu'
];

const defaultColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

export default function BrandForm({ brand, onSuccess }: BrandFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState(brand?.name || '');
  const [watermarkType, setWatermarkType] = useState<'text' | 'logo'>('text');
  const [watermarkText, setWatermarkText] = useState(brand?.watermarkText || '');
  const [watermarkLogoUrl, setWatermarkLogoUrl] = useState(brand?.watermarkLogoUrl || '');
  const [colorPalette, setColorPalette] = useState<string[]>(brand?.colorPalette || ['#3B82F6', '#10B981', '#F59E0B']);
  const [headingFont, setHeadingFont] = useState(brand?.headingFont || 'Inter');
  const [bodyFont, setBodyFont] = useState(brand?.bodyFont || 'Inter');

  const createMutation = useMutation({
    mutationFn: (data: any) => backend.infographic.createBrand(data),
    onSuccess: () => {
      toast({
        title: 'Brand created',
        description: 'Your brand has been created successfully.',
      });
      onSuccess();
    },
    onError: (error) => {
      console.error('Failed to create brand:', error);
      toast({
        title: 'Error',
        description: 'Failed to create the brand. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => backend.infographic.updateBrand(data),
    onSuccess: () => {
      toast({
        title: 'Brand updated',
        description: 'Your brand has been updated successfully.',
      });
      onSuccess();
    },
    onError: (error) => {
      console.error('Failed to update brand:', error);
      toast({
        title: 'Error',
        description: 'Failed to update the brand. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a brand name.',
        variant: 'destructive',
      });
      return;
    }

    if (colorPalette.length === 0) {
      toast({
        title: 'Colors required',
        description: 'Please add at least one color to your palette.',
        variant: 'destructive',
      });
      return;
    }

    const data = {
      name,
      watermarkText: watermarkType === 'text' ? watermarkText : undefined,
      watermarkLogoUrl: watermarkType === 'logo' ? watermarkLogoUrl : undefined,
      colorPalette,
      headingFont,
      bodyFont,
    };

    if (brand) {
      updateMutation.mutate({ id: brand.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const addColor = (color: string) => {
    if (!colorPalette.includes(color)) {
      setColorPalette([...colorPalette, color]);
    }
  };

  const removeColor = (index: number) => {
    setColorPalette(colorPalette.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, color: string) => {
    const newPalette = [...colorPalette];
    newPalette[index] = color;
    setColorPalette(newPalette);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Brand Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter brand name"
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-base font-medium">Watermark</Label>
        <RadioGroup 
          value={watermarkType} 
          onValueChange={(value: 'text' | 'logo') => setWatermarkType(value)}
          className="mt-2"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="text" id="watermark-text" />
              <Label htmlFor="watermark-text">Watermark Text</Label>
            </div>
            {watermarkType === 'text' && (
              <Input
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Enter watermark text"
                className="ml-6"
              />
            )}
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="logo" id="watermark-logo" />
              <Label htmlFor="watermark-logo">Watermark Logo</Label>
            </div>
            {watermarkType === 'logo' && (
              <div className="ml-6 space-y-2">
                <Input
                  value={watermarkLogoUrl}
                  onChange={(e) => setWatermarkLogoUrl(e.target.value)}
                  placeholder="Enter logo URL"
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
            )}
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-medium">Color Palette</Label>
        <div className="mt-2 space-y-3">
          <div className="flex flex-wrap gap-2">
            {colorPalette.map((color, index) => (
              <div key={index} className="flex items-center space-x-1">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeColor(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addColor('#000000')}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Quick add colors:</p>
            <div className="flex flex-wrap gap-1">
              {defaultColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => addColor(color)}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="heading-font">Heading Font</Label>
          <Select value={headingFont} onValueChange={setHeadingFont}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="body-font">Body Font</Label>
          <Select value={bodyFont} onValueChange={setBodyFont}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {createMutation.isPending || updateMutation.isPending 
            ? 'Saving...' 
            : brand ? 'Update Brand' : 'Create Brand'
          }
        </Button>
      </div>
    </form>
  );
}
