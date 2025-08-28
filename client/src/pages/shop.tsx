import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/product-card";
import type { Product } from "@shared/schema";

const Shop = () => {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  // Get category from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, []);

  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const categories = [
    { value: "all", label: "Alle Kategorien" },
    { value: "kettenanhanger", label: "Kettenanhänger" },
    { value: "ohrringe", label: "Ohrringe" },
    { value: "fingerringe", label: "Fingerringe" },
    { value: "armbander", label: "Armbänder" },
  ];

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price-low", label: "Preis: Niedrig zu Hoch" },
    { value: "price-high", label: "Preis: Hoch zu Niedrig" },
  ];

  // Filter products by category and stock availability
  const filteredProducts = allProducts.filter((product) => 
    (selectedCategory === "all" || product.category === selectedCategory) && product.inStock
  );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      setLocation("/shop");
    } else {
      setLocation(`/shop?category=${category}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest mx-auto"></div>
            <p className="mt-4 text-charcoal">Produkte werden geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest mb-4" data-testid="heading-shop">
            Unser Schmuck-Sortiment
          </h1>
          <p className="text-lg text-charcoal max-w-3xl mx-auto">
            Entdecken Sie unsere handgefertigten Unikate aus Kunstharz, Silber und Bronze - 
            jedes Stück ein kleines Märchen aus der Natur.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-charcoal mb-4">Kategorie wählen</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 ${
                    selectedCategory === category.value
                      ? "bg-forest text-white shadow-lg"
                      : "border-forest text-forest hover:bg-forest hover:text-white"
                  }`}
                  data-testid={`button-category-${category.value}`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Sort Options */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-charcoal mb-3">Sortieren nach</label>
              <Select value={sortBy} onValueChange={setSortBy} data-testid="select-sort">
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Product Count */}
        <div className="mb-6">
          <p className="text-charcoal/70" data-testid="text-product-count">
            {sortedProducts.length} Produkt{sortedProducts.length !== 1 ? 'e' : ''} gefunden
          </p>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-charcoal mb-4">Keine Produkte in dieser Kategorie gefunden.</p>
            <Button
              onClick={() => handleCategoryChange("all")}
              variant="outline"
              className="border-forest text-forest hover:bg-forest hover:text-white"
              data-testid="button-show-all"
            >
              Alle Produkte anzeigen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-xl p-8 shadow-sm">
          <h3 className="font-heading text-2xl font-bold text-forest mb-4">
            Nicht das Richtige gefunden?
          </h3>
          <p className="text-charcoal mb-6 max-w-2xl mx-auto">
            Ich fertige auch gerne individuelle Schmuckstücke nach Ihren Wünschen an. 
            Kontaktieren Sie mich für eine persönliche Beratung.
          </p>
          <Button 
            onClick={() => setLocation("/kontakt?tab=sonderanfertigung")}
            className="bg-gold hover:bg-gold/90 text-white px-8 py-3 rounded-full font-semibold"
            data-testid="button-contact-custom"
          >
            Sonderanfertigung anfragen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Shop;
