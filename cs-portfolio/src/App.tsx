import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  MapPin,
  Calendar,
  FileText,
  Link as LinkIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ---------- YOUR INFO ----------
const YOUR_NAME = "Ezequiel Alcaraz";
const TAGLINE = "CS student • passionate about software design and data systems";
const EDUCATION_LINE =
  "B.S. Computer Science • California State University, Sacramento (Exp. 2026)";
const LOCATION = "Sacramento, California";
const EMAIL = "ezequielleonalcaraz@gmail.com";
const RESUME_URL = "/Ezequiel_Alcaraz_Resume.pdf";
const GITHUB = "https://github.com/ealeonraz";
const LINKEDIN = "https://www.linkedin.com/in/ezequiel-a-2a401824a/";

// ---------- DATA ----------
const SKILLS: string[] = [
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "C/C++",
  "React",
  "Node.js",
  "Express",
  "Next.js",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "Git",
  "Linux",
  "Vite",
];

const PROJECTS = [
  {
    title: "Go Tutor Academy",
    period: "2023 – 2024",
    description:
      "Full-stack tutoring platform with scheduling, booking, and payroll features. Implemented secure authentication, responsive design, and RESTful APIs for data flow.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Vite"],
    links: [
      {
        label: "Website",
        href: "https://gotutor.academy/",
        icon: <ExternalLink className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Learn Linear Algebra",
    period: "2024 – 2025",
    description:
      "Interactive educational site to teach and practice linear algebra concepts through proofs, examples, and problem sets. Built with Next.js and TypeScript for scalability.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    links: [
      {
        label: "Website",
        href: "https://learnlinearalgebra.com",
        icon: <ExternalLink className="h-4 w-4" />,
      },
    ],
  },
];

const EXPERIENCE = [
  {
    role: "IT Help Desk Technician",
    org: "California Department of Public Health",
    period: "Mar 2023 – Present",
    bullets: [
      "Resolved 4,000+ technical tickets, improving accessibility and turnaround times for users across multiple departments.",
      "Automated SQL Server data validation processes, reducing identity-related support tickets by 15% and improving data integrity.",
      "Developed targeted SQL queries and reports to provide actionable insights for licensing and support teams.",
      "Led daily scrum meetings to review ticket progress, identify blockers, and assist colleagues with technical troubleshooting.",
      "Provided documentation and training for new technicians to streamline onboarding and ensure consistency in support quality.",
    ],
  },
];

// ---------- COMPONENTS ----------
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-semibold text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent py-2"
    >
      {children}
    </motion.h2>
  );
}

function ProjectCard({ p }: { p: (typeof PROJECTS)[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="h-full flex flex-col justify-between rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 shadow-md hover:shadow-cyan-500/10 transition-all">
        <CardContent className="p-6 flex flex-col flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">{p.title}</h3>
              <div className="text-sm text-neutral-400 flex items-center gap-2 mt-1">
                <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                <span>{p.period}</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-neutral-300 leading-6 flex-grow">
            {p.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 hover:bg-cyan-500/20 transition"
              >
                {t}
              </Badge>
            ))}
          </div>

          {p.links && (
            <div className="mt-auto pt-5 flex flex-wrap gap-3">
              {p.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-200 transition"
                >
                  {l.icon}
                  <span>{l.label}</span>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---------- MAIN ----------
export default function Portfolio() {
  return (
    <div className="dark bg-neutral-950 text-neutral-50 min-h-screen transition-colors">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur bg-neutral-950/70 border-b border-neutral-800/50">
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-3 flex items-center justify-between">
          <a
            href="#top"
            className="font-semibold tracking-tight text-neutral-200 hover:text-cyan-400 transition"
          >
            {YOUR_NAME}
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            {["Projects", "Experience", "Skills", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-cyan-400 transition"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main id="top" className="mx-auto w-full max-w-screen-2xl px-4">
        {/* HERO */}
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Hi, I'm {YOUR_NAME}
            </h1>
            <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              {TAGLINE}
            </p>
            <p className="mt-2 text-sm text-neutral-500">{EDUCATION_LINE}</p>

            <div className="mt-6 flex justify-center gap-6 text-sm text-neutral-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" /> {LOCATION}
              </div>
              <a
                href={GITHUB}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-cyan-400 transition"
              >
                <Github className="inline h-4 w-4 mr-1" /> GitHub
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-cyan-400 transition"
              >
                <Linkedin className="inline h-4 w-4 mr-1" /> LinkedIn
              </a>
            </div>
          </motion.div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="py-16">
          <SectionHeading>Projects</SectionHeading>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.title} p={p} />
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="py-16">
          <SectionHeading>Experience</SectionHeading>
          <div className="mt-10 grid gap-6 max-w-3xl mx-auto">
            {EXPERIENCE.map((e) => (
              <motion.div
                key={e.role}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="rounded-2xl bg-neutral-900 border border-neutral-800 shadow-md hover:shadow-cyan-500/10 transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {e.role}
                        </h3>
                        <p className="text-sm text-neutral-400">{e.org}</p>
                      </div>
                      <div className="text-sm text-neutral-400 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                        {e.period}
                      </div>
                    </div>
                    <ul className="mt-3 list-disc pl-5 text-sm text-neutral-400 space-y-1">
                      {e.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="py-16">
          <SectionHeading>Skills</SectionHeading>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {SKILLS.map((s) => (
              <motion.div
                key={s}
                whileHover={{ scale: 1.1 }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600/20 to-purple-600/20 text-cyan-300 border border-cyan-500/30 text-sm font-medium shadow-sm hover:shadow-cyan-500/10 transition"
              >
                {s}
              </motion.div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-20 text-center">
          <SectionHeading>Get in touch</SectionHeading>
          <p className="mt-4 text-neutral-400 max-w-lg mx-auto">
            Want to collaborate, have a question, or just say hi? Reach out —
            I’d love to connect.
          </p>
          <div className="mt-6 flex justify-center flex-wrap gap-4">
            <a href={`mailto:${EMAIL}`}>
              <Button className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/20 transition">
                <Mail className="h-4 w-4 mr-2" /> Email
              </Button>
            </a>
            <a href={RESUME_URL} target="_blank" rel="noreferrer noopener">
              <Button className="rounded-2xl border border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 transition">
                <FileText className="h-4 w-4 mr-2 text-cyan-400" /> Resume
              </Button>
            </a>
            <a href={GITHUB} target="_blank" rel="noreferrer noopener">
              <Button className="rounded-2xl border border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 transition">
                <Github className="h-4 w-4 mr-2 text-cyan-400" /> GitHub
              </Button>
            </a>
            <a href={LINKEDIN} target="_blank" rel="noreferrer noopener">
              <Button className="rounded-2xl border border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 transition">
                <Linkedin className="h-4 w-4 mr-2 text-cyan-400" /> LinkedIn
              </Button>
            </a>
          </div>
        </section>

        <footer className="py-10 text-center text-xs text-neutral-500">
          <div className="inline-flex items-center gap-2">
            <LinkIcon className="h-3.5 w-3.5 text-cyan-400" />
            <span>Built with React + Tailwind + Framer Motion</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
