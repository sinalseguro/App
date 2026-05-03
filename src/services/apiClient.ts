import { z } from "zod";

const apiBaseUrl = process.env.EXPO_PUBLIC_SINALSEGURO_API_BASE_URL?.trim() || null;
const apiEnabled = process.env.EXPO_PUBLIC_SINALSEGURO_API_ENABLED === "1" && Boolean(apiBaseUrl);

const HealthSchema = z.object({
  status: z.string().optional()
});

export async function getHealth() {
  if (!apiEnabled || !apiBaseUrl) {
    throw new Error("API externa bloqueada neste build local.");
  }

  const response = await fetch(`${apiBaseUrl}/health`);

  if (!response.ok) {
    throw new Error("API SinalSeguro indisponivel");
  }

  return HealthSchema.parse(await response.json());
}

export const apiConfig = {
  apiEnabled,
  apiBaseUrl
};
