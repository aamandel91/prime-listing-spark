import { useState } from "react";
import { Save, Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface SavedSearchButtonProps {
  searchCriteria: Record<string, any>;
  variant?: "default" | "icon";
  className?: string;
}

export const SavedSearchButton = ({
  searchCriteria,
  variant = "default",
  className = "",
}: SavedSearchButtonProps) => {
  const [open, setOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!searchName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for this search.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    // TODO: Implement actual save to backend
    // await supabase.from('saved_searches').insert({...})
    
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
      toast({
        title: "Search Saved!",
        description: emailNotifications
          ? "You'll receive email notifications when new properties match your criteria."
          : "Your search has been saved. View it anytime from your account.",
      });
      setSearchName("");
    }, 1000);
  };

  if (variant === "icon") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={className}
            title="Save this search"
          >
            <Save className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save This Search</DialogTitle>
            <DialogDescription>
              Get notified when new properties match your search criteria.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="search-name">Search Name</Label>
              <Input
                id="search-name"
                placeholder="e.g., 3BR homes in Miami under $500K"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="email-notifications" className="font-normal">
                  Email me new listings
                </Label>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Search
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Save className="w-4 h-4 mr-2" />
          Save Search
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save This Search</DialogTitle>
          <DialogDescription>
            Get notified when new properties match your search criteria.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search-name">Search Name</Label>
            <Input
              id="search-name"
              placeholder="e.g., 3BR homes in Miami under $500K"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="email-notifications" className="font-normal">
                Email me new listings
              </Label>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>Saving...</>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save Search
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
