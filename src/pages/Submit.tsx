import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import SectionHeading from "@/components/SectionHeading";
import { CheckCircle, Upload, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  "AI & Machine Learning",
  "Web & Mobile Development",
  "Cybersecurity & Anti-Hate Tech",
];

const sectors = [
  { value: "Secondary School", label: "Secondary School" },
  { value: "University", label: "University" },
];

interface TeamMember {
  name: string;
  email: string;
}

const emptyMember = (): TeamMember => ({ name: "", email: "" });

const Submit = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [sector, setSector] = useState("");
  const [school, setSchool] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([emptyMember(), emptyMember(), emptyMember()]);
  const [projectTitle, setProjectTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    setMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    const key = `member${index + 1}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const clearError = (key: string) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!sector) errs.sector = "Please select a sector";
    if (!school.trim()) errs.school = "School / institution name is required";

    members.forEach((m, i) => {
      const label = i === 0 ? "Team leader" : `Member ${i + 1}`;
      if (!m.name.trim()) errs[`member${i + 1}Name`] = `${label} name is required`;
      if (!m.email.trim()) errs[`member${i + 1}Email`] = `${label} email is required`;
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email)) errs[`member${i + 1}Email`] = `${label} email is invalid`;
    });

    if (!projectTitle.trim()) errs.projectTitle = "Project title is required";
    if (!category) errs.category = "Please select a category";
    if (!description.trim()) errs.description = "Project description is required";
    else if (description.trim().length < 50) errs.description = "Description must be at least 50 characters";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Compose full_name from all 3 members
    const fullName = members.map((m) => m.name.trim()).join(" | ");

    // Store member emails + sector in structured description prefix
    const teamInfo = `SECTOR: ${sector}\n\nTEAM MEMBERS:\n${members
      .map((m, i) => `${i + 1}. ${m.name.trim()} — ${m.email.trim()}${i === 0 ? " (Team Leader)" : ""}`)
      .join("\n")}\n\nPROJECT DESCRIPTION:\n`;

    const { error } = await supabase.from("submissions").insert({
      full_name: fullName,
      school: `${school.trim()} (${sector})`,
      email: members[0].email.trim(),
      project_title: projectTitle.trim(),
      category,
      description: teamInfo + description.trim(),
      github_link: githubLink.trim() || null,
    });

    setLoading(false);
    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "Registration successful!", description: "Your team has been registered for the hackathon." });
    }
  };

  if (submitted) {
    return (
      <div className="py-20 bg-background">
        <div className="container max-w-lg text-center">
          <div className="bg-card border border-border rounded-lg p-12">
            <CheckCircle className="h-16 w-16 text-memorial mx-auto mb-6" />
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">Registration Successful!</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your team has been registered for the Never Again AI Hackathon 2026. A confirmation will be sent to{" "}
              <strong className="text-foreground">{members[0].email}</strong>.
            </p>
            <Button
              variant="memorial"
              className="mt-6"
              onClick={() => {
                setSubmitted(false);
                setSector(""); setSchool(""); setProjectTitle(""); setCategory(""); setDescription(""); setGithubLink("");
                setMembers([emptyMember(), emptyMember(), emptyMember()]);
              }}
            >
              Register Another Team
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-background">
      <div className="container max-w-2xl">
        <SectionHeading
          title="Register Your Team"
          subtitle="Register your 3-member team and submit your project for the hackathon. Open to secondary schools and universities only."
        />

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 sm:p-8 space-y-6">

          {/* Sector + School */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest border-b border-border pb-2">
              Institution
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label>Sector *</Label>
                <Select value={sector} onValueChange={(v) => { setSector(v); clearError("sector"); }}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sector && <p className="text-sm text-destructive mt-1">{errors.sector}</p>}
              </div>
              <div>
                <Label htmlFor="school">School / Institution *</Label>
                <Input
                  id="school"
                  placeholder={sector === "University" ? "e.g. University of Rwanda" : "e.g. Lycée de Kigali"}
                  value={school}
                  onChange={(e) => { setSchool(e.target.value); clearError("school"); }}
                  className="mt-1.5"
                />
                {errors.school && <p className="text-sm text-destructive mt-1">{errors.school}</p>}
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest border-b border-border pb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Members (exactly 3)
            </h3>

            {members.map((member, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/40 border border-border space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {i === 0 ? "Member 1 — Team Leader" : `Member ${i + 1}`}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`member${i + 1}Name`}>Full Name *</Label>
                    <Input
                      id={`member${i + 1}Name`}
                      placeholder="e.g. Jean Mutsinzi"
                      value={member.name}
                      onChange={(e) => updateMember(i, "name", e.target.value)}
                      className="mt-1.5"
                    />
                    {errors[`member${i + 1}Name`] && (
                      <p className="text-sm text-destructive mt-1">{errors[`member${i + 1}Name`]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`member${i + 1}Email`}>Email Address *</Label>
                    <Input
                      id={`member${i + 1}Email`}
                      type="email"
                      placeholder="member@example.com"
                      value={member.email}
                      onChange={(e) => updateMember(i, "email", e.target.value)}
                      className="mt-1.5"
                    />
                    {errors[`member${i + 1}Email`] && (
                      <p className="text-sm text-destructive mt-1">{errors[`member${i + 1}Email`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest border-b border-border pb-2">
              Project Details
            </h3>

            <div>
              <Label htmlFor="projectTitle">Project Title *</Label>
              <Input
                id="projectTitle"
                placeholder="e.g. MemoryGuard AI"
                value={projectTitle}
                onChange={(e) => { setProjectTitle(e.target.value); clearError("projectTitle"); }}
                className="mt-1.5"
              />
              {errors.projectTitle && <p className="text-sm text-destructive mt-1">{errors.projectTitle}</p>}
            </div>

            <div>
              <Label>Category *</Label>
              <Select value={category} onValueChange={(v) => { setCategory(v); clearError("category"); }}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a track" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
            </div>

            <div>
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                rows={5}
                placeholder="Describe your project, its goals, and how it relates to the hackathon theme (min 50 characters)..."
                value={description}
                onChange={(e) => { setDescription(e.target.value); clearError("description"); }}
                className="mt-1.5"
              />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
            </div>

            <div>
              <Label htmlFor="githubLink">GitHub / Project Link (optional)</Label>
              <Input
                id="githubLink"
                placeholder="https://github.com/your-project"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>File Upload (optional)</Label>
              <div className="mt-1.5 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-memorial/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Drag & drop files here, or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, PPTX, or ZIP (max 10MB)</p>
              </div>
            </div>
          </div>

          <Button type="submit" variant="memorial" size="lg" className="w-full" disabled={loading}>
            {loading ? "Submitting…" : "Register Team"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Submit;
