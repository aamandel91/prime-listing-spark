import { Helmet } from "react-helmet-async";
import { useAgentSubdomain } from "@/hooks/useAgentSubdomain";

const DmcaNotice = () => {
  const { isAgentSubdomain } = useAgentSubdomain();

  return (
    <>
      <Helmet>
        <title>DMCA Notice</title>
        <meta name="description" content="DMCA Copyright Infringement Notice procedure" />
        {isAgentSubdomain && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">DMCA Notice</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg italic border-l-4 border-primary pl-4 py-2 bg-muted/30">
            This is a template page. Please consult with a legal professional to create DMCA procedures specific to your business.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Copyright Infringement Claims</h2>
            <p>If you believe that content on our website infringes your copyright, please provide us with the following information:</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Required Information</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>A description of the copyrighted work that you claim has been infringed</li>
              <li>The URL or location of the allegedly infringing material</li>
              <li>Your contact information (name, address, telephone, email)</li>
              <li>A statement that you have a good faith belief that the use is not authorized</li>
              <li>A statement under penalty of perjury that the information is accurate</li>
              <li>Your physical or electronic signature</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">How to Submit a Notice</h2>
            <p>Please send DMCA notices to:</p>
            <p>[Your designated copyright agent contact information]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Counter-Notice</h2>
            <p>If you believe your content was removed in error, you may submit a counter-notice with the required information as specified by the DMCA.</p>
          </section>
        </div>
      </div>
    </>
  );
};

export default DmcaNotice;
