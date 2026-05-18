import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";

const runtimeFiles = [
  "src/features/live-call/useLiveAudioCall.ts",
  "src/services/liveCallControl.ts",
  "src/services/liveWebRtcSession.ts"
];

const sensitivePatterns = [
  /Authorization/i,
  /access[_-]?token/i,
  /refresh[_-]?token/i,
  /id[_-]?token/i,
  /encrypted[_-]?key/i,
  /\bsdp\b/i,
  /candidate/i,
  /payload/i,
  /\buri\b/i,
  /file:\/\//i,
  /DocumentDirectory/i,
  /cacheDirectory/i
];

function isConsoleLine(line: string) {
  return /\bconsole\.(debug|error|info|log|warn)\s*\(/.test(line);
}

function assertNoSensitiveConsoleLine(file: string, source: string) {
  const lines = source.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!isConsoleLine(line)) return;
    const statementBlock = lines.slice(index, index + 5).join("\n");
    const forbidden = sensitivePatterns.find((pattern) => pattern.test(statementBlock));
    assert.equal(
      forbidden,
      undefined,
      `${file}:${index + 1} nao pode registrar dado sensivel em console runtime`
    );
  });
}

function assertNoConsoleOutsideAllowedRuntime(file: string, source: string) {
  const lines = source.split(/\r?\n/);
  const consoleLines = lines
    .map((line, index) => ({ index: index + 1, line }))
    .filter(({ line }) => isConsoleLine(line));

  if (file !== "src/services/liveWebRtcSession.ts") {
    assert.deepEqual(consoleLines, [], `${file} nao deve ter console runtime na live-call`);
    return;
  }

  for (const { index, line } of consoleLines) {
    const statementBlock = lines.slice(index - 1, index + 4).join("\n");
    assert.match(
      statementBlock,
      /SinalSeguroLiveCall|`\[SinalSeguroLiveCall\]/,
      `${file}:${index} so pode registrar telemetria saneada da live-call`
    );
  }
}

async function main() {
  for (const file of runtimeFiles) {
    const source = await readFile(file, "utf8");
    assertNoConsoleOutsideAllowedRuntime(file, source);
    assertNoSensitiveConsoleLine(file, source);
  }

  console.log("Live-call sensitive logging test aprovado.");
}

void main();
