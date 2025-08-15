import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, Plus, Edit, Trash2, LogOut, Home as HomeIcon, Package, BookOpen, ShoppingBag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCourseSchema, type CourseType, type CourseWithType, type InsertCourse, type Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { ProductList } from "@/components/admin/product-list";
import { ProductForm } from "@/components/admin/product-form";

const AdminDashboard = () => {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseWithType | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<CourseWithType | null>(null);
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin");
      return;
    }
    setIsAuthenticated(true);
  }, [setLocation]);

  const { data: courseTypes = [] } = useQuery<CourseType[]>({
    queryKey: ["/api/course-types"],
    enabled: isAuthenticated,
  });

  const { data: courses = [] } = useQuery<CourseWithType[]>({
    queryKey: ["/api/admin/courses"],
    enabled: isAuthenticated,
  });

  const { data: courseBookings = [] } = useQuery({
    queryKey: ["/api/course-bookings"],
    enabled: isAuthenticated,
  });

  const form = useForm({
    defaultValues: {
      courseTypeId: "",
      title: "",
      date: new Date().toISOString().split('T')[0],
      startTime: "09:00",
      endTime: "17:00",
      maxParticipants: 6,
      availableSpots: 6,
      location: "Glanzbruch Atelier",
      instructor: "Glanzbruch Atelier",
      status: "scheduled",
      notes: "",
    },
  });

  const editForm = useForm({
    defaultValues: {
      courseTypeId: "",
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      maxParticipants: 6,
      availableSpots: 6,
      location: "",
      instructor: "",
      status: "scheduled",
      notes: "",
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: (data: InsertCourse) => apiRequest("POST", "/api/admin/courses", data),
    onSuccess: () => {
      toast({
        title: "Kurs erstellt",
        description: "Der neue Kurstermin wurde erfolgreich erstellt.",
      });
      form.reset();
      setCreatingCourse(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Der Kurs konnte nicht erstellt werden.",
        variant: "destructive",
      });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: any }) => 
      apiRequest("PUT", `/api/admin/courses/${courseId}`, data),
    onSuccess: () => {
      toast({
        title: "Kurs aktualisiert",
        description: "Der Kurstermin wurde erfolgreich aktualisiert.",
      });
      setEditingCourse(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Der Kurs konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (courseId: string) => apiRequest("DELETE", `/api/admin/courses/${courseId}`),
    onSuccess: () => {
      toast({
        title: "Kurs gelöscht",
        description: "Der Kurstermin wurde erfolgreich gelöscht.",
      });
      setCourseToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Der Kurs konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    },
  });

  // Get booking count for a specific course
  const getBookingCount = (courseId: string) => {
    if (!Array.isArray(courseBookings)) return 0;
    return courseBookings.filter((booking: any) => booking.courseId === courseId).length;
  };

  // Handle delete course with confirmation
  const handleDeleteCourse = (course: CourseWithType) => {
    setCourseToDelete(course);
  };

  const confirmDeleteCourse = () => {
    if (courseToDelete) {
      deleteCourseMutation.mutate(courseToDelete.id);
    }
  };

  const onSubmit = (data: any) => {
    // Combine date and start time for the ISO string
    const dateTimeString = `${data.date}T${data.startTime}:00.000Z`;
    
    const courseData = {
      ...data,
      date: dateTimeString,
      maxParticipants: Number(data.maxParticipants),
      availableSpots: Number(data.maxParticipants),
    };
    
    delete courseData.startTime;
    delete courseData.endTime;
    
    createCourseMutation.mutate(courseData);
  };

  const onEditSubmit = (data: any) => {
    if (!editingCourse) return;
    
    // Combine date and start time for the ISO string
    const dateTimeString = `${data.date}T${data.startTime}:00.000Z`;
    
    const courseData = {
      ...data,
      date: dateTimeString,
      maxParticipants: Number(data.maxParticipants),
      availableSpots: Number(data.availableSpots),
    };
    
    delete courseData.startTime;
    delete courseData.endTime;
    
    updateCourseMutation.mutate({ courseId: editingCourse.id, data: courseData });
  };

  const handleEditCourse = (course: CourseWithType) => {
    const courseDate = new Date(course.date);
    const formattedDate = courseDate.toISOString().split('T')[0];
    
    editForm.reset({
      courseTypeId: course.courseTypeId,
      title: course.title,
      date: formattedDate,
      startTime: course.startTime,
      endTime: course.endTime,
      maxParticipants: course.maxParticipants,
      availableSpots: course.availableSpots,
      location: course.location || "",
      instructor: course.instructor || "",
      status: course.status || "scheduled",
      notes: course.notes || "",
    });
    
    setEditingCourse(course);
  };

  const handleCreateCourse = () => {
    // Reset form with default values
    form.reset({
      courseTypeId: "",
      title: "",
      date: "",
      startTime: "10:00",
      endTime: "17:00",
      maxParticipants: 6,
      availableSpots: 6,
      location: "Glanzbruch Atelier",
      instructor: "Glanzbruch Atelier",
      status: "scheduled",
      notes: "",
    });
    
    setCreatingCourse(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin");
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-4xl font-bold text-forest mb-2">
              Admin Dashboard
            </h1>
            <p className="text-charcoal/70">
              Verwalten Sie Produkte, Kurse und Termine
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => window.open('/', '_blank')}
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-white"
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              Zur Homepage
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-forest text-forest hover:bg-forest hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produkte
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Kurse
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gesamte Produkte</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-forest">-</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aktive Kurse</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-forest">
                    {courses.filter(course => course.status === "scheduled").length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kursbuchungen</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-forest">
                    {courseBookings.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Schnellaktionen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => {
                      setActiveTab("products");
                      setCreatingProduct(true);
                    }}
                    className="justify-start bg-forest hover:bg-forest/80 text-cream"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Neues Produkt erstellen
                  </Button>
                  <Button
                    onClick={() => {
                      setActiveTab("courses");
                      setCreatingCourse(true);
                    }}
                    variant="outline"
                    className="justify-start border-forest text-forest hover:bg-forest hover:text-cream"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Neuen Kurs erstellen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <ProductList
              onEditProduct={setEditingProduct}
              onCreateProduct={() => setCreatingProduct(true)}
            />
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {/* Existing Courses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Aktuelle Kurstermine</CardTitle>
            <Button
              onClick={handleCreateCourse}
              className="bg-forest hover:bg-forest/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Neuen Kurs erstellen
            </Button>
          </CardHeader>
          
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-center text-charcoal/70 py-8">
                Noch keine Kurstermine erstellt.
              </p>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div 
                    key={course.id} 
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-forest">{course.title}</h3>
                      <p className="text-sm text-charcoal/70">
                        {formatDate(course.date)} • {course.startTime} - {course.endTime}
                      </p>
                      <p className="text-sm text-charcoal/70">
                        {course.availableSpots} von {course.maxParticipants} Plätzen verfügbar
                      </p>
                      {course.courseType && (
                        <p className="text-sm text-gold">
                          CHF {parseFloat(course.courseType.price).toFixed(2)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        course.status === "scheduled" ? "bg-green-100 text-green-800" :
                        course.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {course.status === "scheduled" ? "Geplant" :
                         course.status === "cancelled" ? "Abgesagt" : "Abgeschlossen"}
                      </span>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCourse(course)}
                        className="border-gold text-gold hover:bg-gold hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCourse(course)}
                        disabled={deleteCourseMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Course Modal */}
        <Dialog open={!!editingCourse} onOpenChange={(open) => !open && setEditingCourse(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Kurs bearbeiten</DialogTitle>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="courseTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kurstyp</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wählen Sie einen Kurstyp" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kurstitel</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="z.B. UV-Resin Ganztageskurs am 6. September" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={editForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Datum</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Startzeit</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endzeit</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="maxParticipants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max. Teilnehmer</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="1"
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="availableSpots"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verfügbare Plätze</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ort</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="z.B. Glanzbruch Atelier" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="instructor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kursleiter</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="z.B. Glanzbruch Atelier" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="scheduled">Geplant</SelectItem>
                          <SelectItem value="cancelled">Abgesagt</SelectItem>
                          <SelectItem value="completed">Abgeschlossen</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notizen (optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Besondere Hinweise für diesen Kurstermin..."
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className="bg-forest hover:bg-forest/90 text-white"
                    disabled={updateCourseMutation.isPending}
                  >
                    {updateCourseMutation.isPending ? "Wird aktualisiert..." : "Änderungen speichern"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setEditingCourse(null)}
                  >
                    Abbrechen
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Create Course Modal */}
        <Dialog open={creatingCourse} onOpenChange={(open) => !open && setCreatingCourse(false)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Neuen Kurs erstellen</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="courseTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kurstyp</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wählen Sie einen Kurstyp" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kurstitel</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="z.B. UV-Resin Ganztageskurs am 6. September" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Datum</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Startzeit</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endzeit</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxParticipants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max. Teilnehmer</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="1"
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ort</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="z.B. Glanzbruch Atelier" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="instructor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kursleiter</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="z.B. Glanzbruch Atelier" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="scheduled">Geplant</SelectItem>
                            <SelectItem value="cancelled">Abgesagt</SelectItem>
                            <SelectItem value="completed">Abgeschlossen</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notizen (optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Besondere Hinweise für diesen Kurstermin..."
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className="bg-forest hover:bg-forest/90 text-white"
                    disabled={createCourseMutation.isPending}
                  >
                    {createCourseMutation.isPending ? "Wird erstellt..." : "Kurstermin erstellen"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCreatingCourse(false)}
                  >
                    Abbrechen
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

          </TabsContent>
        </Tabs>

        {/* Product Form Modals */}
        <Dialog open={creatingProduct} onOpenChange={setCreatingProduct}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Neues Produkt erstellen</DialogTitle>
            </DialogHeader>
            <ProductForm
              onSuccess={() => {
                setCreatingProduct(false);
                setActiveTab("products");
              }}
              onCancel={() => setCreatingProduct(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Produkt bearbeiten</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct || undefined}
              onSuccess={() => {
                setEditingProduct(null);
                setActiveTab("products");
              }}
              onCancel={() => setEditingProduct(null)}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!courseToDelete} onOpenChange={(open) => !open && setCourseToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Kurs wirklich löschen?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>Sind Sie sicher, dass Sie den Kurs "{courseToDelete?.title}" löschen möchten?</p>
                {courseToDelete && getBookingCount(courseToDelete.id) > 0 && (
                  <p className="text-red-600 font-medium">
                    ⚠️ Achtung: Es gibt bereits {getBookingCount(courseToDelete.id)} Buchung(en) für diesen Kurs!
                  </p>
                )}
                <p className="text-sm text-gray-600">Diese Aktion kann nicht rückgängig gemacht werden.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteCourse}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                Löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminDashboard;