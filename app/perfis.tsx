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

function optionIcon(kind: ProtectionProfileKind, selected: boolean) {
  const color = selected ? theme.colors.secure : theme.colors.primary;
  if (kind === "minor_protected") return <ShieldAlert size={22} color={color} />;
  if (kind === "responsible_with_minor" || kind === "responsible_without_minor") {
    return <UsersRound size={22} color={color} />;
  }
  return <UserRound size={22} color={color} />;
}

export default function ProfilesScreen() {
  const [profile, setProfile] = useState<ProtectionProfile | null>(null);
  const [status, setStatus] = useState("Carregando perfil local...");
  const summary = getProfileSummary(profile);

  async function loadProfile() {
    const nextProfile = await getActiveProtectionProfile();
    setProfile(nextProfile);
    setStatus(nextProfile ? "Perfil local carregado." : "Perfil ainda nao configurado.");
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  async function selectProfile(kind: ProtectionProfileKind) {
    const nextProfile = await saveActiveProtectionProfile(kind);
    setProfile(nextProfile);
    setStatus("Perfil salvo neste aparelho.");
  }

  return (
    <SafeScreen
      title="Perfis e papeis"
      subtitle="Defina quem usa este aparelho antes de preparar rede de apoio."
      footer="Esta etapa nao coleta documento, data de nascimento completa, endereco, agenda ou relato sensivel."
    >
      <StatusBanner tone={summary.tone} title={summary.title} text={summary.text} />

      <View style={styles.optionStack}>
        {profileOptions.map((option) => {
          const selected = profile?.kind === option.kind;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={option.kind}
              onPress={() => void selectProfile(option.kind)}
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
                <Text style={styles.optionTitle}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <StatusBanner
        tone="warning"
        title="Limites da Frente 1.3"
        text="Menor nao cria anjo nem atua como anjo. Chamada, P2P, localizacao ao vivo, upload e conveniados continuam fora desta frente."
      />

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/contatos")}
        style={({ pressed }) => [styles.continueButton, pressed && styles.optionPressed]}
      >
        <ShieldCheck size={20} color={theme.colors.textOnDark} />
        <Text style={styles.continueText}>Voltar para anjos</Text>
      </Pressable>

      <Text style={styles.statusText}>{status}</Text>
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
    minHeight: 84,
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
    lineHeight: 21
  },
  optionDescription: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18
  },
  statusText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    fontWeight: "700",
    lineHeight: 18,
    textAlign: "center"
  }
});
