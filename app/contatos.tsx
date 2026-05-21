import { Fragment, ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { AppState, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { Clock3, RefreshCw, ShieldCheck, UserCheck, UserPlus, UserRound, Users, WifiOff, XCircle } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppTopBar } from "@/components/AppTopBar";
import { BrandedDialog } from "@/components/BrandedDialog";
import { InviteCard } from "@/components/InviteCard";
import { ResourceTile } from "@/components/ResourceTile";
import { StatusBanner } from "@/components/StatusBanner";
import { theme } from "@/design/theme";
import { EmergencySettingsDrawer } from "@/features/emergency-home/EmergencySettingsDrawer";
import { EmergencyHomePanel, EmergencyHomeRoute } from "@/features/emergency-home/routes";
import {
  buildInvitationShareText,
  createLocalInvitation,
  listLocalInvitations,
  markInvitationShared,
  revokeLocalInvitation
} from "@/features/invitations/invitationService";
import {
  cacheTrustedContactRelationships,
  listCachedTrustedContactRelationships,
  removeCachedTrustedContactRelationship
} from "@/features/invitations/trustedRelationshipStore";
import {
  buildTrustedAngelRelationshipLists,
  mergeTrustedAngelInvitations,
  splitTrustedAngelInvitationSections
} from "@/features/invitations/trustedAngelsListPolicy";
import {
  buildTrustedAngelsAngelPanelState,
  buildTrustedAngelsInvitationPanelState,
  buildTrustedAngelsOwnerPanelState
} from "@/features/invitations/trustedAngelsPanelPolicy";
import {
  buildTrustedAngelsDashboardSummary,
  buildTrustedAngelsReadinessState
} from "@/features/invitations/trustedAngelsDashboardPolicy";
import {
  buildTrustedAngelInvitationCardKey,
  buildTrustedAngelsDialogVisibility,
  canShowTrustedAngelInvitationRevocationAction,
  type TrustedAngelsDialogKind
} from "@/features/invitations/trustedAngelsDialogPolicy";
import {
  buildTrustedAngelsLocalRefreshState,
  resolveTrustedAngelsNoSessionRefresh,
  resolveTrustedAngelsPanelParam,
  resolveTrustedAngelsRefreshFailure,
  resolveTrustedAngelsRefreshStart,
  resolveTrustedAngelsRemoteRefreshOutcome,
  type TrustedAngelsPanel
} from "@/features/invitations/trustedAngelsRefreshPolicy";
import {
  buildTrustedAngelContactRevocationPlan,
  buildTrustedAngelInvitationRevocationPlan,
  resolveTrustedAngelActionFailure,
  resolveTrustedAngelShareFailure,
  resolveTrustedAngelShareStart,
  trustedAngelActionMessages
} from "@/features/invitations/trustedAngelsActionPolicy";
import { LocalInvitation } from "@/features/invitations/types";
import {
  buildNotice,
  contactStatus,
  invitationDescription,
  invitationDetail,
  trustedRelationshipDescription,
  trustedRelationshipDetail,
  trustedRelationshipName
} from "@/features/invitations/trustedAngelsPresentationPolicy";
import {
  canCreateTrustedContactInvitation,
  getProfileSummary,
  ProtectionProfile
} from "@/features/profiles/profilePolicy";
import { getActiveProtectionProfile } from "@/features/profiles/profileStore";
import {
  ApiInvitation,
  ApiRequestError,
  ApiSession,
  ApiTrustedContact,
  ApiTrustedContactRelationship,
  apiClient,
  apiConfig
} from "@/services/apiClient";
import { deviceBindingService } from "@/services/deviceBinding";

type AngelsDialog =
  | {
      kind: Extract<TrustedAngelsDialogKind, "invite">;
    }
  | {
      invitation: LocalInvitation;
      kind: Extract<TrustedAngelsDialogKind, "revoke_invitation">;
    }
  | {
      contact: ApiTrustedContact;
      kind: Extract<TrustedAngelsDialogKind, "revoke_contact">;
    }
  | {
      kind: Extract<TrustedAngelsDialogKind, "profile_block">;
    }
  | null;

type RefreshOptions = {
  silent?: boolean;
};

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>{icon}</View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export default function ContactsScreen() {
  const { painel } = useLocalSearchParams<{ painel?: string }>();
  const [apiSession, setApiSession] = useState<ApiSession | null>(null);
  const [backendInvitations, setBackendInvitations] = useState<ApiInvitation[]>([]);
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState<AngelsDialog>(null);
  const [deviceReady, setDeviceReady] = useState(false);
  const [inviteLabel, setInviteLabel] = useState("Anjo de confiança");
  const [invitations, setInvitations] = useState<LocalInvitation[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<TrustedAngelsPanel>(null);
  const [activeProfile, setActiveProfile] = useState<ProtectionProfile | null>(null);
  const [status, setStatus] = useState("Carregando anjos de confiança...");
  const [trustedContacts, setTrustedContacts] = useState<ApiTrustedContact[]>([]);
  const [trustedRelationships, setTrustedRelationships] = useState<ApiTrustedContactRelationship[]>([]);
  const refreshInFlightRef = useRef(false);

  const mergedInvitations = useMemo(() => {
    return mergeTrustedAngelInvitations({
      backendInvitations,
      localInvitations: invitations,
      trustedContacts,
      trustedRelationships
    });
  }, [backendInvitations, invitations, trustedContacts, trustedRelationships]);

  const relationshipLists = useMemo(
    () => buildTrustedAngelRelationshipLists({ trustedContacts, trustedRelationships }),
    [trustedContacts, trustedRelationships]
  );

  const { angelLinks, linkedContacts } = relationshipLists;
  const { backendValidatedInvitations, invitationCount, localPreInvitations } = useMemo(
    () => splitTrustedAngelInvitationSections(mergedInvitations),
    [mergedInvitations]
  );

  const notice = buildNotice({
    apiSession,
    angelLinks,
    busy,
    invitations: mergedInvitations,
    ownerLinks: linkedContacts
  });
  const profileSummary = getProfileSummary(activeProfile);
  const invitationGate = canCreateTrustedContactInvitation(activeProfile);
  const acceptedOwnerCount = linkedContacts.filter((contact) => contact.status === "accepted").length;
  const acceptedAngelCount = angelLinks.filter((contact) => contact.status === "accepted").length;
  const dashboardSummary = buildTrustedAngelsDashboardSummary({
    acceptedAngelCount,
    acceptedOwnerCount,
    apiSessionAvailable: Boolean(apiSession),
    busy,
    deviceReady,
    invitationCount,
    invitationGateAllowed: invitationGate.allowed,
    noticeTitle: notice.title,
    profileTitle: profileSummary.title
  });
  const readinessState = buildTrustedAngelsReadinessState({
    apiEnabled: apiConfig.apiEnabled,
    apiSessionAvailable: Boolean(apiSession),
    deviceReady
  });
  const ownerPanelState = buildTrustedAngelsOwnerPanelState(linkedContacts);
  const angelPanelState = buildTrustedAngelsAngelPanelState(angelLinks);
  const invitationPanelState = buildTrustedAngelsInvitationPanelState({
    backendValidatedInvitations,
    invitationCount,
    localPreInvitations
  });
  const dialogVisibility = buildTrustedAngelsDialogVisibility({
    dialogKind: dialog?.kind ?? null,
    panel
  });

  async function refreshAngels(options: RefreshOptions = {}) {
    const refreshStart = resolveTrustedAngelsRefreshStart({
      inFlight: refreshInFlightRef.current,
      silent: options.silent
    });
    if (!refreshStart.shouldRefresh) return;
    refreshInFlightRef.current = true;
    if (refreshStart.setBusy) {
      setBusy(true);
    }
    try {
      const [nextInvitations, currentSession, registeredDeviceId, nextProfile, cachedRelationships] = await Promise.all([
        listLocalInvitations(),
        apiClient.getStoredSession(),
        deviceBindingService.getRegisteredApiDeviceId(),
        getActiveProtectionProfile(),
        listCachedTrustedContactRelationships()
      ]);
      setInvitations(nextInvitations);
      setActiveProfile(nextProfile);
      const localState = buildTrustedAngelsLocalRefreshState({
        cachedRelationships,
        currentSession,
        registeredDeviceId
      });
      setApiSession(localState.apiSession);
      setDeviceReady(localState.deviceReady);
      setTrustedRelationships(localState.trustedRelationships);

      if (currentSession) {
        const [contactsResult, remoteInvitationsResult, relationshipsResult] = await Promise.allSettled([
          apiClient.listTrustedContacts(),
          apiClient.listInvitations(),
          apiClient.listTrustedContactRelationships()
        ]);

        const remoteOutcome = resolveTrustedAngelsRemoteRefreshOutcome({
          cachedRelationshipsCount: cachedRelationships.length,
          contactsResult,
          relationshipsResult,
          remoteInvitationsResult,
          silent: refreshStart.silent
        });
        if (remoteOutcome.trustedContacts) {
          setTrustedContacts(remoteOutcome.trustedContacts);
        }
        if (remoteOutcome.backendInvitations) {
          setBackendInvitations(remoteOutcome.backendInvitations);
        }
        if (remoteOutcome.trustedRelationships) {
          setTrustedRelationships(remoteOutcome.trustedRelationships);
        }
        if (remoteOutcome.cacheRelationships) {
          await cacheTrustedContactRelationships(remoteOutcome.cacheRelationships);
        }
        if (remoteOutcome.status) {
          setStatus(remoteOutcome.status);
        }
      } else {
        const noSessionOutcome = resolveTrustedAngelsNoSessionRefresh({ silent: refreshStart.silent });
        setTrustedContacts(noSessionOutcome.trustedContacts);
        setBackendInvitations(noSessionOutcome.backendInvitations);
        setTrustedRelationships(noSessionOutcome.trustedRelationships);
        if (noSessionOutcome.status) {
          setStatus(noSessionOutcome.status);
        }
      }
    } catch (error) {
      const failure = resolveTrustedAngelsRefreshFailure({
        message: error instanceof Error ? error.message : "",
        silent: refreshStart.silent
      });
      if (failure.status) {
        setStatus(failure.status);
      }
    } finally {
      if (refreshStart.clearBusy) {
        setBusy(false);
      }
      refreshInFlightRef.current = false;
    }
  }

  useFocusEffect(
    useCallback(() => {
      void refreshAngels();
      const requestedPanel = resolveTrustedAngelsPanelParam(painel);
      if (requestedPanel) {
        setPanel(requestedPanel);
      }
      const refreshTimer = setInterval(() => {
        void refreshAngels({ silent: true });
      }, 15000);
      const appStateSubscription = AppState.addEventListener("change", (state) => {
        if (state === "active") {
          void refreshAngels({ silent: true });
        }
      });
      return () => {
        clearInterval(refreshTimer);
        appStateSubscription.remove();
      };
    }, [painel])
  );

  async function shareInvitation() {
    const shareStart = resolveTrustedAngelShareStart({
      gate: canCreateTrustedContactInvitation(activeProfile),
      inviteLabel
    });
    if (shareStart.kind === "blocked") {
      setStatus(shareStart.status);
      setDialog({ kind: "profile_block" });
      return;
    }

    setBusy(true);
    setStatus(shareStart.status);

    try {
      const invitation = await createLocalInvitation(shareStart.label);
      await Share.share({ message: buildInvitationShareText(invitation), url: invitation.inviteUrl });
      await markInvitationShared(invitation.id);
      await refreshAngels();
      setStatus(trustedAngelActionMessages.createSuccess);
      setDialog(null);
    } catch (error) {
      const failure = resolveTrustedAngelShareFailure({
        isUnauthorized: error instanceof ApiRequestError && error.status === 401,
        message: error instanceof Error ? error.message : trustedAngelActionMessages.createUnknownFailure
      });
      if (failure.clearSession) {
        setApiSession(null);
      }
      if (failure.closeDialog) {
        setDialog(null);
      }
      setStatus(failure.status);
    } finally {
      setBusy(false);
    }
  }

  async function revokeInvitation(invitation: LocalInvitation) {
    const revocationPlan = buildTrustedAngelInvitationRevocationPlan({
      apiSessionAvailable: Boolean(apiSession),
      invitation,
      localInvitationIds: invitations.map((item) => item.id)
    });
    setBusy(true);
    setStatus(revocationPlan.startStatus);

    try {
      if (revocationPlan.shouldRevokeBackend && revocationPlan.backendInvitationId) {
        await apiClient.revokeInvitation(revocationPlan.backendInvitationId);
      }
      if (revocationPlan.shouldRevokeLocal) {
        await revokeLocalInvitation(revocationPlan.localInvitationId);
      }
      await refreshAngels();
      setStatus(revocationPlan.successStatus);
      setDialog(null);
    } catch (error) {
      setStatus(
        resolveTrustedAngelActionFailure(
          error instanceof Error ? error.message : "",
          trustedAngelActionMessages.invitationRevokeFailure
        )
      );
    } finally {
      setBusy(false);
    }
  }

  async function revokeContact(contact: ApiTrustedContact) {
    const revocationPlan = buildTrustedAngelContactRevocationPlan(contact);
    setBusy(true);
    setStatus(revocationPlan.startStatus);

    try {
      await apiClient.revokeTrustedContact(revocationPlan.trustedContactId);
      await removeCachedTrustedContactRelationship(revocationPlan.cacheRelationshipId);
      await refreshAngels();
      setStatus(revocationPlan.successStatus);
      setDialog(null);
    } catch (error) {
      setStatus(
        resolveTrustedAngelActionFailure(
          error instanceof Error ? error.message : "",
          trustedAngelActionMessages.trustedContactRevokeFailure
        )
      );
    } finally {
      setBusy(false);
    }
  }

  function openMenuRoute(route: EmergencyHomeRoute, panelRoute?: EmergencyHomePanel) {
    setMenuOpen(false);
    if (route === "/arquivos" && panelRoute) {
      router.push({ pathname: "/arquivos", params: { painel: panelRoute } });
      return;
    }
    router.push(route);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell} testID="trusted-angels-screen">
        <AppTopBar
          contextLabel="Anjos de confiança"
          menuIcon="settings"
          menuOpen={menuOpen}
          onMenuPress={() => setMenuOpen((current) => !current)}
          showBack
          showMenu
        />

        {menuOpen ? (
          <>
            <Pressable
              accessibilityLabel="Fechar menu"
              onPress={() => setMenuOpen(false)}
              style={styles.menuBackdrop}
            />
            <EmergencySettingsDrawer onNavigate={openMenuRoute} />
          </>
        ) : null}

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} style={styles.contentScroll}>
          <StatusBanner tone={notice.tone} title={notice.title} text={notice.text} />
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<UserRound size={24} color={theme.colors.primary} />}
              label="Perfil"
              description={dashboardSummary.profileDescription}
              onPress={() => router.push("/perfis")}
            />
            <ResourceTile
              icon={<ShieldCheck size={24} color={theme.colors.primary} />}
              label="Estado"
              description={dashboardSummary.stateDescription}
              onPress={() => setPanel("estado")}
            />
          </View>
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<UserPlus size={24} color={theme.colors.primary} />}
              label="Criar convite"
              description={dashboardSummary.createInvitationDescription}
              onPress={() => setDialog(invitationGate.allowed ? { kind: "invite" } : { kind: "profile_block" })}
            />
            <ResourceTile
              icon={<ShieldCheck size={24} color={theme.colors.primary} />}
              label="Prontidão"
              description={dashboardSummary.readinessDescription}
              onPress={() => setPanel("prontidao")}
            />
          </View>
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<Users size={24} color={theme.colors.primary} />}
              label="Meus anjos"
              description={dashboardSummary.acceptedOwnerDescription}
              onPress={() => setPanel("anjos")}
            />
            <ResourceTile
              icon={<UserCheck size={24} color={theme.colors.primary} />}
              label="Sou anjo"
              description={dashboardSummary.acceptedAngelDescription}
              onPress={() => setPanel("sou_anjo")}
            />
          </View>
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<Clock3 size={24} color={theme.colors.primary} />}
              label="Convites"
              description={dashboardSummary.invitationsDescription}
              onPress={() => setPanel("convites")}
            />
            <ResourceTile
              icon={<RefreshCw size={24} color={theme.colors.primary} />}
              label="Atualizar"
              description={dashboardSummary.syncDescription}
              onPress={() => void refreshAngels()}
            />
          </View>
        </ScrollView>

        <Text style={styles.statusText}>{status}</Text>

      <BrandedDialog
        actions={[
          { label: "Cancelar", tone: "muted" },
          {
            autoClose: false,
            label: busy ? "Criando..." : "Compartilhar convite",
            onPress: shareInvitation
          }
        ]}
        icon={<UserPlus size={18} color={theme.colors.primary} />}
        message="A pessoa receberá apenas um convite. Evidências, localização e dados sensíveis não serão enviados."
        onClose={() => setDialog(null)}
        title="Convidar anjo de confiança?"
        visible={dialogVisibility.inviteDialog}
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Nome do convite</Text>
          <TextInput
            accessibilityLabel="Nome do convite"
            maxLength={60}
            onChangeText={setInviteLabel}
            placeholder="Anjo de confiança"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.textInput}
            value={inviteLabel}
          />
        </View>
      </BrandedDialog>

      <BrandedDialog
        actions={[
          { label: "Fechar", tone: "muted" },
          {
            label: "Configurar perfil",
            onPress: () => router.push("/perfis")
          }
        ]}
        icon={<UserRound size={18} color={theme.colors.warning} />}
        message={invitationGate.message}
        onClose={() => setDialog(null)}
        title={invitationGate.title}
        visible={dialogVisibility.profileBlockDialog}
      />

      <BrandedDialog
        actions={[
          { label: "Cancelar", tone: "muted" },
          {
            autoClose: false,
            label: busy ? "Revogando..." : "Revogar convite",
            onPress: () => {
              if (dialog?.kind === "revoke_invitation") void revokeInvitation(dialog.invitation);
            },
            tone: "danger"
          }
        ]}
        icon={<XCircle size={18} color={theme.colors.danger} />}
        message="Este convite será removido deste aparelho. Se já foi enviado, gere um novo convite se necessário."
        onClose={() => setDialog(null)}
        title="Revogar convite?"
        visible={dialogVisibility.revokeInvitationDialog}
      />

      <BrandedDialog
        actions={[
          { label: "Cancelar", tone: "muted" },
          {
            autoClose: false,
            label: busy ? "Revogando..." : "Revogar vínculo",
            onPress: () => {
              if (dialog?.kind === "revoke_contact") void revokeContact(dialog.contact);
            },
            tone: "danger"
          }
        ]}
        icon={<XCircle size={18} color={theme.colors.danger} />}
        message="Esta pessoa deixará de receber novas entregas autorizadas nas próximas fases do SinalSeguro."
        onClose={() => setDialog(null)}
        title="Revogar anjo?"
        visible={dialogVisibility.revokeContactDialog}
      />

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<ShieldCheck size={18} color={theme.colors.primary} />}
          message={notice.text}
          onClose={() => setPanel(null)}
          title={notice.title}
          visible={dialogVisibility.statePanel}
        >
          <StatusBanner tone={notice.tone} title="Resumo" text={status} />
        </BrandedDialog>

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<ShieldCheck size={18} color={theme.colors.primary} />}
          onClose={() => setPanel(null)}
          title="Prontidão"
          visible={dialogVisibility.readinessPanel}
        >
          <View style={styles.dialogStack}>
            <View style={styles.readinessItem}>
              <ShieldCheck
                size={18}
                color={readinessState.account.secure ? theme.colors.secure : theme.colors.textMuted}
              />
              <Text style={styles.readinessLabel}>{readinessState.account.label}</Text>
            </View>
            <View style={styles.readinessItem}>
              <ShieldCheck
                size={18}
                color={readinessState.device.secure ? theme.colors.secure : theme.colors.textMuted}
              />
              <Text style={styles.readinessLabel}>{readinessState.device.label}</Text>
            </View>
            <View style={styles.readinessItem}>
              {readinessState.api.enabled ? (
                <ShieldCheck size={18} color={theme.colors.secure} />
              ) : (
                <WifiOff size={18} color={theme.colors.warning} />
              )}
              <Text style={styles.readinessLabel}>{readinessState.api.label}</Text>
            </View>
          </View>
        </BrandedDialog>

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<Users size={18} color={theme.colors.primary} />}
          onClose={() => setPanel(null)}
          title="Meus anjos autorizados"
          visible={dialogVisibility.ownerLinksPanel}
        >
          <View style={styles.dialogStack}>
            {ownerPanelState.items.length > 0 ? (
              ownerPanelState.items.map((contact) => (
                <InviteCard
                  key={contact.id}
                  detail={trustedRelationshipDetail(contact)}
                  name={trustedRelationshipName(contact)}
                  onPress={contact.status === "accepted" ? () => setDialog({ contact, kind: "revoke_contact" }) : undefined}
                  status={contactStatus(contact)}
                  description={trustedRelationshipDescription(contact)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Users size={26} color={theme.colors.primary} />
                <Text style={styles.emptyTitle}>{ownerPanelState.emptyState.title}</Text>
                <Text style={styles.emptyText}>{ownerPanelState.emptyState.text}</Text>
              </View>
            )}
          </View>
        </BrandedDialog>

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<UserCheck size={18} color={theme.colors.primary} />}
          onClose={() => setPanel(null)}
          title="Sou anjo de"
          visible={dialogVisibility.angelLinksPanel}
        >
          <View style={styles.dialogStack}>
            {angelPanelState.items.length > 0 ? (
              angelPanelState.items.map((contact) => (
                <InviteCard
                  key={contact.id}
                  detail={trustedRelationshipDetail(contact)}
                  name={trustedRelationshipName(contact)}
                  status={contactStatus(contact)}
                  description={trustedRelationshipDescription(contact)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <UserCheck size={26} color={theme.colors.primary} />
                <Text style={styles.emptyTitle}>{angelPanelState.emptyState.title}</Text>
                <Text style={styles.emptyText}>{angelPanelState.emptyState.text}</Text>
              </View>
            )}
          </View>
        </BrandedDialog>

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<Clock3 size={18} color={theme.colors.primary} />}
          onClose={() => setPanel(null)}
          title="Convites"
          visible={dialogVisibility.invitationsPanel}
        >
          <View style={styles.dialogStack}>
            {invitationPanelState.sections.map((section) => (
              <Fragment key={section.key}>
                <SectionTitle
                  icon={
                    <Clock3
                      size={18}
                      color={section.tone === "warning" ? theme.colors.warning : theme.colors.primary}
                    />
                  }
                  title={section.title}
                />
                {section.invitations.map((invitation) => (
                  <InviteCard
                    key={buildTrustedAngelInvitationCardKey(invitation)}
                    detail={invitationDetail(invitation)}
                    name={invitation.displayLabel}
                    onPress={
                      canShowTrustedAngelInvitationRevocationAction(invitation.status)
                        ? () => setDialog({ invitation, kind: "revoke_invitation" })
                        : undefined
                    }
                    status={invitation.status}
                    description={invitationDescription(invitation)}
                  />
                ))}
              </Fragment>
            ))}
            {invitationPanelState.emptyState ? (
              <View style={styles.emptyState}>
                <Users size={26} color={theme.colors.primary} />
                <Text style={styles.emptyTitle}>{invitationPanelState.emptyState.title}</Text>
                <Text style={styles.emptyText}>{invitationPanelState.emptyState.text}</Text>
              </View>
            ) : null}
          </View>
        </BrandedDialog>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
    padding: theme.spacing.lg
  },
  contentScroll: {
    flex: 1
  },
  dialogStack: {
    gap: theme.spacing.md
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    minHeight: 148,
    padding: theme.spacing.xl
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 21,
    textAlign: "center"
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center"
  },
  fieldGroup: {
    gap: theme.spacing.sm
  },
  fieldLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    fontWeight: "800"
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 20
  },
  readinessItem: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 48,
    minWidth: 156,
    paddingHorizontal: theme.spacing.md
  },
  readinessLabel: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 12,
    fontWeight: "800"
  },
  resourceGrid: {
    flexDirection: "row",
    gap: theme.spacing.md
  },
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1
  },
  section: {
    gap: theme.spacing.md
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  sectionIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  sectionTitle: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "900"
  },
  statusText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    fontWeight: "700",
    lineHeight: 18,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg
  },
  shell: {
    backgroundColor: theme.colors.background,
    flex: 1,
    overflow: "hidden"
  },
  textInput: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: theme.typography.body,
    minHeight: 48,
    paddingHorizontal: theme.spacing.md
  }
});
