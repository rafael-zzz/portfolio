export interface SkillItem {
  name: string;
  id: string;
}

export const coreSkills: SkillItem[] = [
  { name: "Systems Architecture", id: "0x01" },
  { name: "Penetration Testing", id: "0x02" },
  { name: "Network Security", id: "0x03" },
  { name: "Python / C", id: "0x04" },
  { name: "Linux Administration", id: "0x05" },
  { name: "Docker / K8s", id: "0x06" },
];

export const learningSkills: SkillItem[] = [
  { name: "Machine Learning", id: "0x0A" },
  { name: "Quantum Computing", id: "0x0B" },
  { name: "Formal Verification", id: "0x0C"},
];
