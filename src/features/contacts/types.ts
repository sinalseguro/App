export type TrustedContactStatus = "pendente" | "aceito" | "revogado";

export type TrustedContact = {
  id: string;
  name: string;
  status: TrustedContactStatus;
  description: string;
};
