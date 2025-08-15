import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = () => {
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

  return (
    <Card className="group cursor-pointer overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative">
        <img
          src={product.imageUrls[0]}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`product-image-${product.id}`}
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Ausverkauft
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="mb-2">
          <span className="text-xs text-sage font-medium uppercase tracking-wide">
            {getCategoryName(product.category)}
          </span>
        </div>
        
        <h3 className="font-heading text-xl font-semibold text-forest mb-2" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        
        <p className="text-charcoal/70 text-sm mb-4 line-clamp-2" data-testid={`product-description-${product.id}`}>
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-gold font-semibold text-lg" data-testid={`product-price-${product.id}`}>
            {formatPrice(product.price)}
          </span>
          <ArrowRight className="text-sage w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
        
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full mt-4 bg-forest hover:bg-forest/90 text-white"
          data-testid={`button-add-to-cart-${product.id}`}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          {product.inStock ? "In den Warenkorb" : "Ausverkauft"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
