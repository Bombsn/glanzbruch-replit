import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { authUtils } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export const AdminHeader = () => {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await authUtils.logout();
      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Fehler beim Abmelden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-end p-4 border-b">
      <Button
        variant="outline"
        onClick={handleLogout}
        className="text-red-600 border-red-600 hover:bg-red-50"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Abmelden
      </Button>
    </div>
  );
};
