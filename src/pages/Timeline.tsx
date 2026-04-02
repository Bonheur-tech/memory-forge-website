import SectionHeading from "@/components/SectionHeading";
import { CalendarDays, UserPlus, Rocket, Send, Award, Trophy } from "lucide-react";

const events = [
  { icon: UserPlus, date: "Jan 15 – Mar 20, 2026", title: "Registration Opens", desc: "Teams of 2–5 students register online and select their competition track.", status: "active" },
  { icon: CalendarDays, date: "Mar 25, 2026", title: "Opening Ceremony", desc: "Virtual kickoff with keynote speakers, mentors, and challenge announcements.", status: "upcoming" },
  { icon: Rocket, date: "Apr 7 – 9, 2026", title: "Hackathon (48 Hours)", desc: "Three days of building, mentoring, and collaboration in Kigali — timed with Kwibuka 32.", status: "upcoming" },
  { icon: Send, date: "Apr 9, 2026 – 6:00 PM", title: "Submission Deadline", desc: "All projects must be submitted with documentation, demo video, and source code.", status: "upcoming" },
  { icon: Award, date: "Apr 10 – 12, 2026", title: "Judging Period", desc: "Expert judges evaluate projects on innovation, impact, technical quality, and relevance.", status: "upcoming" },
  { icon: Trophy, date: "Apr 15, 2026", title: "Winners Announced", desc: "Awards ceremony celebrating the best projects and teams.", status: "upcoming" },
];

const Timeline = () => {
  return (
    <div className="py-20 bg-background">
      <div className="container max-w-3xl">
        <SectionHeading
          title="Event Timeline"
          subtitle="Key dates and milestones for the Never Again AI Hackathon 2026."
        />
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-8">
            {events.map((event, i) => (
              <div key={event.title} className="relative flex gap-6 group">
                <div className={`relative z-10 shrink-0 h-12 w-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                  event.status === "active"
                    ? "bg-memorial border-memorial text-memorial-foreground"
                    : "bg-card border-border text-muted-foreground group-hover:border-memorial group-hover:text-memorial"
                }`}>
                  <event.icon className="h-5 w-5" />
                </div>
                <div className="bg-card border border-border rounded-lg p-5 flex-1 hover:shadow-md transition-shadow">
                  <span className="text-xs font-semibold uppercase tracking-wider text-memorial">{event.date}</span>
                  <h3 className="font-display font-semibold text-foreground mt-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
