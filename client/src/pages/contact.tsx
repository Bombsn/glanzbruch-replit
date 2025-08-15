import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Heart, Send, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertCommissionRequestSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { z } from "zod";

type CommissionFormData = z.infer<typeof insertCommissionRequestSchema>;

const Contact = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeForm, setActiveForm] = useState<"general" | "commission">("general");

  // General contact form
  const [generalForm, setGeneralForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // Commission request form
  const commissionForm = useForm<CommissionFormData>({
    resolver: zodResolver(insertCommissionRequestSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: undefined,
      description: "",
      specialMaterials: undefined,
      budget: undefined,
    },
  });

  const commissionMutation = useMutation({
    mutationFn: (data: CommissionFormData) => apiRequest("POST", "/api/commission-requests", data),
    onSuccess: () => {
      toast({
        title: "Sonderanfertigung angefragt",
        description: "Vielen Dank für Ihre Anfrage! Ich melde mich bald bei Ihnen für ein Beratungsgespräch.",
      });
      commissionForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/commission-requests"] });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Die Anfrage konnte nicht gesendet werden. Versuchen Sie es erneut oder kontaktieren Sie mich direkt.",
        variant: "destructive",
      });
    },
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement general contact form submission
    toast({
      title: "Nachricht gesendet",
      description: "Vielen Dank für Ihre Nachricht! Ich antworte Ihnen so schnell wie möglich.",
    });
    setGeneralForm({ name: "", email: "", subject: "", message: "" });
  };

  const onCommissionSubmit = (data: CommissionFormData) => {
    commissionMutation.mutate(data);
  };

  const handleGeneralFormChange = (field: string, value: string) => {
    setGeneralForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-forest mb-4" data-testid="heading-contact">
            Kontakt
          </h1>
          <p className="text-lg text-charcoal max-w-3xl mx-auto">
            Haben Sie Fragen zu meinen Schmuckstücken oder möchten Sie eine Sonderanfertigung besprechen? 
            Ich freue mich auf Ihre Nachricht und berate Sie gerne persönlich.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="font-playfair text-xl text-forest" data-testid="heading-contact-info">
                  Kontakt-Informationen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">E-Mail</p>
                    <p className="text-sm text-charcoal/70" data-testid="text-email">info@glanzbruch.ch</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">Telefon</p>
                    <p className="text-sm text-charcoal/70" data-testid="text-phone">+41 78 XXX XX XX</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">Atelier</p>
                    <p className="text-sm text-charcoal/70" data-testid="text-location">Schweiz</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">Öffnungszeiten</p>
                    <p className="text-sm text-charcoal/70">Nach Vereinbarung</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="bg-sage/10 border-sage/20">
              <CardContent className="p-6">
                <Heart className="w-8 h-8 text-gold mb-4" />
                <h3 className="font-semibold text-forest mb-2">Persönliche Beratung</h3>
                <p className="text-sm text-charcoal/70 leading-relaxed">
                  Gerne berate ich Sie persönlich zu Ihren Wünschen. Besonders bei Sonderanfertigungen 
                  ist ein ausführliches Gespräch wichtig, um Ihre Vorstellungen perfekt umzusetzen.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Forms */}
          <div className="lg:col-span-2">
            {/* Form Toggle */}
            <div className="flex mb-6 bg-white rounded-lg p-1 shadow-sm">
              <Button
                variant={activeForm === "general" ? "default" : "ghost"}
                onClick={() => setActiveForm("general")}
                className={`flex-1 ${activeForm === "general" ? "bg-forest text-white" : "text-charcoal"}`}
                data-testid="button-general-form"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Allgemeine Anfrage
              </Button>
              <Button
                variant={activeForm === "commission" ? "default" : "ghost"}
                onClick={() => setActiveForm("commission")}
                className={`flex-1 ${activeForm === "commission" ? "bg-forest text-white" : "text-charcoal"}`}
                data-testid="button-commission-form"
              >
                <Heart className="w-4 h-4 mr-2" />
                Sonderanfertigung
              </Button>
            </div>

            {/* General Contact Form */}
            {activeForm === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-xl text-forest">
                    Allgemeine Anfrage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGeneralSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Name *
                        </label>
                        <Input
                          value={generalForm.name}
                          onChange={(e) => handleGeneralFormChange("name", e.target.value)}
                          placeholder="Ihr vollständiger Name"
                          required
                          data-testid="input-general-name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          E-Mail *
                        </label>
                        <Input
                          type="email"
                          value={generalForm.email}
                          onChange={(e) => handleGeneralFormChange("email", e.target.value)}
                          placeholder="ihre@email.ch"
                          required
                          data-testid="input-general-email"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Betreff
                      </label>
                      <Input
                        value={generalForm.subject}
                        onChange={(e) => handleGeneralFormChange("subject", e.target.value)}
                        placeholder="Worum geht es?"
                        data-testid="input-general-subject"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Nachricht *
                      </label>
                      <Textarea
                        value={generalForm.message}
                        onChange={(e) => handleGeneralFormChange("message", e.target.value)}
                        placeholder="Ihre Nachricht an mich..."
                        rows={5}
                        required
                        data-testid="textarea-general-message"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-forest hover:bg-forest/90 text-white"
                      data-testid="button-send-general"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Nachricht senden
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Commission Request Form */}
            {activeForm === "commission" && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-xl text-forest">
                    Sonderanfertigung anfragen
                  </CardTitle>
                  <p className="text-sm text-charcoal/70">
                    Beschreiben Sie Ihre Wünsche für ein individuelles Schmuckstück. 
                    Je detaillierter, desto besser kann ich Sie beraten.
                  </p>
                </CardHeader>
                <CardContent>
                  <Form {...commissionForm}>
                    <form onSubmit={commissionForm.handleSubmit(onCommissionSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={commissionForm.control}
                          name="customerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ihr vollständiger Name" {...field} data-testid="input-commission-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={commissionForm.control}
                          name="customerEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-Mail *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="ihre@email.ch" {...field} data-testid="input-commission-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={commissionForm.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefon</FormLabel>
                            <FormControl>
                              <Input placeholder="+41 XX XXX XX XX" {...field} value={field.value || ""} data-testid="input-commission-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={commissionForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Beschreibung Ihres Wunsch-Schmuckstücks *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Beschreiben Sie so detailliert wie möglich, was Sie sich vorstellen. Welche Art von Schmuck? Welche Materialien? Welche Bedeutung soll es haben?"
                                rows={4}
                                {...field} 
                                data-testid="textarea-commission-description"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={commissionForm.control}
                        name="specialMaterials"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Besondere Materialien</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Möchten Sie persönliche Elemente einarbeiten lassen? (z.B. Haare, Asche, getrocknete Blumen, besondere Steine)"
                                rows={3}
                                {...field} 
                                value={field.value || ""}
                                data-testid="textarea-commission-materials"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={commissionForm.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget-Vorstellung</FormLabel>
                            <FormControl>
                              <Select value={field.value || ""} onValueChange={field.onChange} data-testid="select-commission-budget">
                                <SelectTrigger>
                                  <SelectValue placeholder="Wählen Sie Ihr Budget" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bis-100">Bis CHF 100</SelectItem>
                                  <SelectItem value="100-200">CHF 100 - 200</SelectItem>
                                  <SelectItem value="200-500">CHF 200 - 500</SelectItem>
                                  <SelectItem value="500-1000">CHF 500 - 1000</SelectItem>
                                  <SelectItem value="ueber-1000">Über CHF 1000</SelectItem>
                                  <SelectItem value="offen">Offen für Beratung</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={commissionMutation.isPending}
                        className="w-full bg-gold hover:bg-gold/90 text-white"
                        data-testid="button-send-commission"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        {commissionMutation.isPending ? "Wird gesendet..." : "Sonderanfertigung anfragen"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="font-playfair text-xl text-forest flex items-center">
                <Clock className="w-5 h-5 mr-2 text-sage" />
                Antwortzeiten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-charcoal">
                <div className="flex justify-between">
                  <span>E-Mail Anfragen:</span>
                  <span className="font-medium">24-48 Stunden</span>
                </div>
                <div className="flex justify-between">
                  <span>Sonderanfertigungen:</span>
                  <span className="font-medium">1-3 Werktage</span>
                </div>
                <div className="flex justify-between">
                  <span>Telefonische Beratung:</span>
                  <span className="font-medium">Nach Vereinbarung</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="font-playfair text-xl text-forest flex items-center">
                <Heart className="w-5 h-5 mr-2 text-sage" />
                Beratung vor Ort
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-charcoal leading-relaxed mb-4">
                Gerne können Sie mein Atelier besuchen und sich persönlich beraten lassen. 
                Besonders bei Sonderanfertigungen ist dies oft hilfreich, um Materialien 
                und Techniken direkt zu besprechen.
              </p>
              <p className="text-xs text-charcoal/70">
                <strong>Termine nach Vereinbarung</strong> - auch außerhalb der regulären Zeiten möglich.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
