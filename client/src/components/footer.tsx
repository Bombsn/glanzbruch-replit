import { Link } from "wouter";
import { Gem, Mail, Phone, MapPin } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-gold to-sage rounded-full flex items-center justify-center">
                <Gem className="text-white w-4 h-4" />
              </div>
              <span className="font-logo text-2xl">Glanzbruch</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Zauberhafte Schmuckstücke aus der Natur. Handgefertigt mit Liebe und Sorgfalt in der Schweiz.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold mb-4">Onlineshop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop?category=kettenanhanger" className="text-gray-300 hover:text-gold transition-colors" data-testid="footer-link-kettenanhanger">
                  Kettenanhänger
                </Link>
              </li>
              <li>
                <Link href="/shop?category=ohrringe" className="text-gray-300 hover:text-gold transition-colors" data-testid="footer-link-ohrringe">
                  Ohrringe
                </Link>
              </li>
              <li>
                <Link href="/shop?category=fingerringe" className="text-gray-300 hover:text-gold transition-colors" data-testid="footer-link-fingerringe">
                  Fingerringe
                </Link>
              </li>
              <li>
                <Link href="/shop?category=armbander" className="text-gray-300 hover:text-gold transition-colors" data-testid="footer-link-armbander">
                  Armbänder
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sonderanfertigungen" className="text-gray-300 hover:text-gold transition-colors" data-testid="footer-link-sonderanfertigungen">
                  Sonderanfertigungen
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Links */}
          <div>
            <h3 className="font-semibold mb-4">Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/kurse" className="text-gray-300 hover:text-gold transition-colors" data-testid="footer-link-kurse">
                  Kurse
                </Link>
              </li>
              <li>
                <Link href="/ueber-mich" className="text-gray-300 hover:text-gold transition-colors" data-testid="footer-link-ueber-mich">
                  Über mich
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-300 hover:text-gold transition-colors" data-testid="footer-link-kontakt">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="text-gray-300 hover:text-gold transition-colors" data-testid="footer-link-galerie">
                  Galerie
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@glanzbruch.ch</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+41 78 XXX XX XX</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Schweiz</span>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gold transition-colors"
                data-testid="social-instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gold transition-colors"
                data-testid="social-facebook"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Glanzbruch. Alle Rechte vorbehalten.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" data-testid="footer-link-impressum">
                Impressum
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" data-testid="footer-link-datenschutz">
                Datenschutz
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" data-testid="footer-link-agb">
                AGB
              </a>
              <a 
                href="https://www.glanzbruch.ch/j/shop/deliveryinfo" 
                className="text-gray-400 hover:text-gold transition-colors"
                data-testid="footer-link-lieferbedingungen"
              >
                Liefer- und Zahlungsbedingungen
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
