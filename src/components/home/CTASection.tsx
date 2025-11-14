import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, DollarSign, FileCheck } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="sr-only">Get Started with Your Real Estate Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Instant Offer */}
      <Card className="p-8 text-center hover:shadow-lg transition-shadow flex flex-col">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-2xl font-bold mb-3">
          Get the strongest cash offer on your home right now.*
        </h3>
        <p className="text-muted-foreground mb-6 flex-grow">
          Your terms and schedule, without the hassle. *Terms and conditions apply.
        </p>
        <Button variant="outline" className="mt-auto">
          Get Started
        </Button>
      </Card>

          {/* Home Estimate */}
          <Card className="p-8 text-center hover:shadow-lg transition-shadow flex flex-col">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">
              Find out what your home is really worth. It's free.
            </h3>
            <p className="text-muted-foreground mb-6 flex-grow">
              We can help you make an informed decision about your home with a free home estimate.
            </p>
            <Button variant="outline" className="mt-auto">
              Find Out
            </Button>
          </Card>

          {/* Pre-Approval */}
          <Card className="p-8 text-center hover:shadow-lg transition-shadow flex flex-col">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-2xl font-bold mb-3">
              Get Pre-Approved
            </h3>
            <p className="text-muted-foreground mb-6 flex-grow">
              Find a lender who can offer you competitive mortgage rates.
            </p>
            <Button variant="outline" className="mt-auto">
              Find Out
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
