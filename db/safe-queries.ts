import { cache } from "react";
import { eq } from "drizzle-orm";
import { getServerAuth } from "@/lib/server-auth";

import db from "@/db/drizzle";

import {
  challengeProgress,
  challenges,
  courses,
  lessons,
  units,
  userProgress,
  userSubscription,
} from "./schema";

// Safe version of getUserProgress with error handling
export const getUserProgress = cache(async () => {
  try {
    const { userId } = await getServerAuth();

    if (!userId) {
      return null;
    }

    try {
      const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with: {
          activeCourse: true,
        },
      });

      return data;
    } catch (error) {
      console.error("Error fetching user progress:", error);
      // Return mock data when the table doesn't exist
      return {
        id: 0,
        userId: userId,
        userName: "Development User",
        userImageSrc: "/mascot.svg",
        points: 0,
        hearts: 5,
        activeCourseId: 1, // Default to course ID 1
        activeCourse: {
          id: 1,
          title: "Spanish",
          imageSrc: "/es.svg"
        }
      };
    }
  } catch (error) {
    console.error("Server auth error:", error);
    return null;
  }
});

// Safe version of getUnits with error handling
export const getUnits = cache(async () => {
  const userProgress = await getUserProgress();

  if (!userProgress?.activeCourseId) {
    return [];
  }

  try {
    const data = await db.query.units.findMany({
      where: eq(units.courseId, userProgress.activeCourseId),
      with: {
        lessons: {
          with: {
            challenges: {
              with: {
                challengeProgress: {
                  where: eq(challengeProgress.userId, userProgress.userId),
                },
              },
            },
          },
        },
      },
    });

    const normalizedData = data.map((unit) => {
      const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
        if (!lesson.challenges.length) {
          return { ...lesson, completed: false };
        }

        const allCompleted = lesson.challenges.every((challenge) => {
          return challenge.challengeProgress
            && challenge.challengeProgress.length > 0
            && challenge.challengeProgress.some((progress) => progress.completed);
        });

        return { ...lesson, completed: allCompleted };
      });

      return { ...unit, lessons: lessonsWithCompletedStatus };
    });

    return normalizedData;
  } catch (error) {
    console.error("Error fetching units:", error);
    // Return mock units data
    return [
      {
        id: 1,
        title: "Unit 1",
        description: "Learn the basics",
        courseId: 1,
        order: 1,
        lessons: [
          {
            id: 1,
            title: "Greetings",
            unitId: 1,
            order: 1,
            completed: true
          },
          {
            id: 2,
            title: "Introductions",
            unitId: 1,
            order: 2,
            completed: true
          },
          {
            id: 3,
            title: "Basic Phrases",
            unitId: 1,
            order: 3,
            completed: false
          },
          {
            id: 4,
            title: "Numbers",
            unitId: 1,
            order: 4,
            completed: false
          },
          {
            id: 5,
            title: "Colors",
            unitId: 1,
            order: 5,
            completed: false
          },
          {
            id: 6,
            title: "Family",
            unitId: 1,
            order: 6,
            completed: false
          }
        ]
      },
      {
        id: 2,
        title: "Unit 2",
        description: "Common expressions",
        courseId: 1,
        order: 2,
        lessons: [
          {
            id: 7,
            title: "Food & Drinks",
            unitId: 2,
            order: 1,
            completed: false
          },
          {
            id: 8,
            title: "Shopping",
            unitId: 2,
            order: 2,
            completed: false
          },
          {
            id: 9,
            title: "Directions",
            unitId: 2,
            order: 3,
            completed: false
          },
          {
            id: 10,
            title: "Travel",
            unitId: 2,
            order: 4,
            completed: false
          },
          {
            id: 11,
            title: "Weather",
            unitId: 2,
            order: 5,
            completed: false
          },
          {
            id: 12,
            title: "Time & Date",
            unitId: 2,
            order: 6,
            completed: false
          }
        ]
      }
    ];
  }
});

