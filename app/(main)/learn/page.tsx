import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { Quiz } from "./quiz";
import { Units } from "./units";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

// Import directly from safe-queries to avoid duplicate exports
import { getUserProgress, getUnits, getUserSubscription } from "@/db/safe-queries";

const LearnPage = async () => {
  const userProgressData = await getUserProgress();
  const units = await getUnits();
  const userSubscription = await getUserSubscription();

  if (!userProgressData || !userProgressData.activeCourse) {
    return redirect("/courses");
  }

  const isPro = !!userSubscription?.stripeCurrentPeriodEnd;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgressData.activeCourse}
          hearts={userProgressData.hearts}
          points={userProgressData.points}
          hasActiveSubscription={isPro}
        />
        {!isPro && (
          <Promo />
        )}
        <Quests points={userProgressData.points} />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgressData.activeCourse.title} />
        <Quiz />
        <Units
          units={units}
          activeCourse={userProgressData.activeCourse}
        />
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
