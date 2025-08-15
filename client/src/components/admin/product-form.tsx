import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProductSchema, type InsertProduct, type Product } from "@shared/schema";
import type { UploadResult } from "@uppy/core";

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const productFormSchema = insertProductSchema.extend({
  tags: insertProductSchema.shape.tags.optional(),
});

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrls: string[];
  sku?: string;
  inStock: boolean;
  stockQuantity?: number;
  weight?: string;
  dimensions?: string;
  material?: string;
  careInstructions?: string;
  artisan?: string;
  tags?: string[];
  isFeature?: boolean;
  metadata?: string;
};

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(product?.imageUrls || []);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      category: product?.category || "",
      imageUrls: product?.imageUrls || [],
      sku: product?.sku || "",
      inStock: product?.inStock ?? true,
      stockQuantity: product?.stockQuantity || 1,
      weight: product?.weight || "",
      dimensions: product?.dimensions || "",
      material: product?.material || "",
      careInstructions: product?.careInstructions || "",
      artisan: product?.artisan || "Glanzbruch Atelier",
      tags: product?.tags || [],
      isFeature: product?.isFeature || false,
      metadata: product?.metadata || "",
    },
  });

  const currentTags = watch("tags") || [];

  const createProductMutation = useMutation({
    mutationFn: (data: InsertProduct) => apiRequest("/api/admin/products", "POST", data),
    onSuccess: () => {
      toast({
        title: "Produkt erstellt",
        description: "Das Produkt wurde erfolgreich erstellt.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      reset();
      setUploadedImages([]);
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Das Produkt konnte nicht erstellt werden.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: (data: InsertProduct & { id: string }) => apiRequest(`/api/admin/products/${data.id}`, "PUT", data),
    onSuccess: () => {
      toast({
        title: "Produkt aktualisiert",
        description: "Das Produkt wurde erfolgreich aktualisiert.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Das Produkt konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("/api/objects/upload", "POST");
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const newImageUrls = result.successful.map(file => file.uploadURL || "");
      const updatedImages = [...uploadedImages, ...newImageUrls];
      setUploadedImages(updatedImages);
      setValue("imageUrls", updatedImages);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    setValue("imageUrls", updatedImages);
  };

  const addTag = () => {
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      const newTags = [...currentTags, tagInput.trim()];
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    setValue("tags", newTags);
  };

  const onSubmit = (data: ProductFormData) => {
    const submitData: InsertProduct = {
      ...data,
      imageUrls: uploadedImages,
      price: data.price,
      stockQuantity: data.stockQuantity || 1,
      tags: data.tags || [],
    };

    if (product) {
      updateProductMutation.mutate({ ...submitData, id: product.id });
    } else {
      createProductMutation.mutate(submitData);
    }
  };

  const categories = [
    { value: "kettenanhanger", label: "Kettenanhänger" },
    { value: "ohrringe", label: "Ohrringe" },
    { value: "fingerringe", label: "Fingerringe" },
    { value: "armbander", label: "Armbänder" },
    { value: "sonderanfertigungen", label: "Sonderanfertigungen" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Produkt bearbeiten" : "Neues Produkt erstellen"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Produktname *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Produktname eingeben..."
                className={errors.name ? "border-red-500" : ""}
                data-testid="input-product-name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="sku">Artikelnummer</Label>
              <Input
                id="sku"
                {...register("sku")}
                placeholder="A123"
                data-testid="input-product-sku"
              />
              {errors.sku && (
                <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Beschreibung *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Detaillierte Produktbeschreibung..."
              rows={4}
              className={errors.description ? "border-red-500" : ""}
              data-testid="textarea-product-description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preis (CHF) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
                placeholder="0.00"
                className={errors.price ? "border-red-500" : ""}
                data-testid="input-product-price"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Kategorie *</Label>
              <Select onValueChange={(value) => setValue("category", value)} defaultValue={watch("category")}>
                <SelectTrigger data-testid="select-product-category">
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Stock Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={watch("inStock")}
                onCheckedChange={(checked) => setValue("inStock", checked)}
                data-testid="switch-product-in-stock"
              />
              <Label>Auf Lager</Label>
            </div>

            <div>
              <Label htmlFor="stockQuantity">Lagerbestand</Label>
              <Input
                id="stockQuantity"
                type="number"
                {...register("stockQuantity", { valueAsNumber: true })}
                placeholder="1"
                data-testid="input-product-stock-quantity"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                {...register("material")}
                placeholder="925er Silber, Bergkristall"
                data-testid="input-product-material"
              />
            </div>

            <div>
              <Label htmlFor="dimensions">Abmessungen</Label>
              <Input
                id="dimensions"
                {...register("dimensions")}
                placeholder="2,5 cm hoch x 2,5 cm breit"
                data-testid="input-product-dimensions"
              />
            </div>

            <div>
              <Label htmlFor="weight">Gewicht</Label>
              <Input
                id="weight"
                {...register("weight")}
                placeholder="15g"
                data-testid="input-product-weight"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="careInstructions">Pflegehinweise</Label>
            <Textarea
              id="careInstructions"
              {...register("careInstructions")}
              placeholder="Pflegehinweise für das Produkt..."
              rows={2}
              data-testid="textarea-product-care-instructions"
            />
          </div>

          <div>
            <Label htmlFor="artisan">Handwerker</Label>
            <Input
              id="artisan"
              {...register("artisan")}
              placeholder="Glanzbruch Atelier"
              data-testid="input-product-artisan"
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Tag hinzufügen..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                data-testid="input-product-tag"
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentTags.map((tag, index) => (
                <div key={index} className="bg-sage/20 text-sage px-2 py-1 rounded-md flex items-center gap-1">
                  <span>{tag}</span>
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Product */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={watch("isFeature")}
              onCheckedChange={(checked) => setValue("isFeature", checked)}
              data-testid="switch-product-featured"
            />
            <Label>Als Hauptprodukt markieren</Label>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Produktbilder</Label>
            <div className="mt-2">
              <ObjectUploader
                maxNumberOfFiles={5}
                maxFileSize={10485760}
                onGetUploadParameters={handleGetUploadParameters}
                onComplete={handleUploadComplete}
                buttonClassName="mb-4"
              >
                <Upload className="w-4 h-4 mr-2" />
                Bilder hochladen
              </ObjectUploader>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        data-testid={`button-remove-image-${index}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div>
            <Label htmlFor="metadata">Zusätzliche Metadaten (JSON)</Label>
            <Textarea
              id="metadata"
              {...register("metadata")}
              placeholder='{"customField": "value"}'
              rows={2}
              data-testid="textarea-product-metadata"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Abbrechen
              </Button>
            )}
            <Button
              type="submit"
              disabled={createProductMutation.isPending || updateProductMutation.isPending}
              data-testid="button-submit-product"
            >
              {createProductMutation.isPending || updateProductMutation.isPending
                ? "Speichern..."
                : product
                ? "Aktualisieren"
                : "Erstellen"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}