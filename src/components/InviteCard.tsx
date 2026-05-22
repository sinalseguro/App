import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Clock3, ShieldAlert, ShieldCheck, XCircle } from "lucide-react-native";
import { theme } from "@/design/theme";
import {
  buildInviteCardPresentation,
  type InviteCardIconKey,
  type InviteCardStatus,
  type InviteCardTone
} from "@/components/inviteCardPresentationPolicy";

type InviteCardProps = {
  detail?: string;
  icon?: ReactNode;
  name: string;
  onPress?: () => void;
  status: InviteCardStatus;
  description: string;
};

const toneColor: Record<InviteCardTone, string> = {
  danger: theme.colors.danger,
  primary: theme.colors.primary,
  secure: theme.colors.secure,
  warning: theme.colors.warning
};

function defaultIcon(iconKey: InviteCardIconKey, color: string, size: number) {
  if (iconKey === "shield-check") return <ShieldCheck size={size} color={color} />;
  if (iconKey === "x-circle") return <XCircle size={size} color={color} />;
  if (iconKey === "shield-alert") return <ShieldAlert size={size} color={color} />;
  if (iconKey === "check-circle") return <CheckCircle2 size={size} color={color} />;
  return <Clock3 size={size} color={color} />;
}

export function InviteCard({ detail, icon, name, onPress, status, description }: InviteCardProps) {
  const presentation = buildInviteCardPresentation(status);
  const color = toneColor[presentation.tone];
  const content = (
    <>
      <View style={styles.header}>
        <View style={styles.identity}>
          <View style={styles.iconSlot}>{icon ?? defaultIcon(presentation.iconKey, color, presentation.iconSize)}</View>
          <View style={styles.titleBlock}>
            <Text {...presentation.nameTextFit} style={styles.name}>
              {name}
            </Text>
            {detail ? <Text {...presentation.detailTextFit} style={styles.detail}>{detail}</Text> : null}
          </View>
        </View>
        <Text style={[styles.status, { color }]}>{presentation.label}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole={presentation.pressableAccessibilityRole}
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    minHeight: 108,
    padding: theme.spacing.lg
  },
  cardPressed: {
    borderColor: theme.colors.primary,
    transform: [{ translateY: 1 }]
  },
  detail: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700"
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  iconSlot: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  identity: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minWidth: 0
  },
  name: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  status: {
    color: theme.colors.primary,
    fontSize: theme.typography.small,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  titleBlock: {
    flex: 1,
    gap: 2,
    minWidth: 0
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 21
  }
});
