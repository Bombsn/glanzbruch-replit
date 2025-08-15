import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, ChevronDown, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/lib/store";

const Header = () => {
  const [location] = useLocation();
  const { toggleCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);

  const shopCategories = [
    { name: "Kettenanhänger", href: "/shop?category=kettenanhanger" },
    { name: "Ohrringe", href: "/shop?category=ohrringe" },
    { name: "Fingerringe", href: "/shop?category=fingerringe" },
    { name: "Armbänder", href: "/shop?category=armbander" },
    { name: "Sonderanfertigungen", href: "/shop?category=sonderanfertigungen" },
  ];

  const navigationItems = [
    { name: "Willkommen", href: "/" },
    { name: "Shop", href: "/shop", hasDropdown: true },
    { name: "Kurse", href: "/kurse" },
    { name: "Galerie", href: "/galerie" },
    { name: "Über mich", href: "/ueber-mich" },
    { name: "Kontakt", href: "/kontakt" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <div className="w-10 h-10 bg-gradient-to-br from-forest to-sage rounded-full flex items-center justify-center">
              <Gem className="text-gold text-lg" />
            </div>
            <span className="font-heading text-2xl font-bold text-forest">Glanzbruch</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div 
                    className="relative group"
                    onMouseEnter={() => setIsShopDropdownOpen(true)}
                    onMouseLeave={() => setIsShopDropdownOpen(false)}
                  >
                    <Link 
                      href={item.href}
                      className="text-charcoal hover:text-forest transition-colors flex items-center"
                      data-testid={`link-${item.name.toLowerCase()}`}
                    >
                      {item.name} <ChevronDown className="ml-1 w-3 h-3" />
                    </Link>
                    {isShopDropdownOpen && (
                      <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 w-48 border">
                        {shopCategories.map((category) => (
                          <Link
                            key={category.name}
                            href={category.href}
                            className="block px-4 py-2 text-sm hover:bg-cream transition-colors"
                            data-testid={`link-${category.name.toLowerCase()}`}
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-charcoal hover:text-forest transition-colors ${
                      location === item.href ? 'text-forest font-medium' : ''
                    }`}
                    data-testid={`link-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Shopping Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="relative p-2 text-charcoal hover:text-forest"
              data-testid="button-cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden" data-testid="button-mobile-menu">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className={`text-lg font-medium text-charcoal hover:text-forest transition-colors ${
                          location === item.href ? 'text-forest' : ''
                        }`}
                        data-testid={`mobile-link-${item.name.toLowerCase()}`}
                      >
                        {item.name}
                      </Link>
                      {item.hasDropdown && (
                        <div className="ml-4 mt-2 space-y-2">
                          {shopCategories.map((category) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              className="block text-sm text-charcoal/70 hover:text-forest transition-colors"
                              data-testid={`mobile-link-${category.name.toLowerCase()}`}
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
