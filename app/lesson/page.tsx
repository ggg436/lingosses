import { redirect } from "next/navigation";

import { getLesson, getUserProgress, getUserSubscription } from "@/db/safe-queries";
import { ChallengeOption, LessonChallenge, Subscription } from "@/types";

import { Quiz } from "./quiz";

const LessonPage = async () => {
  const lessonData = getLesson(1); // Default to lesson 1
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [
    lesson,
    userProgress,
    userSubscription,
  ] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData,
  ]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  // Add type assertion to ensure challenges have the correct type
  const typedChallenges: LessonChallenge[] = lesson.challenges.map(challenge => ({
    ...challenge,
    type: challenge.type as "SELECT" | "ASSIST",
    completed: false,
    challengeOptions: challenge.challengeOptions.map(option => {
      // Create a new object with all required properties
      const typedOption: ChallengeOption = {
        id: option.id,
        challengeId: option.challengeId,
        text: option.text,
        correct: option.correct,
        imageSrc: option.imageSrc || null,
        audioSrc: null // Default to null
      };
      return typedOption;
    }),
  }));

  const initialPercentage = typedChallenges
    .filter((challenge) => challenge.completed)
    .length / typedChallenges.length * 100;

  // Add isActive property to userSubscription
  const typedSubscription: Subscription | null = userSubscription ? {
    id: userSubscription.id,
    userId: userSubscription.userId,
    stripeCustomerId: userSubscription.stripeCustomerId || "",
    stripeSubscriptionId: userSubscription.stripeSubscriptionId || "",
    stripePriceId: userSubscription.stripePriceId || "",
    stripeCurrentPeriodEnd: userSubscription.stripeCurrentPeriodEnd || new Date(),
    isActive: !!userSubscription.stripeCurrentPeriodEnd
  } : null;

  return ( 
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={typedChallenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={typedSubscription}
    />
  );
};
 
export default LessonPage;
