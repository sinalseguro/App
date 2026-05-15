import { ReactNode, useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
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
import { LocalInvitation } from "@/features/invitations/types";
import {
  canCreateTrustedContactInvitation,
  getProfileSummary,
  ProtectionProfile
} from "@/features/profiles/profilePolicy";
import { getActiveProtectionProfile } from "@/features/profiles/profileStore";
import {
  ApiInvitation,
  ApiSession,
  ApiTrustedContact,
  ApiTrustedContactRelationship,
  apiClient,
  apiConfig
} from "@/services/apiClient";
import { deviceBindingService } from "@/services/deviceBinding";

type AngelsDialog =
  | {
      kind: "invite";
    }
  | {
      invitation: LocalInvitation;
      kind: "revoke_invitation";
    }
  | {
      contact: ApiTrustedContact;
      kind: "revoke_contact";
    }
  | {
      kind: "profile_block";
    }
  | null;

type ScreenNotice = {
  text: string;
  title: string;
  tone: "secure" | "warning" | "danger";
};

type AngelsPanel = "estado" | "prontidao" | "anjos" | "sou_anjo" | "convites" | null;

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit"
  });
}

function invitationDescription(invitation: LocalInvitation) {
  if (invitation.status === "compartilhado") {
    return "Convite compartilhado. O vínculo só nasce após aceite com conta própria.";
  }
  if (invitation.status === "expirado") {
    return "Convite expirado. Gere um novo convite se esta pessoa ainda deve participar.";
  }
  if (invitation.status === "revogado") {
    return "Convite revogado neste aparelho.";
  }
  return "Aguardando compartilhamento e aceite com conta própria.";
}

function invitationDetail(invitation: LocalInvitation) {
  const source = invitation.syncStatus === "backend_validated" ? "API validada" : "Local";
  return `${source} · expira em ${formatShortDate(invitation.expiresAt)}`;
}

function contactStatus(contact: ApiTrustedContact): "aceito" | "pendente" | "revogado" {
  if (contact.status === "accepted") return "aceito";
  if (contact.status === "revoked") return "revogado";
  return "pendente";
}

function trustedRelationshipName(relationship: ApiTrustedContactRelationship) {
  if (relationship.relationship_role === "angel") {
    return relationship.owner_display_name || "Pessoa protegida";
  }
  return relationship.contact_display_name || relationship.display_label || "Anjo autorizado";
}

function trustedRelationshipDetail(relationship: ApiTrustedContactRelationship) {
  const dateLabel = relationship.accepted_at
    ? `Aceito em ${formatShortDate(relationship.accepted_at)}`
    : "Conta própria exigida";
  if (relationship.relationship_role === "angel") {
    return `Sou anjo · ${dateLabel}`;
  }
  return `Meu anjo · ${dateLabel}`;
}

function trustedRelationshipDescription(relationship: ApiTrustedContactRelationship) {
  const name = trustedRelationshipName(relationship);
  if (relationship.status === "revoked") {
    return relationship.relationship_role === "angel"
      ? `Vínculo com ${name} revogado.`
      : `Vínculo com ${name} revogado. Esta pessoa não recebe novas entregas.`;
  }
  if (relationship.relationship_role === "angel") {
    return `Você aceitou ser anjo de ${name}. Você só verá alertas autorizados pelo SinalSeguro.`;
  }
  return `${name} aceitou ser seu anjo de confiança. Nada é enviado fora de um alerta autorizado.`;
}

function acceptedOwnerSummary(count: number) {
  if (count === 0) return "Nenhum";
  if (count === 1) return "1 aceitou";
  return `${count} aceitaram`;
}

function acceptedAngelSummary(count: number) {
  if (count === 0) return "Nenhum";
  if (count === 1) return "1 pessoa";
  return `${count} pessoas`;
}

function invitationFromApi(invitation: ApiInvitation): LocalInvitation {
  return {
    id: invitation.id,
    backendInvitationId: invitation.id,
    trustedContactId: invitation.trusted_contact,
    token: "",
    displayLabel: invitation.display_label,
    inviteUrl: "",
    deepLinkUrl: "",
    createdAt: invitation.created_at,
    expiresAt: invitation.expires_at,
    singleUsePolicy: "backend_single_use_enforced",
    status:
      invitation.status === "accepted"
        ? "aceito"
        : invitation.status === "revoked"
          ? "revogado"
          : new Date(invitation.expires_at).getTime() < Date.now()
            ? "expirado"
            : "pendente",
    syncStatus: "backend_validated"
  };
}

