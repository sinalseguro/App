import { ReactNode } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Archive, ChevronDown, ChevronUp, Eye, FileLock2, MapPin, Share2, Square, Trash2 } from "lucide-react-native";
import { theme } from "@/design/theme";
import {
  getPackageMediaCountLabel,
  getPackageMediaDiagnosticLabel,
  getPackageMediaProtectionLabel
} from "@/features/emergency/mediaInterfacePresentation";
import {
  formatPackageDate,
  formatPackageDurationLabel,
  formatPackageSubtitle,
  formatPackageTitle,
  hasPackageLocation
} from "@/features/emergency/packagePresentation";
import { EmergencyPackage } from "@/features/emergency/types";

type LocalEvidenceRailProps = {
  packages: EmergencyPackage[];
  loading?: boolean;
  selectedPackageId?: string;
  expandedPackageId?: string;
  onSelectPackage: (packageRecord: EmergencyPackage) => void;
  onOpenPlayerPackage?: (packageRecord: EmergencyPackage) => void;
  onToggleActions: (packageRecord: EmergencyPackage) => void;
  onShareBlocked: (packageRecord: EmergencyPackage) => void;
  onOpenMapPackage?: (packageRecord: EmergencyPackage) => void;
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

function ActionButton({ label, danger = false, disabled = false, icon, onPress, style }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={8}
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
  loading = false,
  selectedPackageId,
  expandedPackageId,
  onSelectPackage,
  onOpenPlayerPackage,
  onToggleActions,
  onShareBlocked,
  onOpenMapPackage,
  onDeletePackage,
  onFinishPackage
}: LocalEvidenceRailProps) {
  if (loading && !packages.length) {
    return (
      <View style={styles.emptyBox}>
        <ActivityIndicator color={theme.colors.primary} size="small" />
        <Text style={styles.emptyTitle}>Atualizando cofre local</Text>
        <Text style={styles.emptyText}>Conferindo arquivos protegidos deste aparelho.</Text>
      </View>
    );
  }

  if (!packages.length) {
    return (
      <View style={styles.emptyBox}>
        <Archive size={28} color={theme.colors.primary} />
        <Text style={styles.emptyTitle}>Nenhum arquivo local</Text>
        <Text style={styles.emptyText}>Ao acionar o SOS, os arquivos aparecem aqui.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.grid}
      accessibilityLabel="Grade vertical de arquivos locais"
    >
      {packages.map((packageRecord) => {
        const selected = packageRecord.id === selectedPackageId;
        const expanded = packageRecord.id === expandedPackageId;
        const active = packageRecord.status === "recording_local";
        const packageTitle = formatPackageTitle(packageRecord);
        const protectionLabel = getPackageMediaProtectionLabel(packageRecord);
        const diagnosticLabel = getPackageMediaDiagnosticLabel(packageRecord);
        const hasProtectedMedia = protectionLabel === "Protegido" || protectionLabel === "Parcialmente protegido";

        return (
          <View
            key={packageRecord.id}
            style={[styles.packageGroup, expanded && styles.packageGroupExpanded]}
          >
            <Pressable
              accessibilityLabel={`Abrir acoes de ${packageTitle}`}
              accessibilityRole="button"
              accessibilityState={{ expanded, selected }}
              onPress={() => {
                onSelectPackage(packageRecord);
                onToggleActions(packageRecord);
              }}
              style={({ pressed }) => [
                styles.fileButton,
                selected && styles.fileButtonSelected,
                pressed && styles.fileButtonPressed
              ]}
            >
              <View style={[styles.fileIcon, selected && styles.fileIconSelected]}>
                {hasProtectedMedia ? (
                  <FileLock2 size={28} color={selected ? theme.colors.textOnDark : theme.colors.primary} />
                ) : (
                  <Archive size={28} color={selected ? theme.colors.textOnDark : theme.colors.primary} />
                )}
              </View>
              <View style={[styles.mediaBadge, hasProtectedMedia && styles.mediaBadgeProtected]}>
                <Text style={[styles.mediaBadgeText, hasProtectedMedia && styles.mediaBadgeTextProtected]}>
                  {active ? "Gravando" : protectionLabel}
                </Text>
              </View>
              <Text numberOfLines={2} style={styles.fileTitle}>{packageTitle}</Text>
              <Text numberOfLines={1} style={styles.fileDate}>{formatPackageDate(packageRecord)}</Text>
              <Text numberOfLines={1} style={styles.fileDuration}>{formatPackageDurationLabel(packageRecord)}</Text>
              <Text style={styles.fileStatus}>
                {active ? formatPackageSubtitle(packageRecord) : diagnosticLabel ?? getPackageMediaCountLabel(packageRecord)}
              </Text>
              {expanded ? (
                <ChevronUp size={18} color={theme.colors.textMuted} />
              ) : (
                <ChevronDown size={18} color={theme.colors.textMuted} />
              )}
            </Pressable>

            {expanded ? (
              <View style={styles.actionGrid}>
                <ActionButton
                  label="Visualizar"
                  icon={<Eye size={18} color={theme.colors.primary} />}
                  onPress={() => (onOpenPlayerPackage ? onOpenPlayerPackage(packageRecord) : onSelectPackage(packageRecord))}
                  style={styles.actionGridButton}
                />
                <ActionButton
                  label="Compartilhar"
                  icon={<Share2 size={18} color={theme.colors.primary} />}
                  onPress={() => onShareBlocked(packageRecord)}
                  style={styles.actionGridButton}
                />
                <ActionButton
                  disabled={!hasPackageLocation(packageRecord)}
                  label="Mapa"
                  icon={<MapPin size={18} color={theme.colors.primary} />}
                  onPress={() => onOpenMapPackage?.(packageRecord)}
                  style={styles.actionGridButton}
                />
                <ActionButton
                  label="Excluir"
                  danger
                  icon={<Trash2 size={18} color={theme.colors.danger} />}
                  onPress={() => onDeletePackage(packageRecord)}
                  style={styles.actionGridButton}
                />
                {active && onFinishPackage ? (
                  <ActionButton
                    label="Finalizar"
                    danger
                    icon={<Square size={18} color={theme.colors.danger} />}
                    onPress={() => onFinishPackage(packageRecord.id)}
                    style={styles.actionGridButton}
                  />
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
  actionGrid: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm
  },
  actionGridButton: {
    flexBasis: "47%",
    flexGrow: 1
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
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.xs,
    minHeight: 122,
    padding: theme.spacing.sm
  },
  fileButtonPressed: {
    opacity: 0.72
  },
  fileButtonSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 2
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
  mediaBadge: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    minHeight: 22,
    paddingHorizontal: theme.spacing.sm,
    justifyContent: "center"
  },
  mediaBadgeProtected: {
    backgroundColor: "rgba(20, 108, 67, 0.1)",
    borderColor: "rgba(20, 108, 67, 0.24)"
  },
  mediaBadgeText: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center"
  },
  mediaBadgeTextProtected: {
    color: theme.colors.secure
  },
  fileStatus: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center"
  },
  fileDate: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center"
  },
  fileDuration: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center"
  },
  fileTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    fontWeight: "800",
    textAlign: "center"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.xs
  },
  packageGroup: {
    flexBasis: "47%",
    flexGrow: 1,
    maxWidth: "50%"
  },
  packageGroupExpanded: {
    flexBasis: "100%",
    maxWidth: "100%"
  }
});
