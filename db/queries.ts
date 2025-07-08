import { cache } from "@/lib/cache";
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
  userSubscription
} from "@/db/schema";

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
            title: "Lesson 1",
            unitId: 1,
            order: 1,
            completed: false
          }
        ]
      }
    ];
  }
});

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

export const getCourseById = cache(async (courseId: number) => {
  try {
    const data = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        units: {
          orderBy: (units, { asc }) => [asc(units.order)],
          with: {
            lessons: {
              orderBy: (lessons, { asc }) => [asc(lessons.order)],
            },
          },
        },
      },
    });

    return data;
  } catch (error) {
    console.error("Error fetching course by id:", error);
    // Return a default course when the table doesn't exist
    return {
      id: courseId,
      title: courseId === 1 ? "Nepali" : "Spanish",
      imageSrc: `/course-${courseId}.svg`,
      units: [
        {
          id: 1,
          title: "Unit 1",
          description: "Basic phrases and greetings",
          courseId: courseId,
          order: 1,
          lessons: [
            {
              id: 1,
              title: "Greetings",
              unitId: 1,
              order: 1
            }
          ]
        }
      ]
    };
  }
});

export const getCourseProgress = cache(async () => {
  const { userId } = await getServerAuth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return null;
  }

  try {
    const unitsInActiveCourse = await db.query.units.findMany({
      orderBy: (units, { asc }) => [asc(units.order)],
      where: eq(units.courseId, userProgress.activeCourseId),
      with: {
        lessons: {
          orderBy: (lessons, { asc }) => [asc(lessons.order)],
          with: {
            unit: true,
            challenges: {
              with: {
                challengeProgress: {
                  where: eq(challengeProgress.userId, userId),
                },
              },
            },
          },
        },
      },
    });

    const firstUncompletedLesson = unitsInActiveCourse
      .flatMap((unit) => unit.lessons)
      .find((lesson) => {
        return lesson.challenges.some((challenge) => {
          return !challenge.challengeProgress 
            || challenge.challengeProgress.length === 0 
            || challenge.challengeProgress.some((progress) => progress.completed === false)
        });
      });

    return {
      activeLesson: firstUncompletedLesson,
      activeLessonId: firstUncompletedLesson?.id,
    };
  } catch (error) {
    console.error("Error fetching course progress:", error);
    // Return default course progress when the table doesn't exist
    return {
      activeLesson: {
        id: 1,
        title: "Basic Greetings",
        unitId: 1,
        order: 1,
        challenges: [
          {
            id: 1,
            lessonId: 1,
            type: "SELECT",
            question: "What does 'Namaste' mean?",
            order: 1,
            completed: false
          }
        ],
        unit: {
          id: 1,
          title: "Unit 1",
          description: "Basic phrases",
          courseId: userProgress.activeCourseId,
          order: 1
        }
      },
      activeLessonId: 1
    };
  }
});

export const getLesson = cache(async (id?: number) => {
  const { userId } = await getServerAuth();

  if (!userId) {
    return null;
  }

  const courseProgress = await getCourseProgress();

  const lessonId = id || courseProgress?.activeLessonId;

  if (!lessonId) {
    return null;
  }

  try {
    const data = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
      with: {
        challenges: {
          orderBy: (challenges, { asc }) => [asc(challenges.order)],
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
        && challenge.challengeProgress.every((progress) => progress.completed)

      return { ...challenge, completed };
    });

    return { ...data, challenges: normalizedChallenges }
  } catch (error) {
    console.error("Error fetching lesson:", error);
    // Return a default lesson when the table doesn't exist
    return {
      id: lessonId,
      title: "Basic Greetings",
      unitId: 1,
      order: 1,
      challenges: [
        {
          id: 1,
          lessonId: lessonId,
          type: "SELECT",
          question: "What does 'Namaste' mean?",
          order: 1,
          completed: false,
          challengeOptions: [
            { id: 1, challengeId: 1, text: "Hello", correct: true, order: 1 },
            { id: 2, challengeId: 1, text: "Goodbye", correct: false, order: 2 },
            { id: 3, challengeId: 1, text: "Thank you", correct: false, order: 3 }
          ]
        },
        {
          id: 2,
          lessonId: lessonId,
          type: "ASSIST",
          question: "Translate: Hello, how are you?",
          order: 2,
          completed: false,
          challengeOptions: []
        }
      ]
    };
  }
});

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();

  if (!courseProgress?.activeLessonId) {
    return 0;
  }

  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson) {
    return 0;
  }

  const completedChallenges = lesson.challenges
    .filter((challenge) => challenge.completed);
  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100,
  );

  return percentage;
});

const DAY_IN_MS = 86_400_000;
export const getUserSubscription = cache(async () => {
  const { userId } = await getServerAuth();

  if (!userId) return null;

  try {
    const data = await db.query.userSubscription.findFirst({
      where: eq(userSubscription.userId, userId),
    });

    if (!data) return null;

    const isActive = 
      data.stripePriceId &&
      data.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return {
      ...data,
      isActive: !!isActive,
    };
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    // Return a default subscription object when the table doesn't exist
    return {
      id: 0,
      userId: userId,
      stripePriceId: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      stripeCurrentPeriodEnd: null,
      isActive: false
    };
  }
});

export const getTopTenUsers = cache(async () => {
  const { userId } = await getServerAuth();

  if (!userId) {
    return [];
  }

  try {
    const data = await db.query.userProgress.findMany({
      orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
      limit: 10,
      columns: {
        userId: true,
        userName: true,
        userImageSrc: true,
        points: true,
      },
    });

    return data;
  } catch (error) {
    console.error("Error fetching top users:", error);
    // Return mock leaderboard data
    return [
      {
        userId: userId,
        userName: "You",
        userImageSrc: "/mascot.svg",
        points: 100
      },
      {
        userId: "user1",
        userName: "Language Expert",
        userImageSrc: "/avatars/1.png",
        points: 150
      },
      {
        userId: "user2",
        userName: "Polyglot Pro",
        userImageSrc: "/avatars/2.png",
        points: 120
      }
    ];
  }
});
