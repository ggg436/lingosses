import { redirect } from "next/navigation";

import { getLesson, getUserProgress, getUserSubscription } from "@/db/safe-queries";
import { ChallengeOption, LessonChallenge, Subscription } from "@/types";

import { Quiz } from "../quiz";

type Props = {
  params: {
    lessonId: number;
  };
};

const LessonIdPage = async ({
  params,
}: Props) => {
  const lessonData = getLesson(params.lessonId);
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

  const typedChallenges: LessonChallenge[] = lesson.challenges.map(challenge => ({
    ...challenge,
    type: challenge.type as "SELECT" | "ASSIST",
    completed: false,
    challengeOptions: challenge.challengeOptions.map(option => {
      const typedOption: ChallengeOption = {
        id: option.id,
        challengeId: option.challengeId,
        text: option.text,
        correct: option.correct,
        imageSrc: option.imageSrc || null,
        audioSrc: null
      };
      return typedOption;
    }),
  }));

  const initialPercentage = typedChallenges
    .filter((challenge) => challenge.completed)
    .length / typedChallenges.length * 100;

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
 
export default LessonIdPage;
