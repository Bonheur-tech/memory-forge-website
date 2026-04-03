import SectionHeading from "@/components/SectionHeading";
import { Brain, Globe, Shield } from "lucide-react";

const tracks = [
  {
    icon: Brain,
    title: "AI & Machine Learning",
    color: "bg-blue-500/10 text-blue-600",
    desc: "Develop an AI-powered solution to detect, analyze, or prevent the spread of genocide ideology, hate speech, and misinformation on digital platforms while promoting awareness and unity.",
    examples: [
      "AI-powered transcription and translation of survivor testimonies",
      "Natural language processing to detect and flag hate speech online",
      "Machine learning models to identify patterns of radicalization",
      "Chatbots that educate users about the history of the genocide",
    ],
  },
  {
    icon: Globe,
    title: "Web & Mobile Development",
    color: "bg-green-500/10 text-green-600",
    desc: "Develop innovative web and mobile applications that promote awareness and education about the Genocide against the Tutsi while encouraging unity among youth.",
    examples: [
      "Interactive digital memorial platforms",
      "Mobile apps for genocide education in schools",
      "Community storytelling and testimony sharing platforms",
      "Virtual tours of memorial sites across Rwanda",
    ],
  },
  {
    icon: Shield,
    title: "Cybersecurity & Anti-Hate Tech",
    color: "bg-red-500/10 text-red-600",
    desc: "Develop tools to combat online hate, misinformation, and genocide denial.",
    examples: [
      "Browser extensions that flag genocide denial content",
      "Misinformation detection and fact-checking tools",
      "Secure platforms for documenting and reporting hate speech",
      "Digital forensics tools for analyzing online radicalization",
    ],
  },
];

const Tracks = () => {
  return (
    <div className="py-20 bg-background">
      <div className="container">
        <SectionHeading
          title="Competition Tracks"
          subtitle="Choose the track that aligns with your skills and passion. Each track addresses a critical aspect of memory preservation and hate prevention."
        />
        <div className="grid md:grid-cols-2 gap-8 mt-4">
          {tracks.map((track) => (
            <div
              key={track.title}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="p-8">
                <div className={`h-14 w-14 rounded-xl ${track.color} flex items-center justify-center mb-5`}>
                  <track.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-3">{track.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-5">{track.desc}</p>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Example Projects:</h4>
                  <ul className="space-y-2">
                    {track.examples.map((ex) => (
                      <li key={ex} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-memorial shrink-0" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tracks;
