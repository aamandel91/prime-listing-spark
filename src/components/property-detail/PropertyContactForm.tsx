import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, Send } from 'lucide-react';
import { useTourRequest } from '@/hooks/useTourRequest';
import { toast } from 'sonner';
import type { NormalizedProperty } from '@/lib/propertyMapper';

interface PropertyContactFormProps {
  property: NormalizedProperty;
}

export function PropertyContactForm({ property }: PropertyContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(
    `I'm interested in ${property.address.full}. Please contact me with more information.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { submitTourRequest } = useTourRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitTourRequest({
        property_mls: property.mlsNumber,
        property_address: property.address.full,
        visitor_name: name,
        visitor_email: email,
        visitor_phone: phone || undefined,
        tour_date: new Date().toISOString(),
        tour_type: 'in-person',
        comments: message,
      });

      toast.success('Message sent! We\'ll contact you soon.');
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setMessage(`I'm interested in ${property.address.full}. Please contact me with more information.`);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Contact Agent</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Agent Info */}
        {property.agent && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">{property.agent.name}</h4>
            {property.agent.brokerage && (
              <p className="text-sm text-muted-foreground mb-2">{property.agent.brokerage}</p>
            )}
            {property.agent.phone && (
              <div className="flex items-center gap-2 text-sm mb-1">
                <Phone className="w-4 h-4" />
                <a href={`tel:${property.agent.phone}`} className="hover:underline">
                  {property.agent.phone}
                </a>
              </div>
            )}
            {property.agent.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${property.agent.email}`} className="hover:underline">
                  {property.agent.email}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              placeholder="Tell us about your interest..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
