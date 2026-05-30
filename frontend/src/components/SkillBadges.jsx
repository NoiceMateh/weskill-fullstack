import { SKILL_AREAS } from "../constants/skillAreas";

// Component to display skill area badges
export default function SkillBadges({ skillAreas = [] }) {
  if (!skillAreas || skillAreas.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skillAreas.map((skillKey, index) => {
        // Handle both string keys and full skill names
        const skillData = SKILL_AREAS[skillKey];

        if (!skillData) return null;

        return (
          <span
            key={index}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${skillData.color}`}
            title={skillData.name}
          >
            {skillData.name}
          </span>
        );
      })}
    </div>
  );
}

