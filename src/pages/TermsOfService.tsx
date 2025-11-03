import { Helmet } from "react-helmet-async";
import { useAgentSubdomain } from "@/hooks/useAgentSubdomain";

const TermsOfService = () => {
  const { isAgentSubdomain } = useAgentSubdomain();

  return (
    <>
      <Helmet>
        <title>Terms of Service</title>
        <meta name="description" content="Terms of Service for our real estate platform" />
        {isAgentSubdomain && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg italic border-l-4 border-primary pl-4 py-2 bg-muted/30">
            This is a template page. Please consult with a legal professional to create Terms of Service specific to your business.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>[Your terms of service content here]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. User Obligations</h2>
            <p>[Your user obligations content here]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Privacy and Data</h2>
            <p>[Your privacy and data terms here]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Intellectual Property</h2>
            <p>[Your intellectual property terms here]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Limitation of Liability</h2>
            <p>[Your liability limitations here]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Contact Information</h2>
            <p>[Your contact information here]</p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;
