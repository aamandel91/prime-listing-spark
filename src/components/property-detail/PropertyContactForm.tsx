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
    <div className="bg-white rounded-lg border shadow-lg overflow-hidden sticky top-24 h-fit">
      <div className="bg-primary text-primary-foreground px-6 py-6">
        <h3 className="text-2xl font-bold">Request Information</h3>
        <p className="text-sm mt-1 opacity-90">Get more details about this property</p>
      </div>
      
      {property.agent && (
        <div className="p-6 bg-muted/50 border-b">
          <p className="font-bold text-xl mb-1 text-foreground">{property.agent.name}</p>
          {property.agent.brokerage && (
            <p className="text-sm text-muted-foreground mb-4">{property.agent.brokerage}</p>
          )}
          <div className="space-y-3">
            {property.agent.phone && (
              <a href={`tel:${property.agent.phone}`} className="flex items-center gap-3 text-sm hover:text-primary transition-colors group">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">{property.agent.phone}</span>
              </a>
            )}
            {property.agent.email && (
              <a href={`mailto:${property.agent.email}`} className="flex items-center gap-3 text-sm hover:text-primary transition-colors group">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">{property.agent.email}</span>
              </a>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <Label htmlFor="name" className="text-base font-semibold text-foreground">Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 h-12"
            required
            placeholder="Your name"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-base font-semibold text-foreground">Email *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 h-12"
            required
            placeholder="your@email.com"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-base font-semibold text-foreground">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 h-12"
            placeholder="(555) 555-5555"
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-base font-semibold text-foreground">Message *</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="mt-2 resize-none"
            required
          />
        </div>

        <Button type="submit" className="w-full h-14 text-base font-bold" disabled={isSubmitting}>
          {isSubmitting ? (
            'Sending...'
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-4">
          By submitting, you agree to our terms. We respect your privacy.
        </p>
      </form>
    </div>
  );
}
