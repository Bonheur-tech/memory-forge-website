import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/CountdownTimer";
import heroBg from "@/assets/hero-bg.jpg";
import kwibuka from "@/assets/kwibuka.png";
import { useInView } from "@/hooks/useInView";
import {
  Brain,
  Globe,
  Shield,
  Trophy,
  Users,
  Zap,
  Star,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  Calendar,
  Code2,
  Presentation,
  Award,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const TRACKS = [
  {
    icon: Brain,
    title: "AI & Machine Learning",
    desc: "Build AI solutions that preserve testimonies, detect hate speech, and educate future generations.",
    color: "from-violet-500/20 to-purple-600/10",
    ring: "ring-violet-400/30",
    iconColor: "text-violet-400",
  },
  {
    icon: Globe,
    title: "Web & Mobile Development",
    desc: "Create platforms for memorial archives, digital storytelling, and community remembrance.",
    color: "from-blue-500/20 to-cyan-600/10",
    ring: "ring-blue-400/30",
    iconColor: "text-blue-400",
  },
  {
    icon: Shield,
    title: "Cybersecurity & Anti-Hate",
    desc: "Develop tools to combat online hate speech, misinformation, and genocide denial.",
    color: "from-amber-500/20 to-orange-600/10",
    ring: "ring-amber-400/30",
    iconColor: "text-amber-400",
  },
];

const FEATURES = [
  {
    icon: Trophy,
    title: "Prizes in RWF",
    desc: "Compete for significant cash prizes, mentorship opportunities, and recognition across Rwanda's tech ecosystem.",
    color: "text-amber-400",
  },
  {
    icon: Users,
    title: "Expert Mentors",
    desc: "Work alongside industry professionals, AI researchers, and scholars in genocide Against the Tutsi remembrance and memory preservation.",
    color: "text-blue-400",
  },
  {
    icon: Zap,
    title: "Real-World Impact",
    desc: "Build solutions that matter beyond the hackathon — tools that can genuinely preserve memory and prevent hate.",
    color: "text-violet-400",
  },
  {
    icon: Star,
    title: "National Recognition",
    desc: "Showcase your innovation to Rwanda's leading tech community, government, and international partner organizations.",
    color: "text-emerald-400",
  },
];

const STEPS = [
  {
    icon: CheckCircle,
    title: "Register",
    date: "By April 5",
    desc: "Sign up individually or assemble your team of up to 3 students.",
  },
  {
    icon: Users,
    title: "Form & Ideate",
    date: "April 5–6",
    desc: "Gather your team, research the tracks, and brainstorm your solution.",
  },
  {
    icon: Code2,
    title: "Hack (48h)",
    date: "April 7–9",
    desc: "Build, iterate, and refine your project during the hackathon weekend.",
  },
  {
    icon: Presentation,
    title: "Submit & Present",
    date: "April 9",
    desc: "Submit your project and present it to our panel of expert judges.",
  },
  {
    icon: Award,
    title: "Winners Announced",
    date: "April 10",
    desc: "Celebrate the teams making the greatest impact through technology.",
  },
];

const PARTNERS = [
  "MINUBUMWE",
  "MINICT",
  "1MILLION CODERS",
  "BK-INSURANCE",
  "REB",
  "IBUKA",
];

const STATS = [
  { value: "500+", label: "Students Expected" },
  { value: "3", label: "Competition Tracks" },
  { value: "2M+", label: "RWF in Prizes" },
  { value: "48h", label: "Of Innovation" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Index = () => {
  // Scroll-reveal refs
  const missionRef = useInView(0.1);
  const statsRef = useInView(0.1);
  const featuresRef = useInView(0.08);
  const tracksRef = useInView(0.08);
  const stepsRef = useInView(0.08);
  const partnersRef = useInView(0.1);
  const ctaRef = useInView(0.15);

  return (
    <div className="overflow-x-hidden">
      {/* ══════════════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay bg-[#07111D]">
        {/* Background image */}
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-[1.04]"
          style={{ transition: "transform 20s ease-out" }}
          fetchPriority="high"
          decoding="async"
        />

        {/* Layered overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07111D]/75 via-[#07111D]/55 to-[#07111D]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07111D]/60 via-transparent to-[#07111D]/30" />

        {/* ── Floating geometric decorations ── */}
        {/* Large outer ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/[0.04] animate-rotate-slow pointer-events-none"
          style={{ willChange: "transform" }}
        />
        {/* Medium ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-violet-400/[0.07] animate-rotate-rev pointer-events-none"
          style={{ willChange: "transform" }}
        />
        {/* Floating orbs */}
        <div className="absolute top-[18%] right-[14%] w-72 h-72 rounded-full bg-violet-600/10 blur-[80px] animate-float-slow pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-56 h-56 rounded-full bg-blue-500/10 blur-[60px] animate-float-delayed pointer-events-none" />
        <div className="absolute top-[30%] left-[8%] w-32 h-32 rounded-full bg-violet-500/8 blur-[40px] animate-float pointer-events-none" />

        {/* Corner geometric accent — top right */}
        <svg
          className="absolute top-0 right-0 w-80 h-80 opacity-[0.04] pointer-events-none"
          viewBox="0 0 320 320"
          fill="none"
        >
          <circle cx="320" cy="0" r="200" stroke="white" strokeWidth="1" />
          <circle cx="320" cy="0" r="140" stroke="white" strokeWidth="0.5" />
          <circle cx="320" cy="0" r="80" stroke="white" strokeWidth="0.5" />
        </svg>

        {/* Bottom-left hexagonal pattern */}
        <svg
          className="absolute bottom-0 left-0 w-72 h-72 opacity-[0.03] pointer-events-none"
          viewBox="0 0 200 200"
          fill="none"
        >
          {[0, 40, 80, 120].map((y) =>
            [0, 46, 92, 138].map((x) => (
              <polygon
                key={`${x}-${y}`}
                points={`${x + 23},${y} ${x + 46},${y + 12} ${x + 46},${
                  y + 35
                } ${x + 23},${y + 46} ${x},${y + 35} ${x},${y + 12}`}
                stroke="white"
                strokeWidth="0.5"
              />
            ))
          )}
        </svg>

        {/* ── Hero content ── */}
        <div className="relative z-10 container px-4 py-32 pt-36 text-center">
          {/* Event badge */}
          <div className="inline-flex items-center gap-2 mb-8 animate-fade-up">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="glass text-[11px] uppercase tracking-[0.28em] text-amber-300/90 px-4 py-1.5 rounded-full font-body">
              April 10–20, 2026 &nbsp;·&nbsp; Kigali, Rwanda
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>

          {/* Main headline */}
          <h1 className="animate-fade-up font-display font-bold leading-[1.05] tracking-tight max-w-4xl mx-auto">
            <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white">
              Never Again
            </span>
            <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-gradient-hero mt-1">
              Hackathon 2026
            </span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up-delay text-white/60 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-7 leading-relaxed font-body font-light">
            Using AI and Innovation to Preserve Memory and Prevent Hate — a
            national student hackathon in remembrance of the{" "}
            <span className="text-white/80 font-medium">
              1994 Genocide against the Tutsi.
            </span>
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-up-delay flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link to="/submit">
              <button className="group relative inline-flex items-center gap-2.5 bg-white text-[#0B1A2E] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-white/95 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(255,255,255,0.2)] active:translate-y-0">
                Register Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link to="/about">
              <button className="group inline-flex items-center gap-2.5 glass text-white font-medium text-sm px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5">
                Learn More
                <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform opacity-60" />
              </button>
            </Link>
          </div>

          {/* Countdown timer */}
          <div className="animate-fade-up-delay-2 mt-16">
            <CountdownTimer />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-body">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-scroll-bounce" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. MISSION / WHY THIS MATTERS
      ══════════════════════════════════════════════════ */}
      <section className="section-dark py-24 md:py-32" ref={missionRef.ref}>
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div
              className={`reveal-left ${missionRef.inView ? "in-view" : ""}`}
            >
              <span className="inline-flex items-center gap-2 text-amber-400 text-xs uppercase tracking-[0.3em] font-body mb-6">
                <span className="h-px w-6 bg-amber-400" />
                Our Mission
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Technology as a{" "}
                <span className="text-gradient-memorial">
                  Tool for
                  <br />
                  Remembrance
                </span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-5 font-body">
                The 1994 Genocide against the Tutsi claimed over 1,000,000 lives
                in 100 days. Thirty two years later, the obligation to remember
                — <em>kwibuka</em> — remains urgent. As
                genocide ideology and hate speech spreads online, technology
                becomes our most powerful tool for truth and prevention.
              </p>
              <p className="text-white/60 leading-relaxed mb-5 font-body">
                This hackathon challenges Rwanda's brightest student minds to
                harness AI, data, and software to preserve survivor testimonies,
                detect and counter hate speech, and ensure the lessons of 1994
                are never forgotten.
              </p>
              <p className="text-white/80 leading-relaxed font-medium font-body">
                "Never Again" is not just a promise — it is a call to build.
              </p>
              <div className="mt-8 flex gap-4">
                <Link to="/about">
                  <Button
                    variant="outline"
                    className="border-white/20 bg-transparent text-white hover:bg-white/10 gap-2"
                  >
                    Our Story <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Image with quote overlay */}
            <div
              className={`relative reveal-right ${
                missionRef.inView ? "in-view" : ""
              } delay-200`}
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src={kwibuka}
                  alt="Memorial candle with Rwandan geometric patterns"
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2E]/95 via-[#0B1A2E]/30 to-transparent" />

                {/* Quote */}
                <blockquote className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="text-white/90 text-base leading-relaxed font-display italic mb-3">
                    "Memory is the only thing that prevents the repetition of
                    atrocities. When we forget, we open the door to new
                    horrors."
                  </p>
                  <cite className="text-white/50 text-xs uppercase tracking-widest font-body not-italic">
                    — In Memory of the 1994 Genocide against the Tutsi
                  </cite>
                </blockquote>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 glass-dark rounded-xl px-4 py-3 text-center animate-float-slow">
                <p className="text-2xl font-bold font-display text-white">
                  1M+
                </p>
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-body">
                  Lives Lost
                </p>
              </div>
              <div className="absolute -bottom-4 -left-4 glass-dark rounded-xl px-4 py-3 text-center animate-float-delayed">
                <p className="text-2xl font-bold font-display text-amber-400">
                  32
                </p>
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-body">
                  Years of Healing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3. STATS BAND
      ══════════════════════════════════════════════════ */}
      <section
        className="py-16 bg-[#0B2B40] border-y border-white/[0.06]"
        ref={statsRef.ref}
      >
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y-0">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center reveal ${
                  statsRef.inView ? "in-view" : ""
                } delay-${(i + 1) * 100}`}
              >
                <p className="text-4xl md:text-5xl font-display font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-white/50 text-sm font-body">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. WHAT TO EXPECT
      ══════════════════════════════════════════════════ */}
      <section className="section-deep py-24 md:py-32" ref={featuresRef.ref}>
        <div className="container">
          {/* Heading */}
          <div
            className={`text-center mb-16 reveal ${
              featuresRef.inView ? "in-view" : ""
            }`}
          >
            <span className="inline-flex items-center gap-2 text-violet-400 text-xs uppercase tracking-[0.3em] font-body mb-5">
              <span className="h-px w-6 bg-violet-400" />
              What to Expect
              <span className="h-px w-6 bg-violet-400" />
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Built for Impact,
              <br />
              Designed for Innovators
            </h2>
            <p className="text-white/50 max-w-xl mx-auto font-body">
              More than a competition — an experience that challenges you to
              build technology that genuinely matters.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`relative gradient-border-card glass rounded-2xl p-6 card-hover
                  reveal ${featuresRef.inView ? "in-view" : ""} delay-${
                  (i + 1) * 100
                }`}
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center h-11 w-11 rounded-xl bg-white/5 mb-5 ${f.color}`}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">
                  {f.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed font-body">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. COMPETITION TRACKS
      ══════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#F8F9FB]" ref={tracksRef.ref}>
        <div className="container">
          {/* Heading */}
          <div
            className={`text-center mb-16 reveal ${
              tracksRef.inView ? "in-view" : ""
            }`}
          >
            <span className="inline-flex items-center gap-2 text-violet-600 text-xs uppercase tracking-[0.3em] font-body mb-5">
              <span className="h-px w-6 bg-violet-400" />
              Innovation Categories
              <span className="h-px w-6 bg-violet-400" />
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Choose Your Track
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto font-body">
              Four pathways to making a difference. Each track challenges you to
              apply technology to the urgent work of remembrance and prevention.
            </p>
          </div>

          {/* Track cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRACKS.map((track, i) => (
              <Link
                key={track.title}
                to="/tracks"
                className={`group relative block rounded-2xl border border-slate-200 bg-white p-6 card-hover
                  reveal ${tracksRef.inView ? "in-view" : ""} delay-${
                  (i + 1) * 100
                }`}
              >
                {/* Gradient blob */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  {/* Icon ring */}
                  <div
                    className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ring-1 ${track.ring} bg-white mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <track.icon
                      className={`h-5.5 w-5.5 ${track.iconColor}`}
                      style={{ height: "1.375rem", width: "1.375rem" }}
                    />
                  </div>

                  <h3 className="font-display font-semibold text-slate-900 text-base mb-2 leading-snug">
                    {track.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-body mb-4">
                    {track.desc}
                  </p>

                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium font-body ${track.iconColor} group-hover:gap-2 transition-all`}
                  >
                    Learn More <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section className="section-dark py-24 md:py-32" ref={stepsRef.ref}>
        <div className="container">
          {/* Heading */}
          <div
            className={`text-center mb-16 reveal ${
              stepsRef.inView ? "in-view" : ""
            }`}
          >
            <span className="inline-flex items-center gap-2 text-blue-400 text-xs uppercase tracking-[0.3em] font-body mb-5">
              <span className="h-px w-6 bg-blue-400" />
              The Journey
              <span className="h-px w-6 bg-blue-400" />
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-white/50 max-w-xl mx-auto font-body">
              Five steps from registration to recognition. Here's what your
              hackathon journey looks like.
            </p>
          </div>

          {/* Steps — horizontal scroll on mobile, grid on desktop */}
          <div className="relative">
            {/* Connecting line — desktop only */}
            <div className="hidden lg:block absolute top-[2.25rem] left-[calc(10%+24px)] right-[calc(10%+24px)] h-px bg-gradient-to-r from-violet-500/30 via-blue-500/40 to-violet-500/30" />

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
              {STEPS.map((step, i) => (
                <div
                  key={step.title}
                  className={`relative flex flex-col items-center text-center
                    reveal ${stepsRef.inView ? "in-view" : ""} delay-${
                    (i + 1) * 100
                  }`}
                >
                  {/* Step icon */}
                  <div className="relative z-10 flex items-center justify-center h-12 w-12 rounded-full glass border border-violet-400/30 mb-5 group-hover:border-violet-400/60 transition-colors">
                    <step.icon className="h-5 w-5 text-violet-400" />
                    {/* Step number */}
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>

                  {/* Date chip */}
                  <span className="inline-block text-[10px] uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-3 py-0.5 mb-3 font-body">
                    {step.date}
                  </span>

                  <h3 className="font-display font-semibold text-white text-base mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/45 text-xs leading-relaxed font-body">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className={`text-center mt-14 reveal ${
              stepsRef.inView ? "in-view" : ""
            } delay-500`}
          >
            <Link to="/timeline">
              <Button
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/10 gap-2"
              >
                View Full Timeline <Calendar className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          7. PARTNERS & SPONSORS
      ══════════════════════════════════════════════════ */}
      <section
        className="py-20 bg-white border-y border-slate-100"
        ref={partnersRef.ref}
      >
        <div className="container">
          <div
            className={`text-center mb-12 reveal ${
              partnersRef.inView ? "in-view" : ""
            }`}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-body mb-2">
              Supported By
            </p>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Partners &amp; Sponsors
            </h2>
          </div>

          {/* Partner logos */}
          <div
            className={`flex flex-wrap justify-center items-center gap-4 md:gap-6 reveal ${
              partnersRef.inView ? "in-view" : ""
            } delay-200`}
          >
            {PARTNERS.map((partner) => (
              <div
                key={partner}
                className="partner-logo flex items-center justify-center px-6 py-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white transition-all cursor-default"
              >
                <span className="font-display font-semibold text-sm text-slate-600 whitespace-nowrap">
                  {partner}
                </span>
              </div>
            ))}
          </div>

          {/* Become a partner */}
          <div
            className={`text-center mt-10 reveal ${
              partnersRef.inView ? "in-view" : ""
            } delay-300`}
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 transition-colors font-body"
            >
              Become a Partner <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          8. PRE-FOOTER CTA
      ══════════════════════════════════════════════════ */}
      <section
        className="relative py-28 md:py-36 overflow-hidden noise-overlay"
        style={{
          background:
            "linear-gradient(135deg, #0B1A2E 0%, #1A0B3B 50%, #0B1A2E 100%)",
        }}
        ref={ctaRef.ref}
      >
        {/* Background orbs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-600/15 blur-[80px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/10 blur-[60px] pointer-events-none" />

        {/* Soft ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />

        <div className="relative z-10 container text-center">
          <div className={`reveal ${ctaRef.inView ? "in-view" : ""}`}>
            <span className="inline-flex items-center gap-2 text-amber-400 text-xs uppercase tracking-[0.3em] font-body mb-6">
              <span className="h-px w-6 bg-amber-400" />
              Join the Movement
              <span className="h-px w-6 bg-amber-400" />
            </span>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl mx-auto">
              Ready to Build
              <br />
              <span className="text-gradient-hero">for Change?</span>
            </h2>
            <p className="text-white/55 text-base md:text-lg max-w-xl mx-auto mb-10 font-body leading-relaxed">
              Join Rwanda's brightest student innovators in using technology to
              preserve memory and build a better, more just future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/submit">
                <button className="group relative inline-flex items-center gap-2.5 bg-white text-[#0B1A2E] font-semibold text-base px-8 py-4 rounded-xl hover:bg-white/95 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(255,255,255,0.2)] animate-pulse-glow">
                  Register for the Hackathon
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link to="/timeline">
                <button className="inline-flex items-center gap-2.5 glass text-white font-medium text-base px-8 py-4 rounded-xl hover:bg-white/10 transition-all hover:-translate-y-0.5">
                  View Timeline
                  <Calendar className="h-5 w-5 opacity-70" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
