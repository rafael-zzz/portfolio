import type { LocalizedContent } from "@/shared/lib/localizedContent";
import type { ProjectEntry } from "@/features/projects/lib/content";

export interface ProjectCard {
  title: string;
  summary: string;
  role: string;
  status: string;
  stack: string[];
  year: number;
  repoUrl?: string;
  isFallback: boolean;
}

export function buildProjectCards(
  entries: Array<LocalizedContent<ProjectEntry>>,
): ProjectCard[] {
  return entries.map((entry) => ({
    title: entry.entry.data.title,
    summary: entry.entry.data.summary,
    role: entry.entry.data.role,
    status: entry.entry.data.status,
    stack: entry.entry.data.stack,
    year: entry.entry.data.year,
    repoUrl: entry.entry.data.repoUrl,
    isFallback: entry.isFallback,
  }));
}
