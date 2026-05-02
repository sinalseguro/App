import { mkdir, writeFile } from "node:fs/promises";
import QRCode from "qrcode";

const outputDir = new URL("../assets/qr/", import.meta.url);
const manifestPath = new URL("../distribution/installers.json", import.meta.url);

const installers = [
  {
    platform: "android",
    label: "Android",
    qrFile: "sinalseguro-android.svg",
    publicUrl: "https://www.sinalseguro.com.br/baixar/android",
    releaseAsset: "https://github.com/sinalseguro/App/releases/latest/download/sinalseguro-android.apk",
    status: "pendente_build_assinado"
  },
  {
    platform: "ios",
    label: "iOS",
    qrFile: "sinalseguro-ios.svg",
    publicUrl: "https://www.sinalseguro.com.br/baixar/ios",
    releaseAsset: "TestFlight/App Store pendente de conta, assinatura e revisao Apple",
    status: "pendente_testflight_app_store"
  }
];

await mkdir(outputDir, { recursive: true });

for (const installer of installers) {
  const svg = await QRCode.toString(installer.publicUrl, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    color: {
      dark: "#2b1745",
      light: "#ffffff"
    }
  });

  await writeFile(new URL(installer.qrFile, outputDir), svg, "utf8");
}

await writeFile(
  manifestPath,
  `${JSON.stringify(
    {
      generatedAt: "2026-05-02",
      owner: "SinalSeguro",
      manager: "Cristine",
      visualApproval: "Tarcila",
      installers
    },
    null,
    2
  )}\n`,
  "utf8"
);

console.log("QR codes e manifesto de instalacao gerados.");
