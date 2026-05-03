import { ReactNode } from "react";
import { Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Archive, ChevronDown, ChevronUp, Eye, Share2, Square, Trash2 } from "lucide-react-native";
import { theme } from "@/design/theme";
import { EmergencyPackage } from "@/features/emergency/types";

type LocalEvidenceRailProps = {
  packages: EmergencyPackage[];
  selectedPackageId?: string;
  expandedPackageId?: string;
  onSelectPackage: (packageRecord: EmergencyPackage) => void;
  onToggleActions: (packageRecord: EmergencyPackage) => void;
  onShareBlocked: (packageRecord: EmergencyPackage) => void;
  onDeletePackage: (packageRecord: EmergencyPackage) => void;
  onFinishPackage?: (packageId: string) => void;
};

type ActionButtonProps = {
  label: string;
  danger?: boolean;
  disabled?: boolean;
  icon: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

function compactStatus(status: EmergencyPackage["status"]) {
  if (status === "recording_local") return "Ativo";
  return "Cofre";
}

function ActionButton({ label, danger = false, disabled = false, icon, onPress, style }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        danger && styles.actionButtonDanger,
        pressed && !disabled && styles.actionButtonPressed,
        disabled && styles.actionButtonDisabled,
        style
      ]}
    >
      {icon}
      <Text style={[styles.actionLabel, danger && styles.actionLabelDanger]}>{label}</Text>
    </Pressable>
  );
}

export function LocalEvidenceRail({
  packages,
  selectedPackageId,
  expandedPackageId,
  onSelectPackage,
  onToggleActions,
  onShareBlocked,
  onDeletePackage,
  onFinishPackage
}: LocalEvidenceRailProps) {
  if (!packages.length) {
    return (
      <View style={styles.emptyBox}>
        <Archive size={28} color={theme.colors.primary} />
        <Text style={styles.emptyTitle}>Nenhum arquivo local</Text>
        <Text style={styles.emptyText}>Ao acionar o SOS de teste, o pacote aparece aqui como icone do cofre.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rail}
      accessibilityLabel="Trilha retratil de arquivos locais"
    >
      {packages.map((packageRecord) => {
        const selected = packageRecord.id === selectedPackageId;
        const expanded = packageRecord.id === expandedPackageId;
        const active = packageRecord.status === "recording_local";

        return (
          <View key={packageRecord.id} style={[styles.fileNode, expanded && styles.fileNodeExpanded, selected && styles.fileNodeSelected]}>
            <Pressable
              accessibilityLabel={`Abrir acoes do pacote ${packageRecord.id.slice(0, 8)}`}
              accessibilityRole="button"
              accessibilityState={{ expanded, selected }}
              onPress={() => {
                onSelectPackage(packageRecord);
                onToggleActions(packageRecord);
              }}
              style={({ pressed }) => [styles.fileButton, pressed && styles.fileButtonPressed]}
            >
              <View style={[styles.fileIcon, selected && styles.fileIconSelected]}>
                <Archive size={28} color={selected ? theme.colors.textOnDark : theme.colors.primary} />
              </View>
              <Text style={styles.fileTitle}>Pacote {packageRecord.id.slice(0, 6)}</Text>
              <Text style={styles.fileStatus}>{compactStatus(packageRecord.status)}</Text>
              {expanded ? (
                <ChevronUp size={18} color={theme.colors.textMuted} />
              ) : (
                <ChevronDown size={18} color={theme.colors.textMuted} />
              )}
            </Pressable>

            {expanded ? (
              <View style={[styles.rayPanel, active && styles.rayPanelActive]}>
                <View style={styles.rayHub} />
                <View style={[styles.rayLine, styles.rayLineView]} />
                <View style={[styles.rayLine, styles.rayLineShare]} />
                <View style={[styles.rayLine, styles.rayLineDelete]} />
                {active ? <View style={[styles.rayLine, styles.rayLineFinish]} /> : null}
                <View style={[styles.rayAction, styles.rayActionView]}>
                  <ActionButton
                    label="Visualizar"
                    icon={<Eye size={18} color={theme.colors.primary} />}
                    onPress={() => onSelectPackage(packageRecord)}
                  />
                </View>
                <View style={[styles.rayAction, styles.rayActionShare]}>
                  <ActionButton
                    label="Compartilhar"
                    icon={<Share2 size={18} color={theme.colors.primary} />}
                    onPress={() => onShareBlocked(packageRecord)}
                  />
                </View>
                <View style={[styles.rayAction, styles.rayActionDelete]}>
                  <ActionButton
                    label="Excluir"
                    danger
                    icon={<Trash2 size={18} color={theme.colors.danger} />}
                    onPress={() => onDeletePackage(packageRecord)}
                  />
                </View>
                {active && onFinishPackage ? (
                  <View style={[styles.rayAction, styles.rayActionFinish]}>
                    <ActionButton
                      label="Finalizar"
                      danger
                      icon={<Square size={18} color={theme.colors.danger} />}
                      onPress={() => onFinishPackage(packageRecord.id)}
                    />
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.xs,
    justifyContent: "center",
    minHeight: 64,
    minWidth: 78,
    padding: theme.spacing.sm,
    width: "100%"
  },
  actionButtonDanger: {
    borderColor: theme.colors.danger
  },
  actionButtonDisabled: {
    opacity: 0.48
  },
  actionButtonPressed: {
    backgroundColor: theme.colors.surfaceMuted
  },
  actionLabel: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center"
  },
  actionLabelDanger: {
    color: theme.colors.danger
  },
  emptyBox: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.xl
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    lineHeight: 18,
    textAlign: "center"
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "800"
  },
  fileButton: {
    alignItems: "center",
    gap: theme.spacing.xs,
    minHeight: 122,
    padding: theme.spacing.sm
  },
  fileButtonPressed: {
    opacity: 0.72
  },
  fileIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: 34,
    borderWidth: 1,
    height: 68,
    justifyContent: "center",
    width: 68
  },
  fileIconSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  fileNode: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    marginRight: theme.spacing.md,
    padding: theme.spacing.xs,
    width: 150
  },
  fileNodeExpanded: {
    minHeight: 290,
    width: 270
  },
  fileNodeSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 2
  },
  fileStatus: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  fileTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    fontWeight: "800",
    textAlign: "center"
  },
  rail: {
    paddingBottom: theme.spacing.xs,
    paddingRight: theme.spacing.md
  },
  rayAction: {
    position: "absolute",
    width: 86,
    zIndex: 2
  },
  rayActionDelete: {
    left: 12,
    top: 62
  },
  rayActionFinish: {
    left: 88,
    top: 126
  },
  rayActionShare: {
    right: 12,
    top: 62
  },
  rayActionView: {
    left: 88,
    top: 6
  },
  rayHub: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 2,
    height: 16,
    left: 123,
    position: "absolute",
    top: 56,
    width: 16,
    zIndex: 1
  },
  rayLine: {
    backgroundColor: theme.colors.border,
    height: 2,
    left: 130,
    position: "absolute",
    top: 63,
    width: 56,
    zIndex: 0
  },
  rayLineDelete: {
    transform: [{ rotate: "158deg" }]
  },
  rayLineFinish: {
    top: 92,
    transform: [{ rotate: "90deg" }]
  },
  rayLineShare: {
    transform: [{ rotate: "22deg" }]
  },
  rayLineView: {
    top: 38,
    transform: [{ rotate: "90deg" }]
  },
  rayPanel: {
    height: 150,
    marginTop: -theme.spacing.sm,
    position: "relative"
  },
  rayPanelActive: {
    height: 214
  }
});
