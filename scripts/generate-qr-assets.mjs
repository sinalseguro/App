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
    releaseAsset: "https://www.sinalseguro.com.br/downloads/private/android/SinalSeguro-privado-0.1.0-20260509.apk",
    checksumAsset: "https://www.sinalseguro.com.br/downloads/private/checksums.txt",
    sha256: "9060cfd4aca875fe1d171e65bb12a3f80c4f8e920fd3afb642cb41a384570f04",
    status: "privado_teste_controlado"
  },
  {
    platform: "ios",
    label: "iOS",
    qrFile: "sinalseguro-ios.svg",
    publicUrl: "https://www.sinalseguro.com.br/baixar/ios",
    releaseAsset: "https://www.sinalseguro.com.br/downloads/private/ios/SinalSeguro-privado-0.1.0-20260506-release.ipa",
    checksumAsset: "https://www.sinalseguro.com.br/downloads/private/checksums.txt",
    sha256: "27e4eb55e267a75b53b1a6a569ba0afe42ab2c8380e2e6093940bb78c3618493",
    status: "privado_teste_controlado"
  }
];

await mkdir(outputDir, { recursive: true });

for (const installer of installers) {
  const svg = await QRCode.toString(installer.releaseAsset, {
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
      generatedAt: "2026-05-09",
      owner: "SinalSeguro",
      manager: "Cristine",
      visualApproval: "Tarcila",
      distribution: "private_ec2",
      installers,
      repositories: [
        {
          label: "App SinalSeguro",
          url: "https://github.com/sinalseguro/App",
          status: "codigo_aberto"
        }
      ]
    },
    null,
    2
  )}\n`,
  "utf8"
);

console.log("QR codes e manifesto de instalacao gerados.");
