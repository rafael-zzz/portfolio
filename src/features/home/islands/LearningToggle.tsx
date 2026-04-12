import { useId, useState } from "preact/hooks";

interface SkillItem {
  name: string;
  id: string;
}

interface Props {
  label: string;
  items: SkillItem[];
}

export default function LearningToggle({ label, items }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const panelId = useId();

  return (
    <>
      <button
        type="button"
        className="learning-toggle hover-glow font-['Departure_Mono'] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((previous) => !previous)}
      >
        {label}
      </button>

      <div id={panelId} hidden={!isOpen} className="skills-container md:grid learning-content">
        {items.map((item) => (
          <div className="skill-card hover-glow" key={item.name}>
            <span className="skill-module-id">MOD_{item.id}</span>
            <p className="text-l font-['Departure_Mono'] skill-title">&gt; {item.name}</p>
          </div>
        ))}
      </div>
    </>
  );
}
