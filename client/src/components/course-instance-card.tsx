import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCourseBookingSchema } from "@shared/schema";
import type { CourseWithType } from "@shared/schema";
import { z } from "zod";

interface CourseInstanceCardProps {
  course: CourseWithType;
}

type BookingFormData = z.infer<typeof insertCourseBookingSchema>;

const CourseInstanceCard = ({ course }: CourseInstanceCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(insertCourseBookingSchema),
    defaultValues: {
      courseId: course.id,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      participants: 1,
      totalPrice: course.courseType.price,
      message: "",
    },
  });

  // Watch participants field to calculate total price
  const participants = form.watch("participants") || 1;
  
  useEffect(() => {
    const basePrice = parseFloat(course.courseType.price);
    const totalPrice = (basePrice * participants).toFixed(2);
    form.setValue("totalPrice", totalPrice);
  }, [participants, course.courseType.price, form]);

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      console.log('🔄 Starting API request to /api/course-bookings');
      console.log('📤 Request data:', data);
      
      try {
        const response = await apiRequest("/api/course-bookings", "POST", data);
        console.log('✅ API request successful:', response);
        return response;
      } catch (error) {
        console.error('❌ API request failed:', error);
        console.error('Error details:', {
          name: (error as any)?.name,
          message: (error as any)?.message,
          stack: (error as any)?.stack,
          cause: (error as any)?.cause
        });
        throw error;
      }
    },
    onSuccess: () => {
      console.log('✅ Booking mutation succeeded');
      toast({
        title: "Buchungsanfrage gesendet",
        description: "Wir melden uns bald bei Ihnen bezüglich der Kurs-Details!",
      });
      form.reset();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/course-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
    onError: (error: any) => {
      console.error('❌ Booking mutation failed:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      toast({
        title: "Fehler",
        description: error?.message || "Die Buchungsanfrage konnte nicht gesendet werden. Versuchen Sie es erneut.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    console.log('Submitting booking data:', data);
    
    // Ensure participants is a number and totalPrice is a string
    const bookingData = {
      ...data,
      participants: typeof data.participants === 'string' ? parseInt(data.participants, 10) : data.participants,
      totalPrice: (parseFloat(course.courseType.price) * (data.participants || 1)).toFixed(2)
    };
    
    console.log('Processed booking data:', bookingData);
    bookingMutation.mutate(bookingData);
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

  const handleCardClick = () => {
    window.location.href = `/kurs/${course.id}`;
  };

  return (
    <>
      <div className="relative">
        <Card 
          className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
              <img
                src={course.courseType.imageUrl}
                alt={course.courseType.name}
                className="w-full h-full object-cover"
                data-testid={`course-image-${course.id}`}
              />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-white/90 text-forest text-xs">
                  {course.availableSpots} Plätze verfügbar
                </Badge>
              </div>
            </div>
            
            {/* Content Section */}
            <CardContent className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold text-forest mb-3 hover:text-gold transition-colors" data-testid={`course-title-${course.id}`}>
                  {course.title}
                </h3>
              
                <div className="flex flex-col md:grid md:grid-cols-2 gap-2 text-sm text-charcoal">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gold" />
                    <span data-testid={`course-date-${course.id}`}>
                      {formatDate(course.date)}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gold" />
                    <span data-testid={`course-time-${course.id}`}>
                      {formatTime(course.startTime)} - {formatTime(course.endTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gold" />
                    <span data-testid={`course-participants-${course.id}`}>
                      noch {course.availableSpots} Plätze (max. {course.maxParticipants})
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-gold" />
                    <span data-testid={`course-category-${course.id}`}>
                      {course.courseType.name}
                    </span>
                  </div>

                  {course.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gold" />
                      <span data-testid={`course-location-${course.id}`}>
                        {course.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-sage/20">
                <div>
                  <p className="text-xl font-bold text-forest" data-testid={`course-price-${course.id}`}>
                    {formatPrice(course.courseType.price)}
                  </p>
                </div>
                
                <Button 
                  className="bg-gold hover:bg-gold/90 text-white"
                  data-testid={`button-book-course-${course.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDialogOpen(true);
                  }}
                >
                  Jetzt buchen
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Modal rendered outside of card */}
      <Dialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        modal={true}
      >
        <DialogContent 
          className="sm:max-w-[425px]"
          onPointerDownOutside={() => setIsDialogOpen(false)}
          onEscapeKeyDown={() => setIsDialogOpen(false)}
        >
                  <div className="mb-4">
                    <h4 className="font-semibold text-forest mb-2">{course.title}</h4>
                    <div className="text-sm text-charcoal/70 space-y-1">
                      <p>{formatDate(course.date)}</p>
                      <p>{formatTime(course.startTime)} - {formatTime(course.endTime)}</p>
                      <p className="font-semibold text-forest">{formatPrice(course.courseType.price)}</p>
                    </div>
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
                                required
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
                                placeholder="ihre.email@example.com" 
                                {...field} 
                                data-testid="input-customer-email"
                                required
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
                            <FormLabel>Telefonnummer</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="+41 79 123 45 67" 
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
                              onValueChange={(value) => {
                                const numValue = parseInt(value, 10);
                                field.onChange(numValue);
                              }} 
                              value={field.value?.toString() || "1"}
                              defaultValue="1"
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-participants">
                                  <SelectValue placeholder="Wählen Sie die Anzahl Teilnehmer" />
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
                                className="resize-none" 
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
                        className="w-full bg-gold hover:bg-gold/90"
                        disabled={bookingMutation.isPending}
                        data-testid="button-submit-booking"
                      >
                        {bookingMutation.isPending ? "Wird gesendet..." : "Buchungsanfrage senden"}
                      </Button>
                    </form>
                  </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseInstanceCard;