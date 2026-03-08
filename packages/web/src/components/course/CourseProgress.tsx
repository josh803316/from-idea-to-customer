import { useState, useEffect } from 'react';
import { parseProgress, getCourseCompletion } from '@/lib/progress';

interface Props {
  courseSlug: string;
  totalLessons: number;
}

export default function CourseProgress({ courseSlug, totalLessons }: Props) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('fitc_progress='))
      ?.split('=')[1];
    const store = parseProgress(cookieValue);
    setPct(getCourseCompletion(store, courseSlug, totalLessons));
  }, [courseSlug, totalLessons]);

  if (pct === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Your progress</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
