import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
      totalPrice: course.courseType.price,
      message: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: (data: BookingFormData) => apiRequest("POST", "/api/course-bookings", data),
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

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex">
        {/* Image Section */}
        <Link href={`/kurs/${course.id}`}>
          <div className="relative w-48 h-32 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
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
        </Link>
        
        {/* Content Section */}
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <Link href={`/kurs/${course.id}`}>
              <h3 className="font-heading text-lg font-semibold text-forest mb-3 cursor-pointer hover:text-gold transition-colors" data-testid={`course-title-${course.id}`}>
                {course.title}
              </h3>
            </Link>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-charcoal">
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
                  Max. {course.maxParticipants} Teilnehmer
                </span>
              </div>

              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-gold" />
                <span data-testid={`course-category-${course.id}`}>
                  {course.courseType.name}
                </span>
              </div>

              {course.location && (
                <div className="flex items-center md:col-span-2">
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
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gold hover:bg-gold/90 text-white"
                  data-testid={`button-book-course-${course.id}`}
                >
                  Jetzt buchen
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-forest">Kurs buchen</DialogTitle>
              </DialogHeader>
              
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
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default CourseInstanceCard;