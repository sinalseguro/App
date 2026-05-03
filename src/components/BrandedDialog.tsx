import { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { X } from "lucide-react-native";
import { theme } from "@/design/theme";

export type BrandedDialogAction = {
  label: string;
  onPress?: () => void;
  tone?: "primary" | "danger" | "muted";
  autoClose?: boolean;
};

type BrandedDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  icon?: ReactNode;
  children?: ReactNode;
  actions: BrandedDialogAction[];
  onClose: () => void;
};

export function BrandedDialog({ visible, title, message, icon, children, actions, onClose }: BrandedDialogProps) {
  function pressAction(action: BrandedDialogAction) {
    action.onPress?.();
    if (action.autoClose !== false) {
      onClose();
    }
  }

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.panel}>
          <View style={styles.header}>
            {icon ? <View style={styles.iconSlot}>{icon}</View> : null}
            <Text style={styles.title}>{title}</Text>
            <Pressable
              accessibilityLabel="Fechar janela"
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.closePressed]}
            >
              <X size={18} color={theme.colors.textMuted} />
            </Pressable>
          </View>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          {children}
          <View style={styles.actions}>
            {actions.map((action) => (
              <Pressable
                accessibilityRole="button"
                key={action.label}
                onPress={() => pressAction(action)}
                style={({ pressed }) => [
                  styles.actionButton,
                  action.tone === "danger" && styles.actionDanger,
                  action.tone === "muted" && styles.actionMuted,
                  pressed && styles.actionPressed
                ]}
              >
                <Text
                  style={[
                    styles.actionText,
                    action.tone === "danger" && styles.actionDangerText,
                    action.tone === "muted" && styles.actionMutedText
                  ]}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md
  },
  actionDanger: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger
  },
  actionDangerText: {
    color: theme.colors.textOnDark
  },
  actionMuted: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border
  },
  actionMutedText: {
    color: theme.colors.text
  },
  actionPressed: {
    opacity: 0.86,
    transform: [{ translateY: 1 }]
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  actionText: {
    color: theme.colors.textOnDark,
    fontSize: theme.typography.button,
    fontWeight: "900",
    textAlign: "center"
  },
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(18, 10, 32, 0.78)",
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.xl
  },
  closeButton: {
    alignItems: "center",
    borderRadius: theme.radius.pill,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  closePressed: {
    backgroundColor: theme.colors.surfaceMuted
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  iconSlot: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  message: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 22
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    maxWidth: 440,
    padding: theme.spacing.lg,
    width: "100%",
    ...theme.shadow
  },
  title: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22
  }
});
