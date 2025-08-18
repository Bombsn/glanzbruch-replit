import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCourseBookingSchema } from "@shared/schema";
import type { CourseWithType } from "@shared/schema";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Star,
  Share,
  Heart,
  User,
  Mail,
  Phone
} from "lucide-react";
import { z } from "zod";

type BookingFormData = z.infer<typeof insertCourseBookingSchema>;

const CourseDetailPage = () => {
  const [, params] = useRoute("/kurs/:id");
  const courseId = params?.id;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: course, isLoading, error } = useQuery<CourseWithType>({
    queryKey: ["/api/courses", courseId],
    enabled: !!courseId,
  });

  const form = useForm<BookingFormData>({
    resolver: zodResolver(insertCourseBookingSchema),
    defaultValues: {
      courseId: courseId || "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      participants: 1,
      totalPrice: course?.courseType.price || "0",
      message: "",
    },
  });

  // Watch participants field to calculate total price
  const participants = form.watch("participants") || 1;
  
  useEffect(() => {
    if (course) {
      const basePrice = parseFloat(course.courseType.price);
      const totalPrice = (basePrice * participants).toFixed(2);
      form.setValue("totalPrice", totalPrice);
      form.setValue("courseId", course.id);
    }
  }, [participants, course, form]);

  const bookingMutation = useMutation({
    mutationFn: (data: BookingFormData) => apiRequest("/api/course-bookings", "POST", data),
    onSuccess: () => {
      toast({
        title: "Buchungsanfrage gesendet",
        description: "Wir melden uns bald bei Ihnen bezüglich der Kurs-Details!",
      });
      form.reset();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/course-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Die Buchungsanfrage konnte nicht gesendet werden. Versuchen Sie es erneut.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    bookingMutation.mutate(data);
  };

  const formatPrice = (price: string) => {
    return `CHF ${parseFloat(price).toFixed(2)}`;
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest mx-auto"></div>
            <p className="mt-4 text-charcoal">Kurs wird geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-cream py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-heading font-bold text-forest mb-4">Kurs nicht gefunden</h1>
          <p className="text-charcoal mb-8">Der gesuchte Kurs konnte nicht gefunden werden.</p>
          <Link href="/kurse">
            <Button className="bg-forest hover:bg-forest/80 text-cream">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zu den Kursen
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-charcoal/70">
            <Link href="/" className="hover:text-forest transition-colors">Home</Link>
            <span>/</span>
            <Link href="/kurse" className="hover:text-forest transition-colors">Kurse</Link>
            <span>/</span>
            <span className="text-charcoal">{course.title}</span>
          </div>
        </div>

        {/* Back Button */}
        <div className="mb-8">
          <Link href="/kurse">
            <Button variant="outline" className="text-forest border-forest hover:bg-forest hover:text-cream">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zu den Kursen
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Course Image */}
          <div className="space-y-4">
            <div className="aspect-[4/3] relative overflow-hidden rounded-lg bg-white shadow-lg">
              <img
                src={course.courseType.imageUrl}
                alt={course.courseType.name}
                className="w-full h-full object-cover"
                data-testid="course-main-image"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 text-forest text-sm">
                  {course.availableSpots} Plätze verfügbar
                </Badge>
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-sage/20 text-sage">
                {course.courseType.name}
              </Badge>
              <span className="text-sm text-charcoal/70">Kurs-ID: {course.id.substring(0, 8)}</span>
            </div>

            {/* Course Title */}
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-forest" data-testid="course-title">
              {course.title}
            </h1>

            {/* Price */}
            <div className="text-3xl font-bold text-charcoal" data-testid="course-price">
              {formatPrice(course.courseType.price)}
            </div>

            {/* Availability Status */}
            <div className="flex items-center space-x-2">
              {course.availableSpots > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Verfügbar</span>
                  {course.availableSpots <= 3 && (
                    <span className="text-orange-600 text-sm">
                      (Nur noch {course.availableSpots} Plätze)
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Ausgebucht</span>
                </>
              )}
            </div>

            {/* Book Course Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  disabled={course.availableSpots <= 0}
                  className="w-full bg-gold hover:bg-gold/90 text-white disabled:bg-gray-300 disabled:text-gray-500"
                  data-testid="button-book-course"
                >
                  {course.availableSpots > 0 ? "Jetzt buchen" : "Ausgebucht"}
                </Button>
              </DialogTrigger>
              
              <DialogContent 
                className="sm:max-w-[425px]"
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle className="text-forest">Kurs buchen</DialogTitle>
                  <DialogDescription>
                    Füllen Sie das Formular aus, um eine Buchungsanfrage zu senden.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-forest">{course.title}</h4>
                  <p className="text-sm text-charcoal/70">{formatDate(course.date)} • {formatTime(course.startTime)} - {formatTime(course.endTime)}</p>
                  <p className="text-lg font-semibold text-gold">{formatPrice(course.courseType.price)}</p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ihr vollständiger Name" 
                              {...field}
                              data-testid="input-customer-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-Mail *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="ihre.email@beispiel.com" 
                              {...field}
                              data-testid="input-customer-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ihre Telefonnummer" 
                              {...field}
                              value={field.value || ""}
                              data-testid="input-customer-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="participants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anzahl Teilnehmer *</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            value={field.value?.toString() || "1"}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-participants">
                                <SelectValue placeholder="1 Person" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: Math.min(course.availableSpots, 8) }, (_, i) => i + 1).map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? 'Person' : 'Personen'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                          <p className="text-xs text-charcoal/60">
                            Verfügbar: {course.availableSpots} Plätze
                          </p>
                        </FormItem>
                      )}
                    />

                    {/* Display total price */}
                    <div className="p-3 bg-sage/10 rounded-lg border border-sage/20">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-charcoal/70">
                          Gesamtpreis ({participants} {participants === 1 ? 'Person' : 'Personen'}):
                        </span>
                        <span className="text-lg font-bold text-forest" data-testid="total-price-display">
                          {formatPrice((parseFloat(course.courseType.price) * participants).toFixed(2))}
                        </span>
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nachricht (optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Besondere Wünsche oder Fragen..." 
                              rows={3}
                              {...field}
                              value={field.value || ""}
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gold hover:bg-gold/90 text-white"
                      disabled={bookingMutation.isPending}
                      data-testid="button-submit-booking"
                    >
                      {bookingMutation.isPending ? "Wird gesendet..." : "Buchungsanfrage senden"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Merkliste
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share className="w-4 h-4 mr-2" />
                Teilen
              </Button>
            </div>

            <Separator />

            {/* Course Description */}
            <div>
              <h3 className="font-semibold text-lg text-forest mb-3">Kursbeschreibung</h3>
              <p className="text-charcoal leading-relaxed" data-testid="course-description">
                {course.courseType.description}
              </p>
            </div>

            <Separator />

            {/* Course Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-forest">Kursdetails</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gold" />
                  <div>
                    <span className="font-medium text-charcoal">Datum:</span>
                    <span className="ml-2 text-charcoal/80">{formatDate(course.date)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gold" />
                  <div>
                    <span className="font-medium text-charcoal">Uhrzeit:</span>
                    <span className="ml-2 text-charcoal/80">{formatTime(course.startTime)} - {formatTime(course.endTime)}</span>
                  </div>
                </div>

                {/* <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-gold" />
                  <div>
                    <span className="font-medium text-charcoal">Dauer:</span>
                    <span className="ml-2 text-charcoal/80">{course.courseType.duration}</span>
                  </div>
                </div> */}

                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gold" />
                  <div>
                    <span className="font-medium text-charcoal">Teilnehmer:</span>
                    <span className="ml-2 text-charcoal/80">
                      noch {course.availableSpots} Plätze frei (max. {course.maxParticipants} Personen)
                    </span>
                  </div>
                </div>

                {course.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gold" />
                    <div>
                      <span className="font-medium text-charcoal">Ort:</span>
                      <span className="ml-2 text-charcoal/80">{course.location}</span>
                    </div>
                  </div>
                )}

                {course.instructor && (
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gold" />
                    <div>
                      <span className="font-medium text-charcoal">Kursleitung:</span>
                      <span className="ml-2 text-charcoal/80">{course.instructor}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Materials & Requirements */}
            {(course.courseType.materials && course.courseType.materials.length > 0) || course.courseType.requirements && (
              <>
                <Separator />
                <div className="space-y-4">
                  {course.courseType.materials && course.courseType.materials.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg text-forest mb-3">Materialien</h3>
                      <ul className="list-disc list-inside text-charcoal/80 space-y-1">
                        {course.courseType.materials.map((material, index) => (
                          <li key={index}>{material}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {course.courseType.requirements && (
                    <div>
                      <h3 className="font-semibold text-lg text-forest mb-3">Voraussetzungen</h3>
                      <p className="text-charcoal/80">{course.courseType.requirements}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            <Separator />

            {/* Contact & Service Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-charcoal/80">
                <Mail className="w-5 h-5 text-sage" />
                <span>Bestätigung per E-Mail nach Buchung</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-charcoal/80">
                <Phone className="w-5 h-5 text-sage" />
                <span>Persönliche Beratung bei Fragen</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-charcoal/80">
                <Clock className="w-5 h-5 text-sage" />
                <span>Kostenlose Stornierung bis 48h vor Kursbeginn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;