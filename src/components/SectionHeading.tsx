interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const SectionHeading = ({ title, subtitle, centered = true }: SectionHeadingProps) => (
  <div className={`mb-10 ${centered ? "text-center" : ""}`}>
    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">{title}</h2>
    {subtitle && (
      <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
    )}
    <div className={`mt-4 h-1 w-16 rounded-full bg-memorial ${centered ? "mx-auto" : ""}`} />
  </div>
);

export default SectionHeading;
