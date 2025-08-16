import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, ArrowLeft, Heart, Share, Truck, Shield, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

const ProductPage = () => {
  const [, params] = useRoute("/produkt/:id");
  const productId = params?.id;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addItem, isItemInCart } = useCartStore();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const isInCart = product ? isItemInCart(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      imageUrl: product.imageUrls[0],
    });
    
    toast({
      title: "Zum Warenkorb hinzugefügt",
      description: `${product.name} wurde zu Ihrem Warenkorb hinzugefügt.`,
    });
  };

  const formatPrice = (price: string) => {
    return `CHF ${parseFloat(price).toFixed(2)}`;
  };

  const getCategoryName = (category: string) => {
    const categoryNames: Record<string, string> = {
      kettenanhanger: "Kettenanhänger",
      ohrringe: "Ohrringe", 
      fingerringe: "Fingerringe",
      armbander: "Armbänder",
      sonderanfertigungen: "Sonderanfertigungen",
    };
    return categoryNames[category] || category;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest mx-auto"></div>
            <p className="mt-4 text-charcoal">Produkt wird geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-cream py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-heading font-bold text-forest mb-4">Produkt nicht gefunden</h1>
          <p className="text-charcoal mb-8">Das gesuchte Produkt konnte nicht gefunden werden.</p>
          <Link href="/shop">
            <Button className="bg-forest hover:bg-forest/80 text-cream">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-charcoal/70">
            <Link href="/" className="hover:text-forest transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-forest transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-forest transition-colors">
              {getCategoryName(product.category)}
            </Link>
            <span>/</span>
            <span className="text-charcoal">{product.name}</span>
          </div>
        </div>

        {/* Back Button */}
        <div className="mb-8">
          <Link href="/shop">
            <Button variant="outline" className="text-forest border-forest hover:bg-forest hover:text-cream">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Shop
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg bg-white shadow-lg">
              <img
                src={product.imageUrls[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid={`product-main-image`}
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-medium">
                    Ausverkauft
                  </span>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.imageUrls.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.imageUrls.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? "border-forest shadow-lg" 
                        : "border-gray-200 hover:border-sage"
                    }`}
                    data-testid={`product-thumbnail-${index}`}
                  >
                    <img
                      src={imageUrl}
                      alt={`${product.name} - Bild ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category & SKU */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-sage/20 text-sage">
                {getCategoryName(product.category)}
              </Badge>
              {product.sku && (
                <span className="text-sm text-charcoal/70">Art.-Nr.: {product.sku}</span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-forest" data-testid="product-title">
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-3xl font-bold text-charcoal" data-testid="product-price">
              {formatPrice(product.price)}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Auf Lager</span>
                  {product.stockQuantity && product.stockQuantity <= 5 && (
                    <span className="text-orange-600 text-sm">
                      (Nur noch {product.stockQuantity} verfügbar)
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Ausverkauft</span>
                </>
              )}
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock || isInCart}
              size="lg"
              className={`w-full ${
                isInCart 
                  ? "bg-sage/20 text-sage border border-sage hover:bg-sage/30" 
                  : "bg-forest hover:bg-forest/80 text-cream"
              } disabled:bg-gray-300 disabled:text-gray-500`}
              data-testid="button-add-to-cart"
            >
              {isInCart ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Hinzugefügt
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {product.inStock ? "In den Warenkorb" : "Ausverkauft"}
                </>
              )}
            </Button>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Merkliste
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share className="w-4 h-4 mr-2" />
                Teilen
              </Button>
            </div>

            <Separator />

            {/* Product Description */}
            <div>
              <h3 className="font-semibold text-lg text-forest mb-3">Beschreibung</h3>
              <p className="text-charcoal leading-relaxed" data-testid="product-description">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-forest">Produktdetails</h3>
              <div className="grid grid-cols-1 gap-3">
                {product.material && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-charcoal">Material:</span>
                    <span className="text-charcoal/80">{product.material}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-charcoal">Abmessungen:</span>
                    <span className="text-charcoal/80">{product.dimensions}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-charcoal">Gewicht:</span>
                    <span className="text-charcoal/80">{product.weight}</span>
                  </div>
                )}
                {product.artisan && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-charcoal">Handwerker:</span>
                    <span className="text-charcoal/80">{product.artisan}</span>
                  </div>
                )}
                {product.careInstructions && (
                  <div className="py-2">
                    <span className="font-medium text-charcoal block mb-1">Pflegehinweise:</span>
                    <span className="text-charcoal/80">{product.careInstructions}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg text-forest mb-3">Eigenschaften</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sage border-sage">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Shipping & Service Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-charcoal/80">
                <Truck className="w-5 h-5 text-sage" />
                <span>Kostenlose Lieferung ab CHF 50</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-charcoal/80">
                <Shield className="w-5 h-5 text-sage" />
                <span>30 Tage Rückgaberecht</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-charcoal/80">
                <Clock className="w-5 h-5 text-sage" />
                <span>Handgefertigt - Lieferzeit 3-5 Werktage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;