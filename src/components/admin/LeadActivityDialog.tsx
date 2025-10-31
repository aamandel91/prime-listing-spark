import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Plus, Clock, User } from "lucide-react";

interface LeadActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  leadName: string;
  leadEmail: string;
}

type LeadStatus = Database['public']['Tables']['lead_statuses']['Row'];
type Activity = Database['public']['Tables']['lead_activities']['Row'];

export default function LeadActivityDialog({
  open,
  onOpenChange,
  leadId,
  leadName,
  leadEmail,
}: LeadActivityDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState("");
  const [activityType, setActivityType] = useState<"note" | "call" | "email" | "meeting">("note");

  // Fetch lead status by email
  const { data: leadStatus } = useQuery({
    queryKey: ["lead-status", leadEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_statuses")
        .select("*")
        .eq("lead_email", leadEmail)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as LeadStatus | null;
    },
    enabled: open,
  });

  // Fetch activities by email
  const { data: activities } = useQuery({
    queryKey: ["lead-activities", leadEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_activities")
        .select("*")
        .eq("lead_email", leadEmail)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Activity[];
    },
    enabled: open,
  });

  // Add activity mutation
  const addActivityMutation = useMutation({
    mutationFn: async ({ content, type }: { content: string; type: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from("lead_activities").insert({
        lead_email: leadEmail,
        lead_name: leadName,
        activity_type: type,
        activity_content: content,
        created_by: user?.id || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-activities", leadEmail] });
      setNewNote("");
      toast({ title: "Activity added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add activity", variant: "destructive" });
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (updates: Database['public']['Tables']['lead_statuses']['Update']) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (leadStatus) {
        const { error } = await supabase
          .from("lead_statuses")
          .update(updates)
          .eq("lead_email", leadEmail);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lead_statuses").insert({
          lead_email: leadEmail,
          lead_name: leadName,
          ...updates,
        });
        if (error) throw error;
      }

      // Add status change activity
      if (updates.status) {
        await supabase.from("lead_activities").insert({
          lead_email: leadEmail,
          lead_name: leadName,
          activity_type: "status_change",
          activity_content: `Status updated to: ${updates.status}`,
          created_by: user?.id || null,
          old_status: leadStatus?.status || null,
          new_status: updates.status,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-status", leadEmail] });
      queryClient.invalidateQueries({ queryKey: ["lead-activities", leadEmail] });
      toast({ title: "Status updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update status", variant: "destructive" });
    },
  });

  const handleAddActivity = () => {
    if (!newNote.trim()) return;
    addActivityMutation.mutate({ content: newNote, type: activityType });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      note: "📝",
      call: "📞",
      email: "📧",
      meeting: "👥",
      status_change: "🔄",
    };
    return icons[type] || "📋";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {leadName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{leadEmail}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lead Status Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Lead Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={leadStatus?.status || "new"}
                  onValueChange={(value) =>
                    updateStatusMutation.mutate({ status: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="nurturing">Nurturing</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Last Contact Date</Label>
                <Input
                  type="date"
                  value={leadStatus?.last_contact_date?.split("T")[0] || ""}
                  onChange={(e) =>
                    updateStatusMutation.mutate({
                      last_contact_date: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Add Activity Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Add Activity
            </h3>
            <div className="space-y-2">
              <Select
                value={activityType}
                onValueChange={(value: any) => setActivityType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Add notes about this interaction..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleAddActivity}
                disabled={!newNote.trim() || addActivityMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Activity Timeline
            </h3>
            <div className="space-y-3">
              {activities && activities.length > 0 ? (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 p-3 border rounded-lg bg-card"
                  >
                    <div className="text-2xl">{getActivityIcon(activity.activity_type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="capitalize">
                          {activity.activity_type.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.created_at)}
                        </span>
                      </div>
                      {activity.activity_content && (
                        <p className="text-sm text-muted-foreground">{activity.activity_content}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No activities yet. Add your first note above.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
