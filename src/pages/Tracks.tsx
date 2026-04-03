import SectionHeading from "@/components/SectionHeading";
import { Brain, Globe, Shield } from "lucide-react";

const tracks = [
  {
    icon: Brain,
    title: "AI & Machine Learning",
    color: "bg-blue-500/10 text-blue-600",
    desc: "Develop an AI-powered solution to detect, analyze, or prevent the spread of genocide ideology, hate speech, and misinformation on digital platforms while promoting awareness and unity.",
    instructions: [
      "Solutions must use safe, ethical, and preferably public datasets.",
      "Application must include a functional AI prototype demonstrating the core concept.",
      "AI models should be designed to detect harmful content and promote positive, educational responses.",
      "Systems must ensure privacy and data protection, avoiding the use of sensitive personal data without consent",
      "Projects should demonstrate clear impact, usability, and problem solving.","Projects should demonstrate clear impact, usability, and problem solving.",
      "Projects must be creative and innovative"
    ],
  },
  {
    icon: Globe,
    title: "Web & Mobile Development",
    color: "bg-green-500/10 text-green-600",
    desc: "Develop innovative web and mobile applications that promote awareness and education about the Genocide against the Tutsi while encouraging unity among youth.",
    instructions: [
      "Solutions must provide accurate, respectful, and educational content aligned with genocide against the Tutsi.",
      "Emphasis on creativity and usability in promoting awareness.",
      "Build a simple but functional prototype (website or mobile app).",
      "Systems must ensure privacy and data protection, avoiding the use of sensitive personal data without consent.",
    ],
  },
  {
    icon: Shield,
    title: "Cybersecurity & Anti-Hate Tech",
    color: "bg-red-500/10 text-red-600",
    desc: "Develop cybersecurity solutions that detect, prevent, and respond to the spread of genocide ideology, misinformation, and harmful content across digital platforms while ensuring safe and secure online environments.",
    instructions: [
      "Application must include a functional security prototype.",
      "Solutions must demonstrate basic threat detection, such as identifying suspicious content, fake news, or malicious activity about genocide ideology.",
      "Strong focus on practical impact, usability, and relevance to preventing digital threats related to division and misinformation about Genocide Against The Tutsi.",
      "Projects must follow ethical cybersecurity practices, avoiding harmful testing on real systems without permission.",
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
