export interface SkillItem {
  name: string;
  icon: string;
}

export const coreSkills: SkillItem[] = [
  { name: "MacOS", icon: "https://skillicons.dev/icons?i=apple" },
  { name: "Linux", icon: "https://skillicons.dev/icons?i=linux" },
  { name: "Windows", icon: "https://skillicons.dev/icons?i=windows" },
  { name: "Neovim", icon: "https://skillicons.dev/icons?i=neovim" },
  { name: "Bash", icon: "https://skillicons.dev/icons?i=bash" },
  { name: "C", icon: "https://skillicons.dev/icons?i=c" },
];

export const learningSkills: SkillItem[] = [
  { name: "Rust", icon: "https://skillicons.dev/icons?i=rust" },
  { name: "Haskell", icon: "https://skillicons.dev/icons?i=haskell" },
];
