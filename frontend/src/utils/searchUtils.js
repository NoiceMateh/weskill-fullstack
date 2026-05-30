// Utility functions for advanced course search
export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s]/g, ' ') // Replace special chars with space
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

export const calculateSearchScore = (course, query) => {
  const normalizedQuery = normalizeText(query);
  const queryWords = normalizedQuery.split(' ').filter(word => word.length > 0);

  let totalScore = 0;
  let matchCount = 0;

  // Search in course name (highest weight)
  const normalizedName = normalizeText(course.name);
  queryWords.forEach(word => {
    if (normalizedName.includes(word)) {
      totalScore += 100; // High score for name matches
      matchCount++;
    }
  });

  // Search in description
  if (course.description) {
    const normalizedDesc = normalizeText(course.description);
    queryWords.forEach(word => {
      if (normalizedDesc.includes(word)) {
        totalScore += 50; // Medium score for description matches
        matchCount++;
      }
    });
  }

  // Search in skills/tags
  if (course.skills && Array.isArray(course.skills)) {
    course.skills.forEach(skill => {
      const normalizedSkill = normalizeText(skill);
      queryWords.forEach(word => {
        if (normalizedSkill.includes(word)) {
          totalScore += 75; // High score for skill matches
          matchCount++;
        }
      });
    });
  }

  // Search in track name
  const trackName = getTrackName(course.track);
  if (trackName) {
    const normalizedTrack = normalizeText(trackName);
    queryWords.forEach(word => {
      if (normalizedTrack.includes(word)) {
        totalScore += 60; // Medium-high score for track matches
        matchCount++;
      }
    });
  }

  // Bonus for exact phrase matches
  if (normalizedName.includes(normalizedQuery)) {
    totalScore += 200;
  }

  // Bonus for multiple word matches
  if (matchCount > 1) {
    totalScore += matchCount * 25;
  }

  return totalScore;
};

export const searchCourses = (courses, query) => {
  if (!query || query.trim() === '') {
    return courses;
  }

  const scoredCourses = courses.map(course => ({
    ...course,
    searchScore: calculateSearchScore(course, query)
  }));

  // Filter courses with score > 0 and sort by score descending
  return scoredCourses
    .filter(course => course.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore);
};

// Helper function to get track name (you might need to import this from tracks.js)
const getTrackName = (trackId) => {
  const tracks = {
    'it': 'Công nghệ thông tin',
    'business': 'Kinh doanh',
    'design': 'Thiết kế',
    'marketing': 'Marketing',
    'data': 'Phân tích dữ liệu',
    'language': 'Ngoại ngữ'
  };
  return tracks[trackId] || trackId;
};