// Define shared types for challenges and options
export interface ChallengeOption {
  id: number;
  challengeId: number;
  text: string;
  correct: boolean;
  imageSrc: string | null;
  audioSrc: string | null;
}

export interface LessonChallenge {
  id: number;
  lessonId: number;
  type: "SELECT" | "ASSIST";
  question: string;
  order: number;
  completed: boolean;
  challengeOptions: ChallengeOption[];
}

export interface Subscription {
  id: number;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
  isActive: boolean;
} 