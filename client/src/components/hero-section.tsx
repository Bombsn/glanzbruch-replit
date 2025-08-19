import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  HandHeart,
  ChevronDown,
} from "lucide-react";
import { Leaf, TreePine, Flower } from 'lucide-react';
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTypewriter } from "@/hooks/use-typewriter";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import type { GalleryImage } from "@shared/schema";

const HeroSection = () => {
  const [scrollX, setScrollX] = useState(0);
  const [targetScrollX, setTargetScrollX] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(1);

  // Fetch gallery images for random selection
  const { data: galleryImages = [] } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
  });

  // Select a random gallery image (stable selection)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (galleryImages.length > 0 && !selectedImage) {
      const randomIndex = Math.floor(Math.random() * galleryImages.length);
      setSelectedImage(galleryImages[randomIndex]);
    }
  }, [galleryImages, selectedImage]);

  // Typewriter effect for the brand story section
  const { elementRef: brandStoryRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.5, // Trigger when 50% of the section is visible (centered)
    rootMargin: '0px'
  });

  const { displayText, isComplete } = useTypewriter({
    text: "Finde dein ganz persönliches Stück Ewigkeit.",
    speed: 80,
    startDelay: 300,
    trigger: hasIntersected
  });

  useEffect(() => {
    const handleScroll = () => {
      setTargetScrollX(window.scrollY * 0.3); // Convert vertical scroll to horizontal movement
      
      // Fade out when approaching 2nd section (around viewport height)
      const fadeStartPoint = window.innerHeight * 0.8; // Start fading at 80% of viewport
      const fadeEndPoint = window.innerHeight * 1.2; // Fully faded at 120% of viewport
      
      if (window.scrollY < fadeStartPoint) {
        setFadeOpacity(1);
      } else if (window.scrollY > fadeEndPoint) {
        setFadeOpacity(0);
      } else {
        // Calculate fade between start and end points
        const fadeProgress = (window.scrollY - fadeStartPoint) / (fadeEndPoint - fadeStartPoint);
        setFadeOpacity(1 - fadeProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const acceleration = 0.05; // How fast it starts moving
    const friction = 1.1; // How fast it slows down (car-like)
    const maxVelocity = 2; // Maximum speed
    let animationId: number;
    
    const animateMovement = () => {
      setScrollX(prevScrollX => {
        setVelocity(prevVelocity => {
          const diff = targetScrollX - prevScrollX;
          
          // Calculate desired velocity based on distance
          const desiredVelocity = Math.sign(diff) * Math.min(Math.abs(diff) * acceleration, maxVelocity);
          
          // Apply car-like physics: accelerate towards desired velocity, then apply friction
          let newVelocity = prevVelocity + (desiredVelocity - prevVelocity) * 0.1;
          newVelocity *= friction; // Apply friction for smooth stopping
          
          // Stop very small movements
          if (Math.abs(newVelocity) < 0.01) newVelocity = 0;
          
          return newVelocity;
        });
        
        return prevScrollX + velocity;
      });
      
      // Continue animation loop
      animationId = requestAnimationFrame(animateMovement);
    };

    // Start animation loop
    animationId = requestAnimationFrame(animateMovement);
    return () => cancelAnimationFrame(animationId);
  }, [targetScrollX, velocity]);

  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest via-sage to-forest/80"></div>
      
      {/* Floating Nature & Jewelry Icons */}
      <div className="fixed inset-0 overflow-visible z-20 pointer-events-none transition-opacity duration-500" style={{opacity: fadeOpacity}}>
        {/* Icons arranged around the center/title area */}
        <div className="absolute inset-0">
          {/* Icons around title - top area */}
          <div className="absolute opacity-40" style={{top: `calc(25% + ${Math.sin(scrollX * 0.01) * 20}px)`, left: `calc(20% + ${scrollX * 0.8}px)`}}>
            <Leaf className="w-20 h-20 text-forest opacity-50" />
          </div>
          <div className="absolute opacity-35" style={{top: `calc(15% + ${Math.cos(scrollX * 0.015) * 15}px)`, left: `calc(75% + ${scrollX * 1.2}px)`}}>
            <TreePine className="w-16 h-16 text-sage opacity-50" />
          </div>
          <div className="absolute opacity-30" style={{top: `calc(35% + ${Math.sin(scrollX * 0.008) * 25}px)`, left: `calc(85% + ${scrollX * 0.6}px)`}}>
            <Flower className="w-18 h-18 text-forest opacity-50" />
          </div>
          <div className="absolute opacity-25" style={{top: `calc(20% + ${Math.cos(scrollX * 0.012) * 18}px)`, left: `calc(10% + ${scrollX * 1.0}px)`}}>
            <Leaf className="w-14 h-14 text-sage opacity-50" />
          </div>
          <div className="absolute opacity-20" style={{top: `calc(40% + ${Math.sin(scrollX * 0.009) * 22}px)`, left: `calc(90% + ${scrollX * 0.9}px)`}}>
            <TreePine className="w-12 h-12 text-forest opacity-50" />
          </div>
          
          {/* Icons around title - middle area */}
          <div className="absolute opacity-35" style={{top: `calc(45% + ${Math.cos(scrollX * 0.011) * 30}px)`, left: `calc(15% + ${scrollX * 1.1}px)`}}>
            <Flower className="w-22 h-22 text-forest opacity-50" />
          </div>
          <div className="absolute opacity-30" style={{top: `calc(50% + ${Math.sin(scrollX * 0.007) * 28}px)`, left: `calc(80% + ${scrollX * 0.7}px)`}}>
            <Leaf className="w-18 h-18 text-sage opacity-50" />
          </div>
          <div className="absolute opacity-25" style={{top: `calc(55% + ${Math.cos(scrollX * 0.013) * 24}px)`, left: `calc(5% + ${scrollX * 1.3}px)`}}>
            <TreePine className="w-16 h-16 text-forest opacity-50" />
          </div>
          <div className="absolute opacity-20" style={{top: `calc(48% + ${Math.sin(scrollX * 0.014) * 26}px)`, left: `calc(92% + ${scrollX * 0.8}px)`}}>
            <Flower className="w-14 h-14 text-sage opacity-50" />
          </div>
          
          {/* Icons around title - bottom area */}
          <div className="absolute opacity-30" style={{top: `calc(65% + ${Math.sin(scrollX * 0.009) * 32}px)`, left: `calc(25% + ${scrollX * 0.9}px)`}}>
            <TreePine className="w-18 h-18 text-forest opacity-50" />
          </div>
          <div className="absolute opacity-25" style={{top: `calc(70% + ${Math.cos(scrollX * 0.016) * 28}px)`, left: `calc(70% + ${scrollX * 1.4}px)`}}>
            <Flower className="w-16 h-16 text-sage opacity-50" />
          </div>
          <div className="absolute opacity-20" style={{top: `calc(75% + ${Math.sin(scrollX * 0.006) * 24}px)`, left: `calc(85% + ${scrollX * 0.6}px)`}}>
            <Leaf className="w-14 h-14 text-forest opacity-50" />
          </div>
          <div className="absolute opacity-15" style={{top: `calc(72% + ${Math.cos(scrollX * 0.010) * 20}px)`, left: `calc(12% + ${scrollX * 1.1}px)`}}>
            <TreePine className="w-12 h-12 text-sage opacity-50" />
          </div>
          <div className="absolute opacity-18" style={{top: `calc(78% + ${Math.sin(scrollX * 0.012) * 26}px)`, left: `calc(60% + ${scrollX * 0.8}px)`}}>
            <Flower className="w-10 h-10 text-forest opacity-50" />
          </div>
          
          {/* Additional icons around title perimeter */}
          <div className="absolute opacity-22" style={{top: `calc(58% + ${Math.cos(scrollX * 0.010) * 30}px)`, left: `calc(40% + ${scrollX * 1.0}px)`}}>
            <Leaf className="w-16 h-16 text-forest opacity-50" />
          </div>
          <div className="absolute opacity-18" style={{top: `calc(30% + ${Math.sin(scrollX * 0.007) * 22}px)`, left: `calc(65% + ${scrollX * 0.7}px)`}}>
            <Flower className="w-14 h-14 text-sage opacity-50" />
          </div>
          <div className="absolute opacity-15" style={{top: `calc(60% + ${Math.cos(scrollX * 0.012) * 28}px)`, left: `calc(95% + ${scrollX * 1.2}px)`}}>
            <TreePine className="w-12 h-12 text-forest opacity-50" />
          </div>
          <div className="absolute opacity-12" style={{top: `calc(38% + ${Math.sin(scrollX * 0.009) * 18}px)`, left: `calc(3% + ${scrollX * 0.9}px)`}}>
            <Leaf className="w-10 h-10 text-sage opacity-50" />
          </div>
          <div className="absolute opacity-10" style={{top: `calc(82% + ${Math.cos(scrollX * 0.008) * 16}px)`, left: `calc(45% + ${scrollX * 1.3}px)`}}>
            <Flower className="w-8 h-8 text-forest opacity-50" />
          </div>
          <div className="absolute opacity-8" style={{top: `calc(10% + ${Math.sin(scrollX * 0.011) * 14}px)`, left: `calc(50% + ${scrollX * 0.8}px)`}}>
            <TreePine className="w-8 h-8 text-sage opacity-50" />
          </div>
        </div>

        {/* Floating particles around title area */}
        <div className="absolute w-2 h-2 bg-gold/60 rounded-full animate-ping transition-opacity duration-500" style={{top: `calc(28% + ${Math.sin(scrollX * 0.005) * 12}px)`, left: `calc(35% + ${scrollX * 0.5}px)`, animationDelay: '4s', opacity: fadeOpacity}}></div>
        <div className="absolute w-1 h-1 bg-cream/80 rounded-full animate-ping transition-opacity duration-500" style={{top: `calc(68% + ${Math.cos(scrollX * 0.008) * 10}px)`, left: `calc(55% + ${scrollX * 0.3}px)`, animationDelay: '4.5s', opacity: fadeOpacity}}></div>
        <div className="absolute w-1.5 h-1.5 bg-gold/70 rounded-full animate-ping transition-opacity duration-500" style={{top: `calc(42% + ${Math.sin(scrollX * 0.006) * 14}px)`, left: `calc(75% + ${scrollX * 0.7}px)`, animationDelay: '5s', opacity: fadeOpacity}}></div>
        <div className="absolute w-1 h-1 bg-sage/60 rounded-full animate-ping transition-opacity duration-500" style={{top: `calc(52% + ${Math.cos(scrollX * 0.007) * 8}px)`, left: `calc(25% + ${scrollX * 0.4}px)`, animationDelay: '5.5s', opacity: fadeOpacity}}></div>
        <div className="absolute w-1.5 h-1.5 bg-cream/50 rounded-full animate-ping transition-opacity duration-500" style={{top: `calc(22% + ${Math.sin(scrollX * 0.009) * 16}px)`, left: `calc(45% + ${scrollX * 0.6}px)`, animationDelay: '6s', opacity: fadeOpacity}}></div>
      </div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
        {/* Modern Typography */}
        <div className="mb-8">
          <h1 className="font-logo text-5xl md:text-7xl lg:text-8xl text-white mb-4 leading-tight tracking-tight">
            <span className="block">Wald- und</span>
            <span className="block text-forest">Wiesenschmuck</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-forest to-sage mx-auto rounded-full"></div>
        </div>

        <p className="text-xl md:text-2xl text-cream/90 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
          Wo die Magie der Natur in <span className="text-forest font-medium">einzigartigen Schmuckstücken</span> lebt
        </p>

        {/* Modern Button Design */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link href="/shop">
            <Button
              className="group bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-white px-10 py-5 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-gold/25 border-0"
              data-testid="button-shop-discover"
            >
              <ShoppingBag className="mr-3 w-5 h-5 transition-transform group-hover:scale-110" />
              Shop entdecken
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </Link>
          <Link href="/kurse">
            <Button
              variant="outline"
              className="group border-2 border-white/80 text-white hover:bg-white hover:text-forest px-10 py-5 rounded-2xl font-semibold transition-all duration-500 backdrop-blur-sm bg-white/10"
              data-testid="button-book-courses"
            >
              <HandHeart className="mr-3 w-5 h-5 transition-transform group-hover:scale-110" />
              Kurse buchen
            </Button>
          </Link>
        </div>

      </div>

      {/* Modern Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80">
        <div className="flex flex-col items-center animate-bounce">
          <span className="text-sm mb-2 font-medium">Entdecken</span>
          <ChevronDown className="w-6 h-6" />
        </div>
      </div>
    </section>

      {/* Brand Story Section - 100vh with Typewriter Effect */}
      <section 
        ref={brandStoryRef}
        className="min-h-screen bg-white relative z-10 flex items-center justify-center overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Text Content */}
            <div className="mb-12">
              <p className="font-logo text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-gold text-wrap-pretty leading-tight">
                {displayText}
              </p>
            </div>
            
            {/* Gallery Image */}
            <div className="flex justify-center">
              {selectedImage && (
                <div 
                  className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-1000 transform ${
                    isComplete 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: isComplete ? '500ms' : '0ms'
                  }}
                >
                  <img
                    src={selectedImage.imageUrl.startsWith('/objects/') 
                      ? selectedImage.imageUrl 
                      : selectedImage.imageUrl}
                    alt={selectedImage.altText}
                    className="w-full h-auto max-w-lg max-h-[500px] object-cover rounded-2xl"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
