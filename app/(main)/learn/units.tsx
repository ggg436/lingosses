"use client";

import { useEffect, useState } from "react";
import { Unit } from "./unit";

interface Course {
  id: number;
  title: string;
  imageSrc: string;
}

interface Lesson {
  id: number;
  title: string;
  unitId: number;
  order: number;
  completed: boolean;
}

interface Unit {
  id: number;
  title: string;
  description: string;
  courseId: number;
  order: number;
  lessons: Lesson[];
}

interface UnitsProps {
  units: Unit[];
  activeCourse: Course;
}

export const Units = ({
  units,
  activeCourse
}: UnitsProps) => {
  // Sort units by order
  const sortedUnits = [...units].sort((a, b) => a.order - b.order);
  
  // Find the first incomplete lesson or default to the first lesson of the first unit
  const firstIncompleteLesson = sortedUnits.flatMap(unit => 
    unit.lessons.find(lesson => !lesson.completed)
  )[0] || sortedUnits[0]?.lessons[0];
  
  // In a real implementation, this would be fetched from the server
  // We're using a fixed value for simplicity
  const [activeLessonPercentage, setActiveLessonPercentage] = useState(0);

  return (
    <div>
      {sortedUnits.map((unit) => (
        <div key={unit.id} className="mb-10">
          <Unit 
            id={unit.id}
            order={unit.order}
            title={unit.title}
            description={unit.description}
            lessons={unit.lessons}
            activeLesson={firstIncompleteLesson ? {
              ...firstIncompleteLesson,
              unit: unit
            } : undefined}
            activeLessonPercentage={activeLessonPercentage}
          />
        </div>
      ))}
    </div>
  );
}; 