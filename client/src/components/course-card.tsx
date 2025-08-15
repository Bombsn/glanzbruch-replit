import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Users, CalendarPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertCourseBookingSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Course } from "@shared/schema";
import type { z } from "zod";

interface CourseCardProps {
  course: Course;
}

type BookingFormData = z.infer<typeof insertCourseBookingSchema>;

const CourseCard = ({ course }: CourseCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(insertCourseBookingSchema),
    defaultValues: {
      courseId: course.id,
      customerName: "",
      customerEmail: "",
      customerPhone: undefined,
      preferredDate: undefined,
      message: undefined,
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
      queryClient.invalidateQueries({ queryKey: ["/api/course-bookings"] });
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${remainingMinutes}min`;
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-48 object-cover"
          data-testid={`course-image-${course.id}`}
        />
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-playfair text-xl font-semibold text-forest mb-3" data-testid={`course-title-${course.id}`}>
          {course.title}
        </h3>
        
        <p className="text-charcoal/70 text-sm mb-4 leading-relaxed" data-testid={`course-description-${course.id}`}>
          {course.description}
        </p>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-charcoal/70">
            <Clock className="w-4 h-4 mr-2 text-sage" />
            <span>Dauer: {formatDuration(course.duration)}</span>
          </div>
          <div className="flex items-center text-sm text-charcoal/70">
            <Users className="w-4 h-4 mr-2 text-sage" />
            <span>Max. {course.maxParticipants} Teilnehmer</span>
          </div>
          <div className="flex items-center text-sm text-charcoal/70">
            <Calendar className="w-4 h-4 mr-2 text-sage" />
            <span>Nach Vereinbarung</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-gold font-semibold text-xl" data-testid={`course-price-${course.id}`}>
            {formatPrice(course.price)}
          </span>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-gold hover:bg-gold/90 text-white" data-testid={`button-book-course-${course.id}`}>
              <CalendarPlus className="w-4 h-4 mr-2" />
              Kurs buchen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-playfair text-xl text-forest">
                Kurs buchen: {course.title}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ihr vollständiger Name" {...field} data-testid="input-customer-name" />
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
                        <Input type="email" placeholder="ihre@email.ch" {...field} data-testid="input-customer-email" />
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
                        <Input placeholder="+41 XX XXX XX XX" {...field} value={field.value || ""} data-testid="input-customer-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preferredDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wunschtermin</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. 'Samstag Nachmittag' oder '15.12.2024'" {...field} value={field.value || ""} data-testid="input-preferred-date" />
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
                      <FormLabel>Nachricht</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Besondere Wünsche oder Fragen zum Kurs..." 
                          className="resize-none" 
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
                  className="w-full bg-forest hover:bg-forest/90 text-white"
                  disabled={bookingMutation.isPending}
                  data-testid="button-submit-booking"
                >
                  {bookingMutation.isPending ? "Wird gesendet..." : "Buchungsanfrage senden"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
