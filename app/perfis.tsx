import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ShieldAlert, ShieldCheck, UserRound, UsersRound } from "lucide-react-native";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { theme } from "@/design/theme";
import {
  getProfileSummary,
  profileOptions,
  ProtectionProfile,
  ProtectionProfileKind
} from "@/features/profiles/profilePolicy";
import { getActiveProtectionProfile, saveActiveProtectionProfile } from "@/features/profiles/profileStore";
import {
  profilesLimitNotice,
  profilesScreenCopy,
  profilesStatusTextFit,
  resolveProfileOptionIconPresentation,
  resolveProfileOptionCardPresentation,
  resolveProfilesContinueButtonPresentation,
  resolveProfileStatusAfterLoad
} from "@/features/profiles/profilesScreenPresentationPolicy";

function optionIcon(kind: ProtectionProfileKind, selected: boolean) {
  const iconPresentation = resolveProfileOptionIconPresentation(selected);
  const color = theme.colors[iconPresentation.colorToken];

  if (kind === "minor_protected") return <ShieldAlert size={iconPresentation.size} color={color} />;
  if (kind === "responsible_with_minor" || kind === "responsible_without_minor") {
    return <UsersRound size={iconPresentation.size} color={color} />;
  }
  return <UserRound size={iconPresentation.size} color={color} />;
}

type ProfileOptionCardProps = {
  option: (typeof profileOptions)[number];
  selected: boolean;
  onSelect: (kind: ProtectionProfileKind) => void;
};

function ProfileOptionCard({ onSelect, option, selected }: ProfileOptionCardProps) {
  const presentation = resolveProfileOptionCardPresentation(selected);

  return (
    <Pressable
      accessibilityRole={presentation.accessibilityRole}
      accessibilityState={{ selected }}
      onPress={() => onSelect(option.kind)}
      style={({ pressed }) => [
        styles.option,
        selected && styles.optionSelected,
        pressed && styles.optionPressed
      ]}
    >
      <View style={[styles.optionIcon, selected && styles.optionIconSelected]}>
        {optionIcon(option.kind, selected)}
      </View>
      <View style={styles.optionTextBlock}>
        <Text {...presentation.titleTextFit} style={styles.optionTitle}>{option.label}</Text>
        <Text {...presentation.descriptionTextFit} style={styles.optionDescription}>{option.description}</Text>
      </View>
    </Pressable>
  );
}

type ProfilesContinueButtonProps = {
  onPress: () => void;
};

function ProfilesContinueButton({ onPress }: ProfilesContinueButtonProps) {
  const presentation = resolveProfilesContinueButtonPresentation();
  const iconColor = theme.colors[presentation.icon.colorToken];

  return (
    <Pressable
      accessibilityRole={presentation.accessibilityRole}
      onPress={onPress}
      style={({ pressed }) => [styles.continueButton, pressed && styles.optionPressed]}
    >
      <ShieldCheck size={presentation.icon.size} color={iconColor} />
      <Text {...presentation.textFit} style={styles.continueText}>{presentation.label}</Text>
    </Pressable>
  );
}

export default function ProfilesScreen() {
  const [profile, setProfile] = useState<ProtectionProfile | null>(null);
  const [status, setStatus] = useState<string>(profilesScreenCopy.loadingStatus);
  const summary = getProfileSummary(profile);

  async function loadProfile() {
    const nextProfile = await getActiveProtectionProfile();
    setProfile(nextProfile);
    setStatus(resolveProfileStatusAfterLoad(nextProfile?.kind));
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  async function selectProfile(kind: ProtectionProfileKind) {
    const nextProfile = await saveActiveProtectionProfile(kind);
    setProfile(nextProfile);
    setStatus(profilesScreenCopy.savedStatus);
  }

  return (
    <SafeScreen
      title={profilesScreenCopy.title}
      subtitle={profilesScreenCopy.subtitle}
      footer={profilesScreenCopy.footer}
    >
      <StatusBanner tone={summary.tone} title={summary.title} text={summary.text} />

      <View style={styles.optionStack}>
        {profileOptions.map((option) => (
          <ProfileOptionCard
            key={option.kind}
            option={option}
            selected={profile?.kind === option.kind}
            onSelect={(kind) => void selectProfile(kind)}
          />
        ))}
      </View>

      <StatusBanner
        tone={profilesLimitNotice.tone}
        title={profilesLimitNotice.title}
        text={profilesLimitNotice.text}
      />

      <ProfilesContinueButton onPress={() => router.push("/contatos")} />

      <Text {...profilesStatusTextFit} style={styles.statusText}>{status}</Text>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  continueButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: theme.spacing.lg
  },
  continueText: {
    color: theme.colors.textOnDark,
    flexShrink: 1,
    fontSize: theme.typography.button,
    fontWeight: "900",
    lineHeight: 23,
    textAlign: "center"
  },
  option: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.md,
    minHeight: 104,
    padding: theme.spacing.md
  },
  optionIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  optionIconSelected: {
    borderColor: theme.colors.secure,
    borderWidth: 1
  },
  optionPressed: {
    opacity: 0.86,
    transform: [{ translateY: 1 }]
  },
  optionSelected: {
    borderColor: theme.colors.secure,
    borderWidth: 2
  },
  optionStack: {
    gap: theme.spacing.md
  },
  optionTextBlock: {
    flex: 1,
    gap: theme.spacing.xs
  },
  optionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 24
  },
  optionDescription: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 22
  },
  statusText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    fontWeight: "700",
    lineHeight: 22,
    textAlign: "center"
  }
});
