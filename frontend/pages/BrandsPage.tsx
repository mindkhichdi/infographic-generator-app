import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Palette, Type } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import BrandForm from '../components/BrandForm';

export default function BrandsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: brandsData, isLoading, error } = useQuery({
    queryKey: ['brands'],
    queryFn: () => backend.infographic.listBrands(),
  });

  const deleteBrandMutation = useMutation({
    mutationFn: (id: number) => backend.infographic.deleteBrand({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: 'Brand deleted',
        description: 'The brand has been successfully deleted.',
      });
    },
    onError: (error: any) => {
      console.error('Failed to delete brand:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete the brand. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (brand: any) => {
    setEditingBrand(brand);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteBrandMutation.mutate(id);
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['brands'] });
    toast({
      title: 'Brand created',
      description: 'Your new brand has been created successfully.',
    });
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setEditingBrand(null);
    queryClient.invalidateQueries({ queryKey: ['brands'] });
    toast({
      title: 'Brand updated',
      description: 'Your brand has been updated successfully.',
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Brands</h2>
          <p className="text-gray-600">Failed to load your brands. Please try again.</p>
        </div>
      </div>
    );
  }

  const brands = brandsData?.brands || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
          <p className="text-gray-600 mt-2">
            Create and manage your brand assets for consistent infographic design.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Brand</DialogTitle>
              <DialogDescription>
                Set up your brand identity with colors, fonts, and watermarks.
              </DialogDescription>
            </DialogHeader>
            <BrandForm onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {brands.length === 0 ? (
        <div className="text-center py-16">
          <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Brands Yet</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Create your first brand to maintain consistent styling across all your infographics.
          </p>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Brand
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Brand</DialogTitle>
                <DialogDescription>
                  Set up your brand identity with colors, fonts, and watermarks.
                </DialogDescription>
              </DialogHeader>
              <BrandForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Card key={brand.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{brand.name}</span>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(brand)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{brand.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(brand.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardTitle>
                <CardDescription>
                  {brand.watermarkText && (
                    <span className="text-sm text-gray-500">
                      Watermark: {brand.watermarkText}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Color Palette</p>
                    <div className="flex space-x-2">
                      {brand.colorPalette.slice(0, 5).map((color: string, index: number) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                      {brand.colorPalette.length > 5 && (
                        <div className="w-6 h-6 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                          +{brand.colorPalette.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Type className="h-4 w-4" />
                      <span>{brand.headingFont}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>
              Update your brand identity settings.
            </DialogDescription>
          </DialogHeader>
          {editingBrand && (
            <BrandForm 
              brand={editingBrand} 
              onSuccess={handleEditSuccess} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
