import { redirect } from "next/navigation";

import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { lessons, units as unitsSchema } from "@/db/schema";
import { 
  getCourseProgress, 
  getLessonPercentage, 
  getUnits, 
  getUserProgress,
  getUserSubscription
} from "@/db/queries";

import { Unit } from "./unit";
import { Header } from "./header";
import { Quiz } from "./quiz";
import { Units } from "./units";

// Import from db index which re-exports safe queries
import { getUserProgress, getUnits, getUserSubscription } from "@/db";

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
