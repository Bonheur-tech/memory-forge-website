import SectionHeading from "@/components/SectionHeading";
import { Brain, Globe, Shield } from "lucide-react";

const tracks = [
  {
    icon: Brain,
    title: "AI & Machine Learning\nChallenge",
    color: "bg-blue-500/10 text-blue-600",
    desc: "Develop an AI-powered solution to detect, analyze, or prevent the spread of genocide ideology, hate speech, and misinformation on digital platforms while promoting awareness and unity.",
    instructions: [
      "Research and understand the problem of hate speech detection and genocide ideology",
      "Collect and prepare relevant datasets for training AI models",
      "Choose appropriate AI/ML algorithms (NLP, computer vision, etc.)",
      "Train and validate your models for accuracy and bias mitigation",
      "Implement the solution with user-friendly interfaces",
    ],
  },
  {
    icon: Globe,
    title: "Web & Mobile Development",
    color: "bg-green-500/10 text-green-600",
    desc: "Develop innovative web and mobile applications that promote awareness and education about the Genocide against the Tutsi while encouraging unity among youth.",
    instructions: [
      "Identify user needs and define clear project requirements",
      "Design intuitive user interfaces and experiences",
      "Choose appropriate technology stack (React, Flutter, etc.)",
      "Develop and implement core features",
      "Test thoroughly and deploy your application",
    ],
  },
  {
    icon: Shield,
    title: "Cybersecurity & Anti-Hate Tech",
    color: "bg-red-500/10 text-red-600",
    desc: "Develop cybersecurity solutions that detect, prevent, and respond to the spread of genocide ideology, misinformation, and harmful content across digital platforms while ensuring safe and secure online environments.",
    instructions: [
      "Understand cybersecurity principles and threat models",
      "Identify specific threats related to hate speech and misinformation",
      "Design security measures and detection algorithms",
      "Implement secure platforms and tools",
      "Test security solutions and validate effectiveness",
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
                  <h4 className="text-sm font-semibold text-foreground mb-3">Instructions:</h4>
                  <ul className="space-y-2">
                    {track.instructions.map((inst) => (
                      <li key={inst} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-memorial shrink-0" />
                        {inst}
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
