import { useQuery } from "@tanstack/react-query";
import { Clock, Users, Calendar, Star } from "lucide-react";
import CourseInstanceCard from "../components/course-instance-card";
import type { CourseWithType } from "@shared/schema";

const Courses = () => {
  const { data: courses = [], isLoading } = useQuery<CourseWithType[]>({
    queryKey: ["/api/courses"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest mx-auto"></div>
            <p className="mt-4 text-charcoal">Kurse werden geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest mb-6" data-testid="heading-courses">
            Kreativkurse mit UV-Resin
          </h1>
          <p className="text-xl text-charcoal max-w-4xl mx-auto mb-8 leading-relaxed">
            Entdecke die Kunst des Schmuckdesigns und lerne, wie du mit UV-Resin deine eigenen zauberhaften Schmuckstücke erschaffst. 
            In meinen Kursen vermittle ich dir alle Grundlagen und Techniken, die du brauchst, um deine kreativen Ideen zu verwirklichen.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Clock className="w-8 h-8 text-gold mx-auto mb-4" />
              <h3 className="font-semibold text-forest mb-2">Flexible Termine</h3>
              <p className="text-sm text-charcoal/70">Kurse nach Vereinbarung, auch am Wochenende möglich</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Users className="w-8 h-8 text-gold mx-auto mb-4" />
              <h3 className="font-semibold text-forest mb-2">Kleine Gruppen</h3>
              <p className="text-sm text-charcoal/70">Persönliche Betreuung in kleinen Gruppen bis 6 Personen</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Star className="w-8 h-8 text-gold mx-auto mb-4" />
              <h3 className="font-semibold text-forest mb-2">Alles inklusive</h3>
              <p className="text-sm text-charcoal/70">Materialien, Werkzeuge und persönliche Beratung inklusive</p>
            </div>
          </div>
        </div>

        {/* Course Info Section */}
        <div className="bg-white rounded-xl p-8 mb-16 shadow-sm">
          <h2 className="font-heading text-3xl font-bold text-forest mb-6" data-testid="heading-what-you-learn">
            Was Sie in den Kursen lernen
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-forest mb-4">Grundlagen & Techniken</h3>
              <ul className="space-y-2 text-charcoal">
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  Einführung in UV-Resin und seine Eigenschaften
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  Sicherheit und richtige Handhabung der Materialien
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  Verschiedene Giesstechniken und Formen
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  Farbmischungen und Effekte
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-forest mb-4">Kreative Gestaltung</h3>
              <ul className="space-y-2 text-charcoal">
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  Einarbeiten von Naturmaterialien (Blüten, Blätter)
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  Kombinationen mit Metall (Silber, Bronze)
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  Design-Prinzipien für Schmuckstücke
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  Finishing und Nachbearbeitung
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Available Courses */}
        <div className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-forest mb-8 text-center" data-testid="heading-available-courses">Anstehende Kurse</h2>
          
          {courses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-charcoal mb-2">Momentan keine Kurse verfügbar</h3>
              <p className="text-charcoal/70 mb-6">
                Neue Kurstermine werden bald bekannt gegeben. Melden Sie sich für unseren Newsletter an, 
                um über neue Termine informiert zu werden.
              </p>
            </div>
          ) : (
            <div>
              {courses.map((course, index) => (
                <div key={course.id} className={index > 0 ? "mt-8" : ""}>
                  <CourseInstanceCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Workshop Information */}
        <div className="bg-sage/10 rounded-xl p-8">
          <h2 className="font-heading text-3xl font-bold text-forest mb-6 text-center" data-testid="heading-workshop-info">
            Informationen zu den Workshops
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-forest mb-4">Wichtige Hinweise</h3>
              <ul className="space-y-2 text-charcoal text-sm">
                <li>• Mindestalter: 16 Jahre (bei Minderjährigen ist eine Einverständniserklärung der Eltern erforderlich)</li>
                <li>• Bitte tragen Sie geschlossene Schuhe und Kleidung, die schmutzig werden darf</li>
                <li>• Schwangere Frauen können leider nicht teilnehmen</li>
                <li>• Bei Allergien gegen Kunstharze bitte vorher Rücksprache halten</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-forest mb-4">Im Kurs enthalten</h3>
              <ul className="space-y-2 text-charcoal text-sm">
                <li>• Alle benötigten Materialien und Werkzeuge</li>
                <li>• Persönliche Schutzausrüstung</li>
                <li>• Professionelle Anleitung und Betreuung</li>
                <li>• Ihre fertigen Schmuckstücke zum Mitnehmen</li>
                <li>• Getränke und kleine Snacks</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-charcoal mb-4">
              <strong>Haben Sie Fragen zu den Kursen oder möchten Sie einen individuellen Termin vereinbaren?</strong>
            </p>
            <p className="text-sm text-charcoal/70">
              Kontaktieren Sie mich gerne für weitere Informationen oder spezielle Wünsche.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
