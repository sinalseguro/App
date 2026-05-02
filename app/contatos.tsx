import { InviteCard } from "@/components/InviteCard";
import { SafeScreen } from "@/components/SafeScreen";
import { trustedContactsMock } from "@/features/contacts/contactMocks";

export default function ContactsScreen() {
  return (
    <SafeScreen
      title="Rede de anjos"
      subtitle="Convites usam token opaco, expiram e exigem aceite com conta propria."
    >
      {trustedContactsMock.map((contact) => (
        <InviteCard key={contact.id} name={contact.name} status={contact.status} description={contact.description} />
      ))}
    </SafeScreen>
  );
}
