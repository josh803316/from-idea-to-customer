/**
 * Cookie-based progress tracking — pure functions, no side effects.
 *
 * Cookie name: fitc_progress
 * Cookie format: { [courseSlug]: { completedLessons: string[] } }
 *
 * No server-side persistence in MVP — progress lives in the browser cookie.
 * Lesson 1 of "Thinking Like a CTO": this is a deliberate scope decision.
 * We can add server sync later without changing the client API.
 */

export interface CourseProgress {
  completedLessons: string[];
}

export type ProgressStore = Record<string, CourseProgress>;

export function parseProgress(cookieValue: string | undefined): ProgressStore {
  if (!cookieValue) return {};
  try {
    return JSON.parse(decodeURIComponent(cookieValue)) as ProgressStore;
  } catch {
    return {};
  }
}

export function serializeProgress(store: ProgressStore): string {
  return encodeURIComponent(JSON.stringify(store));
}

export function markComplete(
  store: ProgressStore,
  courseSlug: string,
  lessonSlug: string,
): ProgressStore {
  const course = store[courseSlug] ?? { completedLessons: [] };
  if (course.completedLessons.includes(lessonSlug)) return store;

  return {
    ...store,
    [courseSlug]: {
      ...course,
      completedLessons: [...course.completedLessons, lessonSlug],
    },
  };
}

export function getProgress(store: ProgressStore, courseSlug: string): CourseProgress {
  return store[courseSlug] ?? { completedLessons: [] };
}

export function getCourseCompletion(
  store: ProgressStore,
  courseSlug: string,
  totalLessons: number,
): number {
  if (totalLessons === 0) return 0;
  const completed = getProgress(store, courseSlug).completedLessons.length;
  return Math.round((completed / totalLessons) * 100);
}

export function isLessonComplete(
  store: ProgressStore,
  courseSlug: string,
  lessonSlug: string,
): boolean {
  return getProgress(store, courseSlug).completedLessons.includes(lessonSlug);
}
