import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Eye, Heart, Star, X, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { GalleryImage } from "@shared/schema";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const categories = [
    { id: "all", name: "Alle Bilder", description: "Komplette Sammlung" },
    { id: "silver-bronze", name: "Silber und Bronze", description: "Edle Metallarbeiten" },
    { id: "nature", name: "Haare, Asche, Blüten", description: "Besondere Erinnerungsstücke" },
    { id: "resin", name: "Kunstharz", description: "UV-Resin Kreationen" },
    { id: "worn", name: "Tragebilder", description: "Schmuck in Aktion" },
  ];

  // Load gallery images from API
  const { data: galleryImages = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
  });

  const filteredImages = selectedCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < filteredImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  const handleImageError = (imageId: string) => {
    setImageErrors(prev => new Set([...Array.from(prev), imageId]));
  };

  const getImageUrl = (imageUrl: string) => {
    // If it's an Object Storage path, ensure it starts with the correct base
    if (imageUrl.startsWith('/objects/')) {
      return imageUrl; // These should work through our /objects/ route
    }
    // For external URLs, we'll try to load them but handle errors gracefully
    return imageUrl;
  };

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest mb-4" data-testid="heading-gallery">
            Bildergalerie
          </h1>
          <p className="text-lg text-charcoal max-w-3xl mx-auto">
            Entdecken Sie die Vielfalt und Schönheit unserer handgefertigten Schmuckkreationen. 
            Jedes Stück erzählt seine eigene Geschichte und zeigt die einzigartige Verbindung zwischen Natur und Handwerkskunst.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-forest text-white shadow-lg"
                    : "border-forest text-forest hover:bg-forest hover:text-white"
                }`}
                data-testid={`button-category-${category.id}`}
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          {/* Category Description */}
          <div className="text-center mt-6">
            <p className="text-charcoal/70">
              {categories.find(cat => cat.id === selectedCategory)?.description}
            </p>
            <p className="text-sm text-charcoal/60 mt-2" data-testid="text-image-count">
              {filteredImages.length} Bild{filteredImages.length !== 1 ? 'er' : ''} in dieser Kategorie
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
            <p className="mt-4 text-charcoal">Galerie wird geladen...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-16">
            <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-charcoal mb-4">Keine Bilder in dieser Kategorie verfügbar.</p>
            <Button
              onClick={() => setSelectedCategory("all")}
              variant="outline"
              className="border-forest text-forest hover:bg-forest hover:text-white"
              data-testid="button-show-all-images"
            >
              Alle Bilder anzeigen
            </Button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-0">
            {filteredImages.map((image, index) => (
              <div key={image.id} className="group relative break-inside-avoid block w-full mb-0">
                {imageErrors.has(image.id) ? (
                  <div className="w-full min-h-[200px] bg-gray-100 flex items-center justify-center border-2 border-gray-200 rounded-lg">
                    <div className="text-center p-4">
                      <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-1">Bild nicht verfügbar</p>
                      <p className="text-xs text-gray-400">{image.title}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={getImageUrl(image.imageUrl)}
                      alt={image.altText}
                      className="w-full h-auto object-cover transition-all duration-300 group-hover:brightness-75 block cursor-pointer"
                      data-testid={`gallery-image-${image.id}`}
                      onClick={() => openLightbox(index)}
                      onError={() => handleImageError(image.id)}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="sm"
                          className="bg-white/90 text-forest hover:bg-white"
                          data-testid={`button-view-image-${image.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openLightbox(index);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Vergrößern
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Customer Testimonial Section */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-sm text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-gold fill-current" />
            ))}
          </div>
          <blockquote className="text-lg italic text-charcoal mb-4">
            "Die Bilder zeigen nur einen Bruchteil der wirklichen Schönheit. Wenn man die Schmuckstücke in der Hand hält, 
            spürt man die Liebe und Sorgfalt, die in jedes Detail geflossen ist."
          </blockquote>
          <cite className="font-semibold text-forest">— Maria H., zufriedene Kundin</cite>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-sage/10 rounded-xl p-8">
          <Heart className="w-12 h-12 text-gold mx-auto mb-4" />
          <h3 className="font-heading text-2xl font-bold text-forest mb-4">
            Haben Sie ein Lieblingsstück entdeckt?
          </h3>
          <p className="text-charcoal mb-6 max-w-2xl mx-auto">
            Viele der gezeigten Schmuckstücke sind als Einzelstücke oder in ähnlicher Form verfügbar. 
            Gerne fertige ich auch individuelle Stücke nach Ihren Wünschen an.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = "/shop"}
              className="bg-forest hover:bg-forest/90 text-white px-8 py-3 rounded-full font-semibold"
              data-testid="button-visit-shop"
            >
              Shop besuchen
            </Button>
            <Button 
              onClick={() => window.location.href = "/kontakt"}
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 rounded-full font-semibold"
              data-testid="button-contact-custom-piece"
            >
              Individuelles Stück anfragen
            </Button>
          </div>
        </div>

        {/* Lightbox Modal */}
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent 
            className="max-w-[98vw] max-h-[98vh] w-[98vw] h-[98vh] p-0 bg-black/95 border-none"
            onKeyDown={handleKeyPress}
          >
            <VisuallyHidden>
              <DialogTitle>Bildergalerie - Vergrößerte Ansicht</DialogTitle>
            </VisuallyHidden>
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
                onClick={closeLightbox}
                data-testid="button-close-lightbox"
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Previous Button */}
              {selectedImageIndex !== null && selectedImageIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full"
                  onClick={prevImage}
                  data-testid="button-prev-image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
              )}

              {/* Next Button */}
              {selectedImageIndex !== null && selectedImageIndex < filteredImages.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full"
                  onClick={nextImage}
                  data-testid="button-next-image"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              )}

              {/* Image */}
              {selectedImageIndex !== null && filteredImages[selectedImageIndex] && (
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-4 min-h-0">
                    {imageErrors.has(filteredImages[selectedImageIndex].id) ? (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <div className="text-center">
                          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl mb-2">Bild nicht verfügbar</h3>
                          <p className="text-gray-300">{filteredImages[selectedImageIndex].title}</p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={getImageUrl(filteredImages[selectedImageIndex].imageUrl)}
                        alt={filteredImages[selectedImageIndex].altText}
                        className="w-full h-full object-contain rounded-lg shadow-2xl"
                        style={{ 
                          maxWidth: '90vw', 
                          maxHeight: 'calc(100vh - 200px)',
                          minWidth: '60vw',
                          minHeight: '60vh'
                        }}
                        data-testid={`lightbox-image-${filteredImages[selectedImageIndex].id}`}
                        onError={() => handleImageError(filteredImages[selectedImageIndex].id)}
                      />
                    )}
                  </div>
                  
                  {/* Image Info */}
                  <div className="text-center p-6 text-white bg-black/50 backdrop-blur-sm">
                    <h3 className="text-2xl font-semibold mb-2">
                      {filteredImages[selectedImageIndex].title}
                    </h3>
                    {filteredImages[selectedImageIndex].description && (
                      <p className="text-gray-300 text-base mb-2">
                        {filteredImages[selectedImageIndex].description}
                      </p>
                    )}
                    <p className="text-gray-400 text-sm">
                      Bild {selectedImageIndex + 1} von {filteredImages.length}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Gallery;
