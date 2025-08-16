import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Plus,
  Image as ImageIcon,
  Upload,
  Check,
  ChevronsUpDown,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@shared/schema";
import type { UploadResult } from "@uppy/core";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Link } from "wouter";

const AdminGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: "",
    title: "",
    description: "",
    category: "",
    altText: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const categories = [
    { id: "all", name: "Alle Bilder" },
    { id: "silver-bronze", name: "Silber und Bronze" },
    { id: "nature", name: "Haare, Asche, Blüten, etc." },
    { id: "resin", name: "Kunstharz" },
    { id: "worn", name: "Tragebilder" },
  ];

  // Load gallery images
  const { data: galleryImages = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/gallery/${id}`, "DELETE");
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
      await apiRequest(`/api/gallery/${id}`, "PUT", { isVisible });
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

  // Add image mutation
  const addImageMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest('/api/gallery', "POST", {
        imageUrl: data.imageUrl,
        title: data.title,
        description: data.description || null,
        category: data.category,
        altText: data.altText,
        isVisible: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setShowAddModal(false);
      setFormData({
        imageUrl: "",
        title: "",
        description: "",
        category: "",
        altText: "",
      });
      toast({
        title: "Bild hinzugefügt",
        description: "Das Galeriebild wurde erfolgreich hinzugefügt.",
      });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Das Galeriebild konnte nicht hinzugefügt werden.",
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

  const handleAddImage = () => {
    if (!formData.imageUrl || !formData.title || !formData.category || !formData.altText) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte füllen Sie alle Pflichtfelder aus (Bild, Titel, Kategorie, Alt-Text).",
        variant: "destructive",
      });
      return;
    }
    addImageMutation.mutate(formData);
  };

  const handleGetUploadParameters = async (file: any) => {
    const response = await apiRequest("/api/objects/upload", "POST");
    const data = await response.json();
    
    if (!data.uploadURL) {
      throw new Error("No uploadURL in response");
    }
    
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful[0]) {
      const uploadedFile = result.successful[0];
      const uploadURL = uploadedFile.uploadURL as string;
      
      // Convert GCS URL to object path
      const objectPath = convertUploadURLToObjectPath(uploadURL);
      
      // Update form data with the object path
      setFormData(prev => ({
        ...prev,
        imageUrl: objectPath,
      }));
      
      toast({
        title: "Upload erfolgreich",
        description: "Das Bild wurde erfolgreich hochgeladen. Füllen Sie nun die weiteren Details aus.",
      });
    } else {
      toast({
        title: "Upload fehlgeschlagen",
        description: "Das Bild konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
    }
  };

  const convertUploadURLToObjectPath = (uploadURL: string): string => {
    try {
      const url = new URL(uploadURL);
      const pathParts = url.pathname.split('/');
      
      // Find the part after .private/gallery/
      const privateIndex = pathParts.findIndex(part => part === '.private');
      if (privateIndex !== -1 && pathParts[privateIndex + 1] === 'gallery') {
        const objectId = pathParts[privateIndex + 2];
        return `/objects/gallery/${objectId}`;
      }
      
      // Fallback: use the original URL
      return uploadURL;
    } catch {
      return uploadURL;
    }
  };

  // Get unique categories from existing images
  const existingCategories = Array.from(new Set(galleryImages.map(img => img.category)));
  const allCategoryOptions = Array.from(new Set([...categories.slice(1).map(c => c.id), ...existingCategories]));

  const selectedCategoryName = categories.find(cat => cat.id === formData.category)?.name || formData.category;

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Zurück zum Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="font-heading text-3xl font-bold text-forest mb-2" data-testid="heading-admin-gallery">
                Galerie-Verwaltung
              </h1>
              <p className="text-charcoal/70">
                Verwalten Sie die Bilder in Ihrer Galerie
              </p>
            </div>
          </div>
          
          <Button 
            className="bg-forest text-white hover:bg-forest/90" 
            onClick={() => setShowAddModal(true)}
            data-testid="button-add-image"
          >
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

        {/* Add Image Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Bild hinzufügen</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <Label>Bild hochladen *</Label>
                <div className="mt-2">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={10485760}
                    onGetUploadParameters={handleGetUploadParameters}
                    onComplete={handleUploadComplete}
                    buttonClassName="w-full bg-forest hover:bg-forest/90 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {formData.imageUrl ? "Anderes Bild hochladen" : "Bild auswählen und hochladen"}
                  </ObjectUploader>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titel *</Label>
                  <Input
                    id="title"
                    placeholder="Schmuckstück Titel"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    data-testid="input-title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="altText">Alt-Text *</Label>
                  <Input
                    id="altText"
                    placeholder="Beschreibung für Screenreader"
                    value={formData.altText}
                    onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
                    data-testid="input-alt-text"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  placeholder="Beschreibung des Schmuckstücks..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  data-testid="input-description"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Kategorie *</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between mt-2"
                      data-testid="button-category-select"
                    >
                      {selectedCategoryName || "Kategorie wählen..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Kategorie suchen oder neue eingeben..." 
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      />
                      <CommandEmpty>
                        Drücken Sie Enter um "{formData.category}" als neue Kategorie hinzuzufügen.
                      </CommandEmpty>
                      <CommandGroup>
                        {allCategoryOptions.map((categoryId) => {
                          const categoryName = categories.find(cat => cat.id === categoryId)?.name || categoryId;
                          return (
                            <CommandItem
                              key={categoryId}
                              value={categoryId}
                              onSelect={(currentValue) => {
                                setFormData(prev => ({ ...prev, category: currentValue }));
                                setOpen(false);
                              }}
                              data-testid={`option-category-${categoryId}`}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.category === categoryId ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {categoryName}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Image Preview */}
              {formData.imageUrl && (
                <div>
                  <Label>Vorschau</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img
                      src={formData.imageUrl}
                      alt={formData.altText || "Vorschau"}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='200' y='100' text-anchor='middle' fill='%236b7280'%3EBild konnte nicht geladen werden%3C/text%3E%3C/svg%3E";
                      }}
                      data-testid="image-preview"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddImage}
                  disabled={addImageMutation.isPending}
                  className="bg-forest hover:bg-forest/90 text-white"
                  data-testid="button-save-image"
                >
                  {addImageMutation.isPending ? "Wird hinzugefügt..." : "Bild hinzufügen"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      imageUrl: "",
                      title: "",
                      description: "",
                      category: "",
                      altText: "",
                    });
                  }}
                  data-testid="button-cancel"
                >
                  Abbrechen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminGallery;