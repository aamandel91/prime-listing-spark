import { useState } from 'react';
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
    <div className="bg-background rounded-lg border shadow-lg overflow-hidden sticky top-24">
      <div className="bg-primary text-primary-foreground px-6 py-5">
        <h3 className="text-xl font-bold">Contact Agent</h3>
      </div>
      
      {property.agent && (
        <div className="p-6 bg-muted/30 border-b">
          <p className="font-semibold text-lg mb-1">{property.agent.name}</p>
          {property.agent.brokerage && (
            <p className="text-sm text-muted-foreground mb-3">{property.agent.brokerage}</p>
          )}
          <div className="space-y-2">
            {property.agent.phone && (
              <p className="text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href={`tel:${property.agent.phone}`} className="hover:text-primary">
                  {property.agent.phone}
                </a>
              </p>
            )}
            {property.agent.email && (
              <p className="text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href={`mailto:${property.agent.email}`} className="hover:text-primary">
                  {property.agent.email}
                </a>
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 h-11"
            required
            placeholder="Your name"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 h-11"
            required
            placeholder="your@email.com"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 h-11"
            placeholder="(555) 555-5555"
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="mt-1"
            required
          />
        </div>

        <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
          {isSubmitting ? (
            'Sending...'
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
