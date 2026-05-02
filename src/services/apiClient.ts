import { z } from "zod";

const apiBaseUrl = "https://api.sinalseguro.com.br/api";

const HealthSchema = z.object({
  status: z.string().optional()
});

export async function getHealth() {
  const response = await fetch(`${apiBaseUrl}/health`);

  if (!response.ok) {
    throw new Error("API SinalSeguro indisponivel");
  }

  return HealthSchema.parse(await response.json());
}

export const apiConfig = {
  apiBaseUrl
};
