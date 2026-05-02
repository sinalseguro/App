import { TrustedContact } from "./types";

export const trustedContactsMock: TrustedContact[] = [
  {
    id: "anjo-1",
    name: "Contato de confianca",
    status: "pendente",
    description: "Convite criado em modo demonstracao. O aceite real exigira conta propria."
  },
  {
    id: "anjo-2",
    name: "Rede familiar",
    status: "aceito",
    description: "Exemplo de anjo autorizado para validar a interface sem dados reais."
  }
];
