import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionHeading from "@/components/SectionHeading";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const name = (formData.get("name") as string).trim();
    const email = (formData.get("contactEmail") as string).trim();
    const subject = (formData.get("subject") as string).trim();
    const message = (formData.get("message") as string).trim();

    const { error } = await supabase.from("messages").insert({ name, email, subject, message });

    setLoading(false);
    if (error) {
      toast({ title: "Failed to send", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "We'll get back to you as soon as possible." });
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="py-20 bg-background">
      <div className="container max-w-5xl">
        <SectionHeading title="Contact Us" subtitle="Have questions about the hackathon? We'd love to hear from you." />

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6">
            {[
              { icon: Mail, label: "Email", value: "info@neveragain-ai.rw" },
              { icon: Phone, label: "Phone", value: "+250 788 000 000" },
              { icon: MapPin, label: "Location", value: "Kigali Innovation City, Rwanda" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-memorial/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-memorial" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <p className="text-sm font-medium text-foreground mb-2">Follow Us</p>
              <div className="flex gap-3">
                {["Twitter", "LinkedIn", "Instagram"].map((s) => (
                  <span key={s} className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 sm:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" name="name" required placeholder="Jean Uwimana" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input id="contactEmail" name="contactEmail" type="email" required placeholder="you@example.com" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" required placeholder="Question about the hackathon" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required rows={5} placeholder="Your message..." className="mt-1.5" />
              </div>
              <Button type="submit" variant="memorial" disabled={loading} className="gap-2">
                <Send className="h-4 w-4" />
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
