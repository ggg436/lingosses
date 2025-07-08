import { UnitBanner } from "./unit-banner";
import { LessonButton } from "./lesson-button";

interface Lesson {
  id: number;
  title: string;
  unitId: number;
  order: number;
  completed: boolean;
}

interface UnitType {
  id: number;
  title: string;
  description: string;
  courseId: number;
  order: number;
  lessons: Lesson[];
}

type Props = {
  id: number;
  order: number;
  title: string;
  description: string;
  lessons: Lesson[];
  activeLesson: (Lesson & {
    unit: UnitType;
  }) | undefined;
  activeLessonPercentage: number;
};

export const Unit = ({
  id,
  order,
  title,
  description,
  lessons,
  activeLesson,
  activeLessonPercentage,
}: Props) => {
  return (
    <>
      <UnitBanner title={title} description={description} />
      <div className="flex items-center flex-col relative">
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.id === activeLesson?.id;
          const isLocked = !lesson.completed && !isCurrent;

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              current={isCurrent}
              locked={isLocked}
              percentage={activeLessonPercentage}
            />
          );
        })}
      </div>
    </>
  );
};
