import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWishlistStore, useCartStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const Wishlist = () => {
  const { items, isOpen, toggleWishlist, removeItem, moveToCart } = useWishlistStore();
  const cartStore = useCartStore();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return `CHF ${price.toFixed(2)}`;
  };

  const handleMoveToCart = (id: string) => {
    moveToCart(id, cartStore);
    toast({
      title: "In den Warenkorb verschoben",
      description: "Das Produkt wurde von der Merkliste in den Warenkorb verschoben.",
    });
  };

  const handleRemoveFromWishlist = (id: string, name: string) => {
    removeItem(id);
    toast({
      title: "Von Merkliste entfernt",
      description: `${name} wurde von Ihrer Merkliste entfernt.`,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleWishlist}>
      <SheetContent className="w-[400px] sm:w-[900px] lg:w-[1000px]">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl text-forest flex items-center">
            <Heart className="w-5 h-5 mr-2 text-gold" />
            Merkliste
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Wishlist Items */}
          <div className="flex-1 overflow-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Heart className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-charcoal mb-2">Ihre Merkliste ist leer</p>
                <p className="text-sm text-charcoal/60">Speichern Sie Produkte, um sie später zu vergleichen</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Link href={`/produkt/${item.id}`} onClick={toggleWishlist} className="flex items-center space-x-4 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-charcoal truncate hover:text-forest transition-colors">{item.name}</h4>
                        <p className="text-sm text-gold font-semibold">{formatPrice(item.price)}</p>
                      </div>
                    </Link>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-forest hover:text-forest/80"
                        onClick={() => handleMoveToCart(item.id)}
                        data-testid={`button-move-to-cart-${item.id}`}
                        title="In den Warenkorb"
                      >
                        <ShoppingCart className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                        data-testid={`button-remove-wishlist-${item.id}`}
                        title="Von Merkliste entfernen"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Actions */}
          {items.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-charcoal">Gespeicherte Artikel:</span>
                  <span className="font-semibold text-forest text-lg" data-testid="wishlist-count">
                    {items.length}
                  </span>
                </div>
                <Button 
                  onClick={() => {
                    items.forEach(item => handleMoveToCart(item.id));
                  }}
                  className="w-full bg-forest hover:bg-forest/90 text-white h-8 font-semibold"
                  data-testid="button-move-all-to-cart"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Alle in den Warenkorb
                </Button>
                <p className="text-xs text-charcoal/60 text-center">
                  Vergleichen Sie Ihre Lieblingsstücke und fügen Sie sie bei Bedarf zum Warenkorb hinzu
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Wishlist;
