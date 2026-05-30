import { isMongoReady } from "../config/db.js";
import { Roadmap } from "../models/Roadmap.js";
import { memory, makeId, clone } from "../data/memoryStore.js";
import { defaultRoadmapModules } from "../data/seedData.js";
import { getCourse } from "./courseService.js";

export function normalizeRoadmapModules(modules = []) {
  const usedKeys = new Set();

  return (Array.isArray(modules) ? modules : []).map((module, moduleIndex) => ({
    title: module.title || `Module ${moduleIndex + 1}`,
    order: Number.isFinite(Number(module.order)) ? Number(module.order) : moduleIndex,
    lessons: (Array.isArray(module.lessons) ? module.lessons : []).map((lesson, lessonIndex) => {
      const fallbackKey = `module-${moduleIndex}-lesson-${lessonIndex}`;
      const baseKey = String(lesson.key || fallbackKey).trim() || fallbackKey;
      let key = baseKey;
      let suffix = 2;
      while (usedKeys.has(key)) {
        key = `${baseKey}-${suffix}`;
        suffix += 1;
      }
      usedKeys.add(key);

      return {
        key,
        title: lesson.title || `Bài ${lessonIndex + 1}`,
        order: Number.isFinite(Number(lesson.order)) ? Number(lesson.order) : lessonIndex,
        description: lesson.description || "",
        durationMinutes: Number(lesson.durationMinutes) || 0,
        imageUrl: lesson.imageUrl || "",
        videoUrl: lesson.videoUrl || "",
        youtubeUrl: lesson.youtubeUrl || "",
        resources: Array.isArray(lesson.resources)
          ? lesson.resources.map((resource) => ({
              title: resource.title || "",
              type: resource.type || "Link",
              url: resource.url || "",
            }))
          : [],
      };
    }),
  }));
}

export async function getRoadmapByCourseId(courseId) {
  await getCourse(courseId);

  if (isMongoReady()) {
    let roadmap = await Roadmap.findOne({ courseId });
    if (!roadmap) roadmap = await Roadmap.create({ courseId, modules: normalizeRoadmapModules(defaultRoadmapModules) });
    else {
      const normalizedModules = normalizeRoadmapModules(roadmap.modules);
      const current = JSON.stringify(roadmap.modules);
      const next = JSON.stringify(normalizedModules);
      if (current !== next) {
        roadmap.modules = normalizedModules;
        await roadmap.save();
      }
    }
    return roadmap.toJSON();
  }

  let roadmap = memory.roadmaps.find((item) => item.courseId === courseId);
  if (!roadmap) {
    roadmap = { id: makeId("roadmap"), courseId, modules: normalizeRoadmapModules(clone(defaultRoadmapModules)) };
    memory.roadmaps.push(roadmap);
  } else {
    roadmap.modules = normalizeRoadmapModules(roadmap.modules);
  }
  return clone(roadmap);
}

export async function saveRoadmap(courseId, modules) {
  await getCourse(courseId);
  const normalizedModules = normalizeRoadmapModules(modules);

  if (isMongoReady()) {
    const roadmap = await Roadmap.findOneAndUpdate(
      { courseId },
      { courseId, modules: normalizedModules },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return roadmap.toJSON();
  }

  let roadmap = memory.roadmaps.find((item) => item.courseId === courseId);
  if (!roadmap) {
    roadmap = { id: makeId("roadmap"), courseId, modules: normalizedModules };
    memory.roadmaps.push(roadmap);
  } else {
    roadmap.modules = clone(normalizedModules);
  }
  return clone(roadmap);
}
