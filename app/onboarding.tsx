import { ConsentCard } from "@/components/ConsentCard";
import { SafeScreen } from "@/components/SafeScreen";
import { onboardingScreenCopy, onboardingSteps } from "@/features/onboarding/onboardingPresentationPolicy";

export default function OnboardingScreen() {
  return (
    <SafeScreen title={onboardingScreenCopy.title} subtitle={onboardingScreenCopy.subtitle}>
      {onboardingSteps.map((step) => (
        <ConsentCard key={step.id} title={step.title} text={step.text} status={step.status} />
      ))}
    </SafeScreen>
  );
}
