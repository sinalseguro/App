import { ConsentCard } from "@/components/ConsentCard";
import { SafeScreen } from "@/components/SafeScreen";
import { onboardingSteps } from "@/features/onboarding/onboardingSteps";

export default function OnboardingScreen() {
  return (
    <SafeScreen
      title="Boas-vindas"
      subtitle="Antes de usar, revise os limites e consentimentos do SinalSeguro."
    >
      {onboardingSteps.map((step) => (
        <ConsentCard key={step.id} title={step.title} text={step.text} status={step.status} />
      ))}
    </SafeScreen>
  );
}
