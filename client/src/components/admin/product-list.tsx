import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface ProductListProps {
  onEditProduct?: (product: Product) => void;
  onCreateProduct?: () => void;
}

export function ProductList({ onEditProduct, onCreateProduct }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/products/${id}`, "DELETE"),
    onSuccess: () => {
      toast({
        title: "Produkt gelöscht",
        description: "Das Produkt wurde erfolgreich gelöscht.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Das Produkt konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteProduct = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  const formatPrice = (price: string) => {
    return `CHF ${parseFloat(price).toFixed(2)}`;
  };

  const getCategoryName = (category: string) => {
    const categoryNames: Record<string, string> = {
      kettenanhanger: "Kettenanhänger",
      ohrringe: "Ohrringe",
      fingerringe: "Fingerringe",
      armbander: "Armbänder",
      sonderanfertigungen: "Sonderanfertigungen",
    };
    return categoryNames[category] || category;
  };

  const categories = [
    { value: "all", label: "Alle Kategorien" },
    { value: "kettenanhanger", label: "Kettenanhänger" },
    { value: "ohrringe", label: "Ohrringe" },
    { value: "fingerringe", label: "Fingerringe" },
    { value: "armbander", label: "Armbänder" },
    { value: "sonderanfertigungen", label: "Sonderanfertigungen" },
  ];

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest mx-auto"></div>
            <p className="mt-2 text-charcoal">Produkte werden geladen...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Produktverwaltung</CardTitle>
          <Button onClick={onCreateProduct} data-testid="button-create-product">
            <Plus className="w-4 h-4 mr-2" />
            Neues Produkt
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Nach Name oder Artikelnummer suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-products"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger data-testid="select-filter-category">
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
          </div>
        </div>

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-charcoal/70">Keine Produkte gefunden.</p>
            {searchTerm || selectedCategory !== "all" ? (
              <p className="text-sm text-charcoal/50 mt-2">
                Versuchen Sie, Ihre Suchkriterien zu ändern.
              </p>
            ) : (
              <Button onClick={onCreateProduct} variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Erstes Produkt erstellen
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bild</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Preis</TableHead>
                  <TableHead>Lager</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} data-testid={`product-row-${product.id}`}>
                    <TableCell>
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.sku && (
                          <p className="text-sm text-charcoal/70">{product.sku}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.sku || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryName(product.category)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell>
                      {product.stockQuantity ? `${product.stockQuantity} Stk.` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.inStock ? "default" : "destructive"}>
                        {product.inStock ? "Auf Lager" : "Ausverkauft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/produkt/${product.id}`}>
                          <Button variant="ghost" size="sm" data-testid={`button-view-${product.id}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditProduct?.(product)}
                          data-testid={`button-edit-${product.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              data-testid={`button-delete-${product.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Produkt löschen</AlertDialogTitle>
                              <AlertDialogDescription>
                                Sind Sie sicher, dass Sie "{product.name}" löschen möchten? 
                                Diese Aktion kann nicht rückgängig gemacht werden.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Löschen
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 flex justify-between items-center text-sm text-charcoal/70">
          <p>
            {filteredProducts.length} von {products.length} Produkten angezeigt
          </p>
          <p>
            Gesamtwert: CHF {filteredProducts.reduce((sum, product) => sum + parseFloat(product.price) * (product.stockQuantity || 0), 0).toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}