import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Plus,
  Image as ImageIcon,
  Upload
} from "lucide-react";
import type { GalleryImage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const AdminGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const categories = [
    { id: "all", name: "Alle Bilder" },
    { id: "Silber und Bronze", name: "Silber und Bronze" },
    { id: "Haare, Asche, Blüten, etc.", name: "Haare, Asche, Blüten, etc." },
    { id: "Kunstharz", name: "Kunstharz" },
    { id: "Tragebilder", name: "Tragebilder" },
  ];

  // Load gallery images
  const { data: galleryImages = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/gallery/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: "Bild gelöscht",
        description: "Das Galeriebild wurde erfolgreich entfernt.",
      });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Das Galeriebild konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    },
  });

  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      await apiRequest(`/api/gallery/${id}`, {
        method: "PUT",
        body: { isVisible },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: "Sichtbarkeit geändert",
        description: "Die Sichtbarkeit des Galeriebilds wurde aktualisiert.",
      });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Die Sichtbarkeit konnte nicht geändert werden.",
        variant: "destructive",
      });
    },
  });

  const filteredImages = selectedCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Möchten Sie das Bild "${title}" wirklich löschen?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleVisibility = (id: string, currentVisibility: boolean | null) => {
    toggleVisibilityMutation.mutate({ 
      id, 
      isVisible: !(currentVisibility !== false) 
    });
  };

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-forest mb-2" data-testid="heading-admin-gallery">
              Galerie-Verwaltung
            </h1>
            <p className="text-charcoal/70">
              Verwalten Sie die Bilder in Ihrer Galerie
            </p>
          </div>
          
          <Button className="bg-forest text-white hover:bg-forest/90" data-testid="button-add-image">
            <Plus className="w-4 h-4 mr-2" />
            Bild hinzufügen
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ImageIcon className="h-8 w-8 text-forest" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Gesamt</p>
                  <p className="text-2xl font-bold text-forest" data-testid="total-images-count">
                    {galleryImages.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {categories.slice(1).map((category) => {
            const count = galleryImages.filter(img => img.category === category.id).length;
            return (
              <Card key={category.id}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <ImageIcon className="h-8 w-8 text-sage" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{category.name}</p>
                      <p className="text-2xl font-bold text-sage" data-testid={`count-${category.id}`}>
                        {count}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 ${
                  selectedCategory === category.id
                    ? "bg-forest text-white"
                    : "border-forest text-forest hover:bg-forest hover:text-white"
                }`}
                data-testid={`button-filter-${category.id}`}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <p className="text-sm text-charcoal/60 mt-2" data-testid="filtered-count">
            {filteredImages.length} Bild{filteredImages.length !== 1 ? 'er' : ''} in dieser Kategorie
          </p>
        </div>

        {/* Image Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
            <p className="mt-4 text-charcoal">Bilder werden geladen...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-charcoal mb-4">
              {selectedCategory === "all" 
                ? "Keine Bilder vorhanden." 
                : "Keine Bilder in dieser Kategorie."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden shadow-lg">
                <div className="relative">
                  <img
                    src={image.imageUrl}
                    alt={image.altText}
                    className="w-full h-48 object-cover"
                    data-testid={`admin-image-${image.id}`}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={(image.isVisible !== false) ? "default" : "secondary"}>
                      {(image.isVisible !== false) ? "Sichtbar" : "Versteckt"}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-heading font-semibold text-forest mb-1" data-testid={`admin-image-title-${image.id}`}>
                    {image.title}
                  </h3>
                  <p className="text-sm text-charcoal/70 mb-2" data-testid={`admin-image-description-${image.id}`}>
                    {image.description}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {categories.find(cat => cat.id === image.category)?.name}
                  </Badge>
                  
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleVisibility(image.id, image.isVisible)}
                      disabled={toggleVisibilityMutation.isPending}
                      data-testid={`button-toggle-visibility-${image.id}`}
                    >
                      {(image.isVisible !== false) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      data-testid={`button-edit-${image.id}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(image.id, image.title)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-700"
                      data-testid={`button-delete-${image.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;