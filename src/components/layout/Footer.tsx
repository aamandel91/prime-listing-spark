import { Link } from "react-router-dom";
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data: settings } = useSiteSettings();

  const siteName = settings?.siteName || "Florida Home Finder";
  const agentName = settings?.agentFirstName && settings?.agentLastName 
    ? `${settings.agentFirstName} ${settings.agentLastName}`
    : "";
  const email = settings?.emailGeneral || "info@floridahomefinder.com";
  const phone = settings?.localNumber || settings?.mobileNumber || settings?.tollFree || "(555) 555-1234";
  
  const fullAddress = [
    settings?.street1,
    settings?.street2,
    `${settings?.city || "Your City"}, ${settings?.state || "FL"} ${settings?.zipCode || "12345"}`
  ].filter(Boolean);

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {settings?.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt={siteName}
                  className="h-10 w-auto"
                />
              ) : (
                <>
                  <div className="w-10 h-10 bg-gradient-premium rounded-lg flex items-center justify-center">
                    <Home className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <span className="text-xl font-bold">{siteName}</span>
                </>
              )}
            </div>
            <p className="text-primary-foreground/80 mb-4">
              Your trusted partner in finding the perfect Florida home. Excellence in real estate since 2024.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 rounded-full bg-primary-light hover:bg-accent flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-light hover:bg-accent flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-light hover:bg-accent flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-light hover:bg-accent flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/listings" className="text-primary-foreground/80 hover:text-accent transition-colors">Search Properties</Link></li>
              <li><Link to="/cities" className="text-primary-foreground/80 hover:text-accent transition-colors">Browse Cities</Link></li>
              <li><Link to="/neighborhoods" className="text-primary-foreground/80 hover:text-accent transition-colors">Neighborhoods</Link></li>
              <li><Link to="/blog" className="text-primary-foreground/80 hover:text-accent transition-colors">Blog & News</Link></li>
              <li><Link to="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li><Link to="/fayetteville/single-family" className="text-primary-foreground/80 hover:text-accent transition-colors">Single Family Homes</Link></li>
              <li><Link to="/listings?type=condo" className="text-primary-foreground/80 hover:text-accent transition-colors">Condos & Townhomes</Link></li>
              <li><Link to="/listings?type=multi-family" className="text-primary-foreground/80 hover:text-accent transition-colors">Multi-Family</Link></li>
              <li><Link to="/listings?type=land" className="text-primary-foreground/80 hover:text-accent transition-colors">Land & Lots</Link></li>
              <li><Link to="/listings?type=commercial" className="text-primary-foreground/80 hover:text-accent transition-colors">Commercial</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  {fullAddress.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < fullAddress.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a 
                  href={`tel:${phone.replace(/\D/g, '')}`} 
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a 
                  href={`mailto:${email}`} 
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  {email}
                </a>
              </li>
              {agentName && (
                <li className="text-primary-foreground/80 text-sm mt-4">
                  {settings?.licenseNumber && <div>License: {settings.licenseNumber}</div>}
                  <div>{agentName}</div>
                  {settings?.officeName && <div>{settings.officeName}</div>}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-light mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} {settings?.siteOwner || siteName}. All rights reserved. | 
            <Link to="/privacy-policy" className="hover:text-accent transition-colors ml-1">Privacy Policy</Link> | 
            <Link to="/terms-of-service" className="hover:text-accent transition-colors ml-1">Terms of Service</Link> | 
            <Link to="/accessibility" className="hover:text-accent transition-colors ml-1">Accessibility</Link> | 
            <Link to="/dmca-notice" className="hover:text-accent transition-colors ml-1">DMCA</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
