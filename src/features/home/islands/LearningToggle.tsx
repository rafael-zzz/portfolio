import { useId, useState } from "preact/hooks";

interface SkillItem {
  name: string;
  icon: string;
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
        className="learning-toggle font-['Departure_Mono'] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((previous) => !previous)}
      >
        {label}
      </button>

      <div id={panelId} hidden={!isOpen} className="skills-container md:grid learning-content">
        {items.map((item) => (
          <div className="skill-card" key={item.name}>
            <div className="skill-header">
              <img src={item.icon} alt={item.name} className="skill-icon" />
            </div>
            <p className="text-l font-['Departure_Mono'] skill-title">{item.name}</p>
          </div>
        ))}
      </div>
    </>
  );
}