function buildNotice({
  apiSession,
  angelLinks,
  busy,
  invitations,
  ownerLinks
}: {
  apiSession: ApiSession | null;
  angelLinks: ApiTrustedContactRelationship[];
  busy: boolean;
  invitations: LocalInvitation[];
  ownerLinks: ApiTrustedContactRelationship[];
}): ScreenNotice {
  if (busy) {
    return {
      text: "Atualizando vínculos e convites.",
      title: "Sincronizando",
      tone: "secure"
    };
  }

  const acceptedOwnerCount = ownerLinks.filter((contact) => contact.status === "accepted").length;
  const acceptedAngelCount = angelLinks.filter((contact) => contact.status === "accepted").length;
  if (acceptedOwnerCount > 0 || acceptedAngelCount > 0) {
    const ownerText =
      acceptedOwnerCount > 0
        ? `${acceptedOwnerCount} anjo${acceptedOwnerCount > 1 ? "s" : ""} autorizado${acceptedOwnerCount > 1 ? "s" : ""}`
        : "";
    const angelText =
      acceptedAngelCount > 0
        ? `você é anjo de ${acceptedAngelCount} pessoa${acceptedAngelCount > 1 ? "s" : ""}`
        : "";
    return {
      text: `${[ownerText, angelText].filter(Boolean).join(" e ")}. Nada é enviado fora de um alerta autorizado.`,
      title: acceptedAngelCount > 0 && acceptedOwnerCount === 0 ? "Você é anjo" : "Anjos autorizados",
      tone: "secure"
    };
  }

  if (invitations.some((invitation) => invitation.status === "compartilhado")) {
    return {
      text: "Convite compartilhado. O vínculo só nasce quando a pessoa aceita com a própria conta.",
      title: "Aguardando aceite",
      tone: "warning"
    };
  }

  if (invitations.length > 0) {
    return {
      text: "Convite criado neste aparelho. Evidências e localização não foram enviadas.",
      title: "Convite preparado",
      tone: "warning"
    };
  }

  return {
    text: apiSession
      ? "Convide uma pessoa de confiança. O convite é o único dado compartilhado nesta etapa."
      : "Entre em Configurações > Login para criar convite validado pela API. Sem login, o convite fica local.",
    title: "Nenhum anjo ativo ainda",
    tone: apiSession ? "secure" : "warning"
  };
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>{icon}</View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export default function ContactsScreen() {
  const [apiSession, setApiSession] = useState<ApiSession | null>(null);
  const [backendInvitations, setBackendInvitations] = useState<ApiInvitation[]>([]);
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState<AngelsDialog>(null);
  const [deviceReady, setDeviceReady] = useState(false);
  const [inviteLabel, setInviteLabel] = useState("Anjo de confiança");
  const [invitations, setInvitations] = useState<LocalInvitation[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<AngelsPanel>(null);
  const [activeProfile, setActiveProfile] = useState<ProtectionProfile | null>(null);
  const [status, setStatus] = useState("Carregando anjos de confiança...");
  const [trustedContacts, setTrustedContacts] = useState<ApiTrustedContact[]>([]);
  const [trustedRelationships, setTrustedRelationships] = useState<ApiTrustedContactRelationship[]>([]);

  const mergedInvitations = useMemo(() => {
    const localByBackendId = new Set(invitations.map((invitation) => invitation.backendInvitationId).filter(Boolean));
    const acceptedOrRevokedContactIds = new Set(
      trustedContacts
        .filter((contact) => contact.status === "accepted" || contact.status === "revoked")
        .map((contact) => contact.id)
    );
    const remoteOnly = backendInvitations
      .filter(
        (invitation) =>
          !localByBackendId.has(invitation.id) && !acceptedOrRevokedContactIds.has(invitation.trusted_contact)
      )
      .map(invitationFromApi);

    return [...invitations, ...remoteOnly].sort(
      (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );
  }, [backendInvitations, invitations, trustedContacts]);

  const linkedContacts = useMemo(
    () =>
      trustedRelationships.filter(
        (contact) =>
          contact.relationship_role === "owner" && (contact.status === "accepted" || contact.status === "revoked")
      ),
    [trustedRelationships]
  );

  const angelLinks = useMemo(
    () =>
      trustedRelationships.filter(
        (contact) =>
          contact.relationship_role === "angel" && (contact.status === "accepted" || contact.status === "revoked")
      ),
    [trustedRelationships]
  );

  const backendValidatedInvitations = useMemo(
    () => mergedInvitations.filter((invitation) => invitation.syncStatus === "backend_validated"),
    [mergedInvitations]
  );

  const localPreInvitations = useMemo(
    () => mergedInvitations.filter((invitation) => invitation.syncStatus !== "backend_validated"),
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

  async function refreshAngels() {
    setBusy(true);
    try {
      const [nextInvitations, currentSession, registeredDeviceId, nextProfile] = await Promise.all([
        listLocalInvitations(),
        apiClient.getStoredSession(),
        deviceBindingService.getRegisteredApiDeviceId(),
        getActiveProtectionProfile()
      ]);
      setInvitations(nextInvitations);
      setApiSession(currentSession);
      setDeviceReady(Boolean(registeredDeviceId));
      setActiveProfile(nextProfile);

      if (currentSession) {
        const [contacts, remoteInvitations, relationships] = await Promise.all([
          apiClient.listTrustedContacts(),
          apiClient.listInvitations(),
          apiClient.listTrustedContactRelationships()
        ]);
        setTrustedContacts(contacts);
        setBackendInvitations(remoteInvitations);
        setTrustedRelationships(relationships);
      } else {
        setTrustedContacts([]);
        setBackendInvitations([]);
        setTrustedRelationships([]);
      }
      setStatus("Anjos atualizados.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível atualizar anjos agora.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void refreshAngels();
  }, []);

  async function shareInvitation() {
    const currentGate = canCreateTrustedContactInvitation(activeProfile);
    if (!currentGate.allowed) {
      setStatus(currentGate.message);
      setDialog({ kind: "profile_block" });
      return;
    }

    const label = inviteLabel.trim() || "Anjo de confiança";
    setBusy(true);
    setStatus("Gerando convite seguro...");

    try {
      const invitation = await createLocalInvitation(label);
      await Share.share({ message: buildInvitationShareText(invitation), url: invitation.inviteUrl });
      await markInvitationShared(invitation.id);
      await refreshAngels();
      setStatus(
        invitation.syncStatus === "backend_validated"
          ? "Convite seguro criado. Ele é único e tem validade limitada."
          : "Convite criado neste aparelho. O vínculo só nasce após aceite com conta própria."
      );
      setDialog(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível criar convite agora.");
    } finally {
      setBusy(false);
    }
  }

  async function revokeInvitation(invitation: LocalInvitation) {
    setBusy(true);
    setStatus("Revogando convite...");

    try {
      if (invitation.backendInvitationId && apiSession) {
        await apiClient.revokeInvitation(invitation.backendInvitationId);
      }
      if (invitations.some((item) => item.id === invitation.id)) {
        await revokeLocalInvitation(invitation.id);
      }
      await refreshAngels();
      setStatus("Convite revogado.");
      setDialog(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível revogar convite agora.");
    } finally {
      setBusy(false);
    }
  }

  async function revokeContact(contact: ApiTrustedContact) {
    setBusy(true);
    setStatus("Revogando vínculo...");

    try {
      await apiClient.revokeTrustedContact(contact.id);
      await refreshAngels();
      setStatus("Vínculo revogado.");
      setDialog(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível revogar vínculo agora.");
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

  const invitationCount = backendValidatedInvitations.length + localPreInvitations.length;

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
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<UserRound size={24} color={theme.colors.primary} />}
              label="Perfil"
              description={profileSummary.title}
              onPress={() => router.push("/perfis")}
            />
            <ResourceTile
              icon={<ShieldCheck size={24} color={theme.colors.primary} />}
              label="Estado"
              description={notice.title}
              onPress={() => setPanel("estado")}
            />
          </View>
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<UserPlus size={24} color={theme.colors.primary} />}
              label="Criar convite"
              description={invitationGate.allowed ? (apiSession ? "API" : "Local") : "Bloqueado"}
              onPress={() => setDialog(invitationGate.allowed ? { kind: "invite" } : { kind: "profile_block" })}
            />
            <ResourceTile
              icon={<ShieldCheck size={24} color={theme.colors.primary} />}
              label="Prontidão"
              description={deviceReady ? "Dispositivo" : "Pendente"}
              onPress={() => setPanel("prontidao")}
            />
          </View>
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<Users size={24} color={theme.colors.primary} />}
              label="Anjos"
              description={acceptedOwnerSummary(linkedContacts.filter((contact) => contact.status === "accepted").length)}
              onPress={() => setPanel("anjos")}
            />
            <ResourceTile
              icon={<UserCheck size={24} color={theme.colors.primary} />}
              label="Sou anjo"
              description={acceptedAngelSummary(angelLinks.filter((contact) => contact.status === "accepted").length)}
              onPress={() => setPanel("sou_anjo")}
            />
          </View>
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<Clock3 size={24} color={theme.colors.primary} />}
              label="Convites"
              description={invitationCount ? `${invitationCount} item` : "Nenhum"}
              onPress={() => setPanel("convites")}
            />
            <ResourceTile
              icon={<RefreshCw size={24} color={theme.colors.primary} />}
              label="Atualizar"
              description={busy ? "Sincronizando" : "Sincronizar"}
              onPress={refreshAngels}
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
        visible={dialog?.kind === "invite"}
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
        visible={dialog?.kind === "profile_block"}
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
        visible={dialog?.kind === "revoke_invitation"}
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
        visible={dialog?.kind === "revoke_contact"}
      />

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<ShieldCheck size={18} color={theme.colors.primary} />}
          message={notice.text}
          onClose={() => setPanel(null)}
          title={notice.title}
          visible={panel === "estado"}
        >
          <StatusBanner tone={notice.tone} title="Resumo" text={status} />
        </BrandedDialog>

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<ShieldCheck size={18} color={theme.colors.primary} />}
          onClose={() => setPanel(null)}
          title="Prontidão"
          visible={panel === "prontidao"}
        >
          <View style={styles.dialogStack}>
            <View style={styles.readinessItem}>
              <ShieldCheck size={18} color={apiSession ? theme.colors.secure : theme.colors.textMuted} />
              <Text style={styles.readinessLabel}>{apiSession ? "Conta conectada" : "Conta local"}</Text>
            </View>
            <View style={styles.readinessItem}>
              <ShieldCheck size={18} color={deviceReady ? theme.colors.secure : theme.colors.textMuted} />
              <Text style={styles.readinessLabel}>{deviceReady ? "Dispositivo registrado" : "Dispositivo pendente"}</Text>
            </View>
            <View style={styles.readinessItem}>
              {apiConfig.apiEnabled ? (
                <ShieldCheck size={18} color={theme.colors.secure} />
              ) : (
                <WifiOff size={18} color={theme.colors.warning} />
              )}
              <Text style={styles.readinessLabel}>{apiConfig.apiEnabled ? "API configurada" : "API desativada"}</Text>
            </View>
          </View>
        </BrandedDialog>

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<Users size={18} color={theme.colors.primary} />}
          onClose={() => setPanel(null)}
          title="Anjos autorizados"
          visible={panel === "anjos"}
        >
          <View style={styles.dialogStack}>
            {linkedContacts.length > 0 ? (
              linkedContacts.map((contact) => (
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
                <Text style={styles.emptyTitle}>Nenhum anjo ativo ainda</Text>
                <Text style={styles.emptyText}>O vínculo só nasce após aceite com conta própria.</Text>
              </View>
            )}
          </View>
        </BrandedDialog>

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<UserCheck size={18} color={theme.colors.primary} />}
          onClose={() => setPanel(null)}
          title="Sou anjo de"
          visible={panel === "sou_anjo"}
        >
          <View style={styles.dialogStack}>
            {angelLinks.length > 0 ? (
              angelLinks.map((contact) => (
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
                <Text style={styles.emptyTitle}>Você ainda não é anjo</Text>
                <Text style={styles.emptyText}>Quando aceitar um convite, o nome de quem convidou aparecerá aqui.</Text>
              </View>
            )}
          </View>
        </BrandedDialog>

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<Clock3 size={18} color={theme.colors.primary} />}
          onClose={() => setPanel(null)}
          title="Convites"
          visible={panel === "convites"}
        >
          <View style={styles.dialogStack}>
            {backendValidatedInvitations.length > 0 ? (
              <>
                <SectionTitle icon={<Clock3 size={18} color={theme.colors.primary} />} title="Convites validados" />
                {backendValidatedInvitations.map((invitation) => (
                  <InviteCard
                    key={`${invitation.syncStatus}-${invitation.id}`}
                    detail={invitationDetail(invitation)}
                    name={invitation.displayLabel}
                    onPress={
                      invitation.status === "pendente" || invitation.status === "compartilhado"
                        ? () => setDialog({ invitation, kind: "revoke_invitation" })
                        : undefined
                    }
                    status={invitation.status}
                    description={invitationDescription(invitation)}
                  />
                ))}
              </>
            ) : null}
            {localPreInvitations.length > 0 ? (
              <>
                <SectionTitle icon={<Clock3 size={18} color={theme.colors.warning} />} title="Pré-convites locais" />
                {localPreInvitations.map((invitation) => (
                  <InviteCard
                    key={`${invitation.syncStatus}-${invitation.id}`}
                    detail={invitationDetail(invitation)}
                    name={invitation.displayLabel}
                    onPress={
                      invitation.status === "pendente" || invitation.status === "compartilhado"
                        ? () => setDialog({ invitation, kind: "revoke_invitation" })
                        : undefined
                    }
                    status={invitation.status}
                    description={invitationDescription(invitation)}
                  />
                ))}
              </>
            ) : null}
            {invitationCount === 0 ? (
              <View style={styles.emptyState}>
                <Users size={26} color={theme.colors.primary} />
                <Text style={styles.emptyTitle}>Nenhum convite criado</Text>
                <Text style={styles.emptyText}>Crie um convite quando quiser preparar um anjo.</Text>
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
