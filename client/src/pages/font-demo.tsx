import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FontDemo = () => {
  const fonts = [
    { name: "Great Vibes", class: "font-['Great_Vibes']", description: "Fließende, elegante Kalligrafie" },
    { name: "Allura", class: "font-['Allura']", description: "Klassische, raffinierte Kalligrafie" },
    { name: "Alex Brush", class: "font-['Alex_Brush']", description: "Schwungvolle Pinselschrift" },
    { name: "Dancing Script", class: "font-['Dancing_Script']", description: "Moderne, lebendige Kalligrafie" },
    { name: "Sacramento", class: "font-['Sacramento']", description: "1950er-inspirierte Schrift" },
  ];

  const applyFont = (fontClass: string) => {
    // Update CSS variable
    document.documentElement.style.setProperty('--font-logo', fontClass.replace("font-['", "").replace("']", ""));
    
    // Show confirmation
    alert(`Schriftart wurde aktualisiert! Schauen Sie sich das Logo im Header an.`);
  };

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-forest mb-4">
            Schriftarten-Demo für Glanzbruch Logo
          </h1>
          <p className="text-lg text-charcoal max-w-3xl mx-auto">
            Probieren Sie verschiedene elegante Kalligrafie-Schriften für das Glanzbruch-Logo aus.
            Klicken Sie auf "Anwenden" um die Schrift zu testen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fonts.map((font) => (
            <Card key={font.name} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-forest mb-4">{font.name}</CardTitle>
                <div className={`${font.class} text-4xl text-forest mb-4`} style={{ fontSize: '3rem' }}>
                  Glanzbruch
                </div>
                <p className="text-sm text-charcoal/70">{font.description}</p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => applyFont(font.class)}
                  className="bg-forest hover:bg-forest/90 text-white"
                >
                  Diese Schrift anwenden
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-forest">Aktuelle Logo-Schrift</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-logo text-5xl text-forest mb-4">Glanzbruch</div>
              <p className="text-charcoal/70">
                So sieht das Logo aktuell aus. Testen Sie verschiedene Schriften und 
                schauen Sie sich das Logo im Header an.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="border-forest text-forest hover:bg-forest hover:text-white"
          >
            Zurück zur Startseite
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FontDemo;