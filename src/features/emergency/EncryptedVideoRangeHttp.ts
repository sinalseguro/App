export type HttpRange = {
  endExclusive: number;
  length: number;
  start: number;
  status: 200 | 206;
};

export type ParsedHttpRequest = {
  headers: Record<string, string>;
  method: string;
  path: string;
};

const maxRequestHeaderBytes = 8192;

export function parseHttpRequestHeader(headerText: string): ParsedHttpRequest {
  if (headerText.length > maxRequestHeaderBytes) {
    throw new Error("Cabecalho HTTP local excedeu o limite permitido.");
  }

  const [requestLine = "", ...headerLines] = headerText.split("\r\n");
  const [method = "", rawPath = ""] = requestLine.split(" ");
  const headers: Record<string, string> = {};

  for (const line of headerLines) {
    if (!line) continue;
    const separatorIndex = line.indexOf(":");
    if (separatorIndex <= 0) continue;
    headers[line.slice(0, separatorIndex).trim().toLowerCase()] = line.slice(separatorIndex + 1).trim();
  }

  return {
    headers,
    method: method.toUpperCase(),
    path: rawPath.split("?")[0] || "/"
  };
}

export function parseSingleRange(rangeHeader: string | undefined, totalSize: number): HttpRange {
  if (!Number.isFinite(totalSize) || totalSize <= 0) {
    throw new Error("Tamanho do video invalido para streaming local.");
  }

  if (!rangeHeader) {
    return {
      endExclusive: totalSize,
      length: totalSize,
      start: 0,
      status: 200
    };
  }

  const normalizedRange = rangeHeader.trim();
  if (normalizedRange.includes(",")) {
    throw new Error("Multirange nao e permitido no player seguro.");
  }

  const match = /^bytes=(\d*)-(\d*)$/i.exec(normalizedRange);
  if (!match) {
    throw new Error("Range HTTP invalido.");
  }

  const [, startValue, endValue] = match;
  if (!startValue && !endValue) {
    throw new Error("Range HTTP vazio.");
  }

  if (!startValue) {
    const suffixLength = Number(endValue);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) {
      throw new Error("Sufixo de range HTTP invalido.");
    }
    const length = Math.min(suffixLength, totalSize);
    return {
      endExclusive: totalSize,
      length,
      start: totalSize - length,
      status: 206
    };
  }

  const start = Number(startValue);
  const inclusiveEnd = endValue ? Number(endValue) : totalSize - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(inclusiveEnd) || start < 0 || inclusiveEnd < start || start >= totalSize) {
    throw new Error("Range HTTP fora do video.");
  }

  const endExclusive = Math.min(inclusiveEnd + 1, totalSize);
  return {
    endExclusive,
    length: endExclusive - start,
    start,
    status: 206
  };
}

export function buildStreamingHeaders({
  contentLength,
  contentRange,
  status
}: {
  contentLength: number;
  contentRange?: string;
  status: 200 | 206;
}) {
  return [
    `HTTP/1.1 ${status} ${status === 206 ? "Partial Content" : "OK"}`,
    "Accept-Ranges: bytes",
    "Cache-Control: no-store",
    "Connection: close",
    "Content-Type: video/mp4",
    `Content-Length: ${contentLength}`,
    contentRange ? `Content-Range: ${contentRange}` : null,
    "",
    ""
  ]
    .filter((line): line is string => line !== null)
    .join("\r\n");
}

export function buildErrorHeaders(status: 400 | 403 | 404 | 405 | 416 | 431 | 500) {
  const labels: Record<typeof status, string> = {
    400: "Bad Request",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    416: "Range Not Satisfiable",
    431: "Request Header Fields Too Large",
    500: "Internal Server Error"
  };

  return [
    `HTTP/1.1 ${status} ${labels[status]}`,
    "Cache-Control: no-store",
    "Connection: close",
    "Content-Length: 0",
    "",
    ""
  ].join("\r\n");
}
