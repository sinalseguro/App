import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ignored = new Set(["node_modules", ".git", ".expo", "dist", "build", "coverage"]);
const checkedExtensions = new Set([".ts", ".tsx", ".md", ".json", ".yaml", ".yml"]);
const forbidden = [/senha\s*=/i, /token\s*=/i, /api[_-]?key\s*=/i, /private key/i, /BEGIN RSA PRIVATE KEY/];

async function walk(dir) {
  const entries = await readdir(dir);

  for (const entry of entries) {
    if (ignored.has(entry)) continue;

    const filePath = path.join(dir, entry);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      await walk(filePath);
      continue;
    }

    if (!checkedExtensions.has(path.extname(filePath))) continue;

    const content = await readFile(filePath, "utf8");
    const hasForbidden = forbidden.some((pattern) => pattern.test(content));

    if (hasForbidden) {
      throw new Error(`Conteudo sensivel potencial encontrado em ${filePath}`);
    }
  }
}

await walk(".");
console.log("Lint local aprovado: nenhum padrao sensivel encontrado.");
