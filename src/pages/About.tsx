import SectionHeading from "@/components/SectionHeading";
import { Heart, BookOpen, Users, Lightbulb, Shield, Target } from "lucide-react";

const values = [
  { icon: Heart, title: "Remembrance", desc: "We honor the memory of the more than one million lives lost during the 1994 Genocide against the Tutsi." },
  { icon: BookOpen, title: "Education", desc: "Technology can help preserve testimonies, educate future generations, and ensure history is never forgotten." },
  { icon: Shield, title: "Prevention", desc: "By building anti-hate tools and detection systems, we actively work toward 'Never Again.'" },
  { icon: Users, title: "Unity", desc: "Bringing together students from across Rwanda to collaborate, learn, and innovate together." },
  { icon: Lightbulb, title: "Innovation", desc: "Harnessing AI, data science, and modern technology to address real-world challenges of memory and reconciliation." },
  { icon: Target, title: "Impact", desc: "Every project built during this hackathon has the potential to make a lasting, meaningful difference." },
];

const About = () => {
  return (
    <div>
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <SectionHeading
            title="About the Hackathon"
            subtitle="Understanding our purpose and the power of technology in service of memory."
          />

          <div className="prose prose-lg max-w-none">
            <div className="bg-memorial-muted border border-border rounded-lg p-8 mb-10">
              <blockquote className="text-xl font-display font-semibold text-foreground italic border-l-4 border-memorial pl-6 m-0">
                "Kwibuka means to remember. We remember not with sorrow alone, but with a determination to build a future where such atrocities can never happen again."
              </blockquote>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                The <strong className="text-foreground">Never Again AI Hackathon 2026</strong> is a national-level student hackathon held in Kigali, Rwanda. It is organized in the spirit of <em>Kwibuka</em> — the annual commemoration of the 1994 Genocide against the Tutsi — and is dedicated to harnessing technology as a force for memory, education, and the prevention of hate.
              </p>
              <p>
                This hackathon invites students from secondary schools across Rwanda to come together and build innovative solutions that address real challenges: preserving survivor testimonies through AI, combating online hate speech, and creating platforms that educate and inform.
              </p>
              <p>
                Our goal is not just to build technology — it is to build technology with <strong className="text-foreground">purpose</strong>. Every line of code written during this event carries the weight of remembrance and the promise of a better tomorrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-memorial-muted">
        <div className="container">
          <SectionHeading title="Our Values" subtitle="The principles that guide everything we do." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-memorial/10 flex items-center justify-center mb-4">
                  <v.icon className="h-5 w-5 text-memorial" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">Never Again</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Technology alone cannot prevent genocide. But when wielded by informed, compassionate, and determined young people, it becomes one of our most powerful tools for truth, justice, and reconciliation. This hackathon is our contribution to that mission.
          </p>
          <div className="mt-8 h-1 w-24 bg-memorial rounded-full mx-auto" />
        </div>
      </section>
    </div>
  );
};

export default About;