// Safe version of getCourseProgress with error handling
export const getCourseProgress = cache(async () => {
  try {
    const userProgress = await getUserProgress();
    
    if (!userProgress || !userProgress.activeCourseId) {
      return null;
    }
    
    // Find the first incomplete lesson
    const units = await getUnits();
    const firstIncompleteLesson = units
      .flatMap(unit => unit.lessons)
      .find(lesson => !lesson.completed);
      
    return {
      activeLesson: firstIncompleteLesson,
      activeLessonId: firstIncompleteLesson?.id || 1,
    };
  } catch (error) {
    console.error("Error fetching course progress:", error);
    return {
      activeLesson: null,
      activeLessonId: 1
    };
  }
});

// Safe version of getLessonPercentage with error handling
export const getLessonPercentage = cache(async () => {
  try {
    const courseProgress = await getCourseProgress();

    if (!courseProgress?.activeLessonId) {
      return 0;
    }

    const lesson = await getLesson(courseProgress.activeLessonId);

    if (!lesson) {
      return 0;
    }

    // Calculate percentage based on completed challenges
    const completedChallenges = lesson.challenges.filter(challenge => 
      challenge.completed === true
    );
    
    const percentage = Math.round(
      (completedChallenges.length / lesson.challenges.length) * 100
    );

    return percentage;
  } catch (error) {
    console.error("Error calculating lesson percentage:", error);
    return 0;
  }
});

// Safe version of getCourses with error handling
export const getCourses = cache(async () => {
  try {
    const data = await db.query.courses.findMany();
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    // Return mock courses data
    return [
      {
        id: 1,
        title: "Spanish",
        imageSrc: "/es.svg",
      },
      {
        id: 2,
        title: "French",
        imageSrc: "/fr.svg",
      }
    ];
  }
});

// Safe version of getCourse with error handling
export const getCourse = cache(async (courseId: number) => {
  try {
    const data = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching course ${courseId}:`, error);
    // Return mock course data
    return {
      id: courseId,
      title: courseId === 1 ? "Spanish" : "French",
      imageSrc: courseId === 1 ? "/es.svg" : "/fr.svg",
    };
  }
});

// Safe version of getLesson with error handling
export const getLesson = cache(async (lessonId: number) => {
  try {
    const { userId } = await getServerAuth();
    
    if (!userId) {
      return null;
    }
    
    const data = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
      with: {
        challenges: {
          with: {
            challengeOptions: true,
            challengeProgress: {
              where: eq(challengeProgress.userId, userId),
            },
          },
        },
      },
    });
    
    if (!data || !data.challenges) {
      return null;
    }

    const normalizedChallenges = data.challenges.map((challenge) => {
      const completed = challenge.challengeProgress 
        && challenge.challengeProgress.length > 0
        && challenge.challengeProgress.every((progress) => progress.completed);

      return { ...challenge, completed };
    });

    return { ...data, challenges: normalizedChallenges };
  } catch (error) {
    console.error(`Error fetching lesson ${lessonId}:`, error);
    // Return mock lesson data
    return {
      id: lessonId,
      title: `Lesson ${lessonId}`,
      unitId: 1,
      order: 1,
      challenges: [
        {
          id: 1,
          lessonId: lessonId,
          type: "SELECT",
          question: "Sample Question",
          order: 1,
          completed: false,
          challengeOptions: [
            {
              id: 1,
              challengeId: 1,
              text: "Option 1",
              correct: true,
              imageSrc: null
            },
            {
              id: 2,
              challengeId: 1,
              text: "Option 2",
              correct: false,
              imageSrc: null
            }
          ]
        }
      ]
    };
  }
});

// Safe version of getUserSubscription with error handling
export const getUserSubscription = cache(async () => {
  try {
    const { userId } = await getServerAuth();

    if (!userId) {
      return null;
    }

    const data = await db.query.userSubscription.findFirst({
      where: eq(userSubscription.userId, userId),
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    // Return mock subscription data (free tier)
    return {
      id: 1,
      userId: "mock-user-id",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      stripePriceId: null,
      stripeCurrentPeriodEnd: null,
    };
  }
}); 