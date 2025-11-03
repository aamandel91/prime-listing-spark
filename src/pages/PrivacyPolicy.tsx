import { Helmet } from "react-helmet-async";
import { useAgentSubdomain } from "@/hooks/useAgentSubdomain";

const PrivacyPolicy = () => {
  const { isAgentSubdomain } = useAgentSubdomain();

  return (
    <>
      <Helmet>
        <title>Privacy Policy</title>
        <meta name="description" content="Privacy Policy for our real estate platform" />
        {isAgentSubdomain && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg italic border-l-4 border-primary pl-4 py-2 bg-muted/30">
            This is a template page. Please consult with a legal professional to create a Privacy Policy specific to your business and compliant with applicable laws (GDPR, CCPA, etc.).
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <p>[Describe what personal information you collect]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <p>[Explain how you use the collected information]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
            <p>[Detail when and how you share information with third parties]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Cookies and Tracking</h2>
            <p>[Explain your cookie policy and tracking technologies]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
            <p>[Describe user rights regarding their data]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Data Security</h2>
            <p>[Explain how you protect user data]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
            <p>[Your contact information for privacy inquiries]</p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
