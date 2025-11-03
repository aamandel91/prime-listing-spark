import { Helmet } from "react-helmet-async";
import { useAgentSubdomain } from "@/hooks/useAgentSubdomain";

const Accessibility = () => {
  const { isAgentSubdomain } = useAgentSubdomain();

  return (
    <>
      <Helmet>
        <title>Accessibility Statement</title>
        <meta name="description" content="Accessibility Statement for our real estate platform" />
        {isAgentSubdomain && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Accessibility Statement</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg italic border-l-4 border-primary pl-4 py-2 bg-muted/30">
            This is a template page. Please customize with your specific accessibility features and contact information.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment</h2>
            <p>We are committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Conformance Status</h2>
            <p>[Describe your WCAG conformance level and efforts]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Accessibility Features</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Keyboard navigation support</li>
              <li>Screen reader compatibility</li>
              <li>Alt text for images</li>
              <li>Clear heading structure</li>
              <li>Sufficient color contrast</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Feedback and Contact</h2>
            <p>We welcome feedback on the accessibility of our website. If you encounter accessibility barriers, please contact us:</p>
            <p>[Your contact information here]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Technical Specifications</h2>
            <p>This website relies on the following technologies to work with your web browser and assistive technologies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>HTML</li>
              <li>WAI-ARIA</li>
              <li>CSS</li>
              <li>JavaScript</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default Accessibility;
