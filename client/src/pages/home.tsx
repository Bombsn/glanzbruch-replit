import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Check,
  Calendar,
  CalendarPlus,
  NotebookPen,
  Heart,
  Star,
} from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import ProductCard from "@/components/product-card";
import CourseInstanceCard from "@/components/course-instance-card";
import HeroSection from "@/components/hero-section";
import type { Product, CourseType, CourseWithType } from "@shared/schema";

const Home = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products/random", 3],
  });

  const { data: courseTypes = [] } = useQuery<CourseType[]>({
    queryKey: ["/api/course-types"],
  });

  const { data: upcomingCourses = [] } = useQuery<CourseWithType[]>({
    queryKey: ["/api/courses"],
  });

  const newsletterMutation = useMutation({
    mutationFn: (email: string) =>
      apiRequest("/api/newsletter", "POST", { email }),
    onSuccess: () => {
      toast({
        title: "Erfolgreich angemeldet!",
        description: "Vielen Dank für Ihre Newsletter-Anmeldung!",
      });
      setEmail("");
    },
    onError: () => {
      toast({
        title: "Fehler",
        description:
          "Die Newsletter-Anmeldung konnte nicht verarbeitet werden.",
        variant: "destructive",
      });
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    newsletterMutation.mutate(email);
  };

  const featuredProducts = products;
  const featuredCourseType = courseTypes[0];
  const nextCourse = upcomingCourses[0]; // Get the next available course

  return (
    <div className="min-h-screen">
      {/* Hero Section with integrated Brand Story */}
      <HeroSection />
      {/* Featured Products */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="font-heading text-3xl md:text-4xl font-bold text-forest mb-4"
              data-testid="heading-fairy-jewelry"
            >
              Märchenhafte Schmuck-Unikate
            </h2>
            <p className="text-lg text-charcoal max-w-3xl mx-auto">
              In meinem Atelier entstehen Schmuckstücke, die die Magie der Natur
              und das Geheimnisvolle des Waldes in sich tragen. Jede Kreation
              aus Kunstharz, Silber und Bronze ist ein einzigartiges Unikat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button
                className="bg-forest hover:bg-forest/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
                data-testid="button-view-all-products"
              >
                Alle Produkte anzeigen
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Courses Section */}
      {featuredCourseType && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <img
                  src={featuredCourseType.imageUrl}
                  alt={featuredCourseType.name}
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
              <div>
                <h2
                  className="font-heading text-3xl md:text-4xl font-bold text-forest mb-6"
                  data-testid="heading-courses"
                >
                  Kreativkurse
                </h2>
                <p className="text-lg text-charcoal mb-6 leading-relaxed">
                  <strong>Dein Einstieg in die Welt des UV-Resins</strong>
                </p>
                <p className="text-charcoal mb-8 leading-relaxed">
                  Entdecke die Kunst des Schmuckdesigns mit UV-Resin! In meinen
                  Kursen erlernst du die Grundlagen des Kunstharz-Giessens und
                  gestaltest dein eigenes Schmuckstück - von der ersten Idee bis
                  zur fertigen Kreation.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center">
                      <Check className="text-sage w-4 h-4" />
                    </div>
                    <span className="text-charcoal">
                      Grundlagen des UV-Resin Giessens
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center">
                      <Check className="text-sage w-4 h-4" />
                    </div>
                    <span className="text-charcoal">
                      Persönliche Betreuung in kleinen Gruppen
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center">
                      <Check className="text-sage w-4 h-4" />
                    </div>
                    <span className="text-charcoal">
                      Alle Materialien inklusive
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center">
                      <Check className="text-sage w-4 h-4" />
                    </div>
                    <span className="text-charcoal">
                      Eigenes Schmuckstück mitnehmen
                    </span>
                  </div>
                </div>
              </div>
            </div>

          {/* Next Available Course */}
          {nextCourse ? (
            <div className="mb-8">
              <h3 className="font-heading text-2xl font-bold text-forest mb-6 text-center">
                Nächster verfügbarer Kurs
              </h3>
              <div className="max-w-4xl mx-auto">
                <CourseInstanceCard course={nextCourse} />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-sage/10 rounded-xl mb-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-charcoal mb-2">Momentan keine Kurse verfügbar</h3>
              <p className="text-charcoal/70">
                Neue Kurstermine werden bald bekannt gegeben. Melden Sie sich für unseren Newsletter an.
              </p>
            </div>
          )}

            {/* All Courses Button */}
            <div className="text-center">
              <Link href="/kurse">
                <Button
                  className="bg-gold hover:bg-gold/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
                  data-testid="button-view-all-courses"
                >
                  <CalendarPlus className="mr-2 w-5 h-5" />
                  Alle Kurse anzeigen
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
      {/* Special Commissions */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="font-heading text-3xl md:text-4xl font-bold text-forest mb-6"
                data-testid="heading-memorial-jewelry"
              >
                Einzigartige Andenken für die Ewigkeit
              </h2>
              <p className="text-lg text-charcoal mb-6 leading-relaxed">
                Bewahre die Erinnerungen an deine Liebsten mit individuell
                gefertigten Schmuckstücken.
              </p>
              <p className="text-charcoal mb-8 leading-relaxed">
                Ob Haare, Asche oder andere wertvolle Erinnerungen - ich fange
                sie in Kunstharz ein und verwandle sie in ein besonderes
                Andenken, das dir für immer nah ist. Diese Spezialanfertigungen
                sind mehr als Schmuck, sie sind ein bleibendes Stück Ewigkeit.
              </p>

              <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
                <h3 className="font-heading text-xl font-semibold text-forest mb-4">
                  So funktioniert's:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gold text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                      1
                    </div>
                    <span className="text-charcoal">
                      Beratungsgespräch über deine Wünsche
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gold text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                      2
                    </div>
                    <span className="text-charcoal">
                      Entwurf und Materialauswahl
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gold text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                      3
                    </div>
                    <span className="text-charcoal">
                      Handwerkliche Umsetzung in meinem Atelier
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gold text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                      4
                    </div>
                    <span className="text-charcoal">
                      Dein einzigartiges Erinnerungsstück
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/kontakt?tab=sonderanfertigung">
                <Button
                  className="bg-forest hover:bg-forest/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
                  data-testid="button-request-commission"
                >
                  <Heart className="mr-2 w-5 h-5" />
                  Sonderanfertigung anfragen
                </Button>
              </Link>
            </div>
            <div>
              <img
                src="https://image.jimcdn.com/app/cms/image/transf/dimension=291x10000:format=jpg/path/s10438f9ff8ed1fb7/image/i378ddb1d01bccea0/version/1730743780/image.jpg"
                alt="Sonderanfertigungen Erinnerungsschmuck"
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="font-heading text-3xl md:text-4xl font-bold text-forest mb-4"
              data-testid="heading-testimonials"
            >
              Was unsere Kunden sagen
            </h2>
            <p className="text-lg text-charcoal">
              Authentische Erfahrungen mit Glanzbruch-Schmuck
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-cream rounded-lg p-6 shadow-sm">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-charcoal mb-4 italic">
                  "Mein Anhänger mit den getrockneten Blüten ist einfach
                  wunderschön. Jedes Mal, wenn ich ihn trage, erinnert er mich
                  an unseren Hochzeitstag im Wald."
                </p>
                <div className="font-semibold text-forest">Sarah M.</div>
              </CardContent>
            </Card>

            <Card className="bg-cream rounded-lg p-6 shadow-sm">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-charcoal mb-4 italic">
                  "Der UV-Resin Kurs war fantastisch! Ich konnte mein eigenes
                  Schmuckstück kreieren und habe so viel gelernt. Sehr
                  empfehlenswert!"
                </p>
                <div className="font-semibold text-forest">Michael K.</div>
              </CardContent>
            </Card>

            <Card className="bg-cream rounded-lg p-6 shadow-sm">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-charcoal mb-4 italic">
                  "Die Sonderanfertigung mit den Haaren meiner verstorbenen
                  Katze ist ein wahrer Schatz. Vielen Dank für die einfühlsame
                  Beratung."
                </p>
                <div className="font-semibold text-forest">Anna L.</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-forest to-sage">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2
              className="font-heading text-3xl md:text-4xl font-bold text-white mb-4"
              data-testid="heading-newsletter"
            >
              Bleib in Verbindung
            </h2>
            <p className="text-cream mb-8 text-lg">
              Erfahre als Erste von neuen Kreationen, Kurs-Terminen und
              besonderen Angeboten.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Deine E-Mail-Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white"
                required
                data-testid="input-newsletter-email"
              />
              <Button
                type="submit"
                disabled={newsletterMutation.isPending}
                className="bg-gold hover:bg-gold/90 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
                data-testid="button-newsletter-submit"
              >
                <NotebookPen className="mr-2 w-4 h-4" />
                {newsletterMutation.isPending ? "Wird gesendet..." : "Anmelden"}
              </Button>
            </form>

            <p className="text-cream/80 text-sm mt-4">
              Keine Sorge, wir spammen nicht. Du kannst dich jederzeit wieder
              abmelden.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
