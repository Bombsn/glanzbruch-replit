import { Card, CardContent } from "@/components/ui/card";
import { Heart, Leaf, Sparkles, Award, Clock, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-forest mb-6" data-testid="heading-about">
            Über mich
          </h1>
          <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
            Hinter Glanzbruch steht die Leidenschaft für die Schönheit der Natur und die Liebe zum handwerklichen Schaffen. 
            Lassen Sie mich Ihnen meine Geschichte erzählen.
          </p>
        </div>

        {/* Personal Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Schmuckdesignerin bei der Arbeit in ihrem Atelier"
              className="rounded-xl shadow-lg w-full"
              data-testid="image-artisan-portrait"
            />
          </div>
          <div>
            <h2 className="font-playfair text-3xl font-bold text-forest mb-6" data-testid="heading-my-story">
              Meine Geschichte
            </h2>
            <div className="space-y-4 text-charcoal leading-relaxed">
              <p>
                Schon als Kind war ich fasziniert von den kleinen Wundern der Natur – von zarten Blütenblättern, 
                die wie Seide schimmerten, bis hin zu mystischen Mooslandschaften im Wald. Diese Faszination 
                begleitet mich bis heute und ist zur Seele meiner Arbeit geworden.
              </p>
              <p>
                Nach meiner Ausbildung zur Goldschmiedin entdeckte ich die Möglichkeiten von UV-Resin und war 
                sofort begeistert. Endlich konnte ich die vergängliche Schönheit der Natur für die Ewigkeit 
                konservieren und in tragbare Kunstwerke verwandeln.
              </p>
              <p>
                In meinem Atelier entstehen seitdem Schmuckstücke, die Geschichten erzählen – Geschichten von 
                besonderen Momenten, geliebten Menschen und der unendlichen Kreativität der Natur. Jedes Stück 
                ist ein Unikat, so einzigartig wie die Erinnerungen, die es bewahrt.
              </p>
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="bg-white rounded-xl p-8 mb-16 shadow-sm">
          <h2 className="font-playfair text-3xl font-bold text-forest mb-8 text-center" data-testid="heading-philosophy">
            Meine Philosophie
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-sage" />
              </div>
              <h3 className="font-semibold text-forest mb-3">Mit Liebe gefertigt</h3>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                Jedes Schmuckstück entsteht mit größter Sorgfalt und Aufmerksamkeit für Details. 
                Die Liebe zum Handwerk spiegelt sich in jedem fertigen Werk wider.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-sage" />
              </div>
              <h3 className="font-semibold text-forest mb-3">Natur als Inspiration</h3>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                Die Natur ist meine größte Lehrmeisterin. Ihre Formen, Farben und Strukturen 
                fließen in jede Kreation ein und machen sie zu etwas Besonderem.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-sage" />
              </div>
              <h3 className="font-semibold text-forest mb-3">Einzigartige Unikate</h3>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                Massenproduktion gibt es bei mir nicht. Jedes Stück ist ein handgefertigtes Unikat 
                mit seiner eigenen Persönlichkeit und Geschichte.
              </p>
            </div>
          </div>
        </div>

        {/* Skills & Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="font-playfair text-3xl font-bold text-forest mb-6" data-testid="heading-skills">
              Mein Handwerk
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Award className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-forest mb-2">Goldschmiedin</h3>
                  <p className="text-sm text-charcoal/70">
                    Ausbildung zur Goldschmiedin mit Spezialisierung auf individuelle Schmuckkreationen 
                    und traditionelle Handwerkstechniken.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-forest mb-2">UV-Resin Spezialistin</h3>
                  <p className="text-sm text-charcoal/70">
                    Fortbildungen in UV-Resin Techniken und experimentelle Ansätze zur Kombination 
                    von Naturmaterialien mit modernen Kunstharzen.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-forest mb-2">Erinnerungsschmuck</h3>
                  <p className="text-sm text-charcoal/70">
                    Spezialisierung auf einfühlsame Beratung und Fertigung von Erinnerungsschmuck 
                    mit persönlichen Elementen wie Haaren oder Asche.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="font-playfair text-3xl font-bold text-forest mb-6" data-testid="heading-experience">
              Erfahrung & Werte
            </h2>
            
            <div className="space-y-6">
              <Card className="bg-sage/10 border-none">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Clock className="w-5 h-5 text-sage" />
                    <span className="font-semibold text-forest">Über 8 Jahre Erfahrung</span>
                  </div>
                  <p className="text-sm text-charcoal/70">
                    Seit 2016 fertige ich Schmuckstücke und habe seitdem hunderte von 
                    einzigartigen Kreationen geschaffen.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-sage/10 border-none">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Users className="w-5 h-5 text-sage" />
                    <span className="font-semibold text-forest">Persönliche Betreuung</span>
                  </div>
                  <p className="text-sm text-charcoal/70">
                    Jeder Kunde ist bei mir einzigartig. Ich nehme mir die Zeit für ausführliche 
                    Beratungen und individuelle Wünsche.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-sage/10 border-none">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Leaf className="w-5 h-5 text-sage" />
                    <span className="font-semibold text-forest">Nachhaltigkeit</span>
                  </div>
                  <p className="text-sm text-charcoal/70">
                    Ich verwende nur hochwertige, langlebige Materialien und achte auf 
                    verantwortungsvolle Beschaffung meiner Rohstoffe.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Workshop Section */}
        <div className="bg-forest/5 rounded-xl p-8 text-center">
          <h2 className="font-playfair text-3xl font-bold text-forest mb-6" data-testid="heading-workshop">
            Mein Atelier
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Atelier mit Werkzeugen und Materialien für Schmuckherstellung"
                className="rounded-lg shadow-md w-full"
                data-testid="image-workshop"
              />
            </div>
            <div className="text-left">
              <p className="text-charcoal mb-4 leading-relaxed">
                In meinem lichtdurchfluteten Atelier entstehen alle Schmuckstücke. Hier habe ich mir einen 
                Raum geschaffen, der Kreativität und Präzision gleichermaßen fördert.
              </p>
              <p className="text-charcoal mb-6 leading-relaxed">
                Moderne Ausrüstung trifft auf traditionelle Handwerkstechniken – von der UV-Lampe bis 
                zum klassischen Goldschmiedewerkzeug ist alles vorhanden, was für die Erschaffung 
                einzigartiger Schmuckstücke benötigt wird.
              </p>
              <p className="text-sm text-charcoal/70">
                <strong>Besuche nach Vereinbarung möglich</strong> – gerne zeige ich Ihnen mein Atelier 
                und erkläre die verschiedenen Arbeitsschritte.
              </p>
            </div>
          </div>
        </div>

        {/* Personal Touch */}
        <div className="mt-16 text-center bg-white rounded-xl p-8 shadow-sm">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-playfair text-2xl font-bold text-forest mb-4" data-testid="heading-personal-message">
              Eine persönliche Nachricht
            </h2>
            <p className="text-charcoal italic mb-4 text-lg leading-relaxed">
              "Jedes Schmuckstück, das mein Atelier verlässt, trägt ein Stück meiner Seele in sich. 
              Es ist meine Mission, Ihnen nicht nur ein schönes Accessoire zu schaffen, sondern 
              ein Stück Ewigkeit, das Ihre besonderen Momente und Erinnerungen für immer bewahrt."
            </p>
            <p className="font-dancing text-2xl text-gold">
              Mit herzlichen Grüßen aus dem Atelier
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
