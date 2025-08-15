import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Star } from "lucide-react";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Alle Bilder", description: "Komplette Sammlung" },
    { id: "silver-bronze", name: "Silber und Bronze", description: "Edle Metallarbeiten" },
    { id: "nature", name: "Haare, Asche, Blüten", description: "Besondere Erinnerungsstücke" },
    { id: "resin", name: "Kunstharz", description: "UV-Resin Kreationen" },
    { id: "worn", name: "Tragebilder", description: "Schmuck in Aktion" },
  ];

  // Sample gallery images - in a real app, these would come from an API
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Handgefertigter Kettenanhänger mit getrockneten Blüten",
      category: "nature",
      title: "Waldblüten Anhänger",
      description: "Zarte Wildblumen eingefasst in klarem Harz"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Elegante Silber-Ohrringe mit Naturmotiven",
      category: "silver-bronze",
      title: "Silber Ohrringe",
      description: "Filigrane Silberarbeit mit organischen Formen"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "UV-Resin Ring mit eingefassten Pflanzenteilen",
      category: "resin",
      title: "Harz-Ring mit Farn",
      description: "Mystischer Ring mit eingefasstem Waldfarn"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Handgefertigtes Armband mit Naturanhängern",
      category: "silver-bronze",
      title: "Bronze Armband",
      description: "Robustes Armband mit Bronze-Elementen"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb155?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Kunde trägt handgefertigten Schmuck im Alltag",
      category: "worn",
      title: "Alltäglicher Begleiter",
      description: "Glanzbruch Schmuck im täglichen Leben"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Besonderes Erinnerungsstück mit persönlichen Elementen",
      category: "nature",
      title: "Erinnerungsschmuck",
      description: "Persönliche Erinnerungen in Harz konserviert"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1588444837495-c6cfeb53fa42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Moderne UV-Resin Kreation mit Farbeffekten",
      category: "resin",
      title: "Farbspiel in Harz",
      description: "Moderne UV-Resin Technik mit Farbverläufen"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Elegante Silberkette mit natürlichen Elementen",
      category: "silver-bronze",
      title: "Naturinspirierte Silberkette",
      description: "Elegante Verbindung von Silber und Natur"
    }
  ];

  const filteredImages = selectedCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-forest mb-4" data-testid="heading-gallery">
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

        {/* Image Grid */}
        {filteredImages.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <Card key={image.id} className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    data-testid={`gallery-image-${image.id}`}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        className="bg-white/90 text-forest hover:bg-white"
                        data-testid={`button-view-image-${image.id}`}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ansehen
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-playfair text-lg font-semibold text-forest mb-2" data-testid={`image-title-${image.id}`}>
                    {image.title}
                  </h3>
                  <p className="text-sm text-charcoal/70" data-testid={`image-description-${image.id}`}>
                    {image.description}
                  </p>
                </CardContent>
              </Card>
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
          <h3 className="font-playfair text-2xl font-bold text-forest mb-4">
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
      </div>
    </div>
  );
};

export default Gallery;
