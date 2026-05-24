import { StyleSheet, Text, View } from "react-native";
import { Archive, KeyRound, MapPin, Radio, ShieldCheck, Video } from "lucide-react-native";
import { SafeScreen } from "@/components/SafeScreen";
import { theme } from "@/design/theme";
import {
  howItWorksScreenCopy,
  howItWorksSteps,
  resolveHowItWorksIconPresentation,
  type HowItWorksStepIconKey
} from "@/features/onboarding/howItWorksPresentationPolicy";

function renderHowItWorksIcon(iconKey: HowItWorksStepIconKey) {
  const iconPresentation = resolveHowItWorksIconPresentation();
  const iconColor = theme.colors[iconPresentation.colorToken];

  switch (iconKey) {
    case "archive":
      return <Archive size={iconPresentation.size} color={iconColor} />;
    case "key":
      return <KeyRound size={iconPresentation.size} color={iconColor} />;
    case "location":
      return <MapPin size={iconPresentation.size} color={iconColor} />;
    case "radio":
      return <Radio size={iconPresentation.size} color={iconColor} />;
    case "shield":
      return <ShieldCheck size={iconPresentation.size} color={iconColor} />;
    case "video":
      return <Video size={iconPresentation.size} color={iconColor} />;
  }
}

export default function FuncionamentoScreen() {
  return (
    <SafeScreen
      title={howItWorksScreenCopy.title}
      subtitle={howItWorksScreenCopy.subtitle}
    >
      <View style={styles.grid}>
        {howItWorksSteps.map((step) => (
          <View key={step.id} style={styles.card}>
            <View style={styles.icon}>{renderHowItWorksIcon(step.iconKey)}</View>
            <View style={styles.copy}>
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.text}>{step.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.md
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xs
  },
  grid: {
    gap: theme.spacing.md
  },
  icon: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: "900"
  }
});
