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
    <div className="bg-white rounded-lg border-2 border-gray-300 shadow-sm overflow-hidden sticky top-24">
      <div className="bg-blue-600 text-white px-6 py-5">
        <h3 className="text-xl font-bold">Contact Agent</h3>
      </div>
      
      {property.agent && (
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <p className="font-semibold text-lg mb-1">{property.agent.name}</p>
          {property.agent.brokerage && (
            <p className="text-sm text-muted-foreground mb-3">{property.agent.brokerage}</p>
          )}
          <div className="space-y-2">
            {property.agent.phone && (
              <p className="text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <a href={`tel:${property.agent.phone}`} className="hover:text-blue-800 text-blue-600">
                  {property.agent.phone}
                </a>
              </p>
            )}
            {property.agent.email && (
              <p className="text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <a href={`mailto:${property.agent.email}`} className="hover:text-blue-800 text-blue-600">
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
            className="mt-1 h-12 border-gray-300"
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
            className="mt-1 h-12 border-gray-300"
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
            className="mt-1 h-12 border-gray-300"
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
            className="mt-1 border-gray-300 resize-none min-h-[120px]"
            required
          />
        </div>

        <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isSubmitting}>
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
