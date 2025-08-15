import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Plus, Minus, Trash2, CreditCard } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const ShoppingCart = () => {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotal } = useCartStore();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Warenkorb ist leer",
        description: "Fügen Sie Produkte hinzu, bevor Sie zur Kasse gehen.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement Stripe checkout
    toast({
      title: "Checkout",
      description: "Stripe-Integration wird bald verfügbar sein!",
    });
  };

  const formatPrice = (price: number) => {
    return `CHF ${price.toFixed(2)}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl text-forest">Warenkorb</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-charcoal mb-2">Ihr Warenkorb ist leer</p>
                <p className="text-sm text-charcoal/60">Entdecken Sie unsere wunderschönen Schmuckstücke</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-charcoal truncate">{item.name}</h4>
                      <p className="text-sm text-gold font-semibold">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        data-testid={`button-decrease-${item.id}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium" data-testid={`quantity-${item.id}`}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        data-testid={`button-increase-${item.id}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.id)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {items.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-charcoal">Zwischensumme:</span>
                  <span className="font-semibold text-gold text-lg" data-testid="cart-total">
                    {formatPrice(getTotal())}
                  </span>
                </div>
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-gold hover:bg-gold/90 text-white py-3 font-semibold"
                  data-testid="button-checkout"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Zur Kasse
                </Button>
                <p className="text-xs text-charcoal/60 text-center">
                  Sichere Bezahlung mit Stripe
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;
