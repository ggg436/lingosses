"use client";

import { Card } from "@/components/ui/card";

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
  return (
    <div className="space-y-8">
      {units.map((unit) => (
        <Card key={unit.id} className="p-6">
          <h2 className="text-xl font-bold mb-4">{unit.title}</h2>
          <p className="text-muted-foreground mb-4">{unit.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unit.lessons.map((lesson) => (
              <Card 
                key={lesson.id} 
                className={`p-4 border-2 ${lesson.completed ? "border-green-500" : "border-slate-200"}`}
              >
                <h3 className="font-medium">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {lesson.completed ? "Completed" : "Not completed"}
                </p>
              </Card>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}; 