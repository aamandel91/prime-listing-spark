import { ContactFormSection } from "@/types/sidebarSections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormRendererProps {
  section: ContactFormSection;
}

export function ContactFormRenderer({ section }: ContactFormRendererProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          type: 'contact_form',
          data: formData
        }
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We'll get back to you soon."
      });

      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{section.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {section.fields.includes('name') && (
            <div>
              <Label htmlFor="sidebar-name">Name</Label>
              <Input
                id="sidebar-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
          )}
          {section.fields.includes('email') && (
            <div>
              <Label htmlFor="sidebar-email">Email</Label>
              <Input
                id="sidebar-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          )}
          {section.fields.includes('phone') && (
            <div>
              <Label htmlFor="sidebar-phone">Phone</Label>
              <Input
                id="sidebar-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          )}
          {section.fields.includes('message') && (
            <div>
              <Label htmlFor="sidebar-message">Message</Label>
              <Textarea
                id="sidebar-message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
              />
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending...' : (section.submitButtonText || 'Send Message')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
