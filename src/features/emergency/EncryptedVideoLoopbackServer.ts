import * as Crypto from "expo-crypto";
import { EncryptedVideoDataSource } from "./EncryptedVideoDataSource";
import { EncryptedVideoManifest } from "./EncryptedVideoManifest";
import type { VideoFileSystemAdapter } from "./EncryptedVideoStore";
import { LocalMediaAsset } from "./types";
import { base64ToBytes, bytesToHex } from "./videoByteEncoding";
import {
  buildErrorHeaders,
  buildStreamingHeaders,
  parseHttpRequestHeader,
  parseSingleRange
} from "./EncryptedVideoRangeHttp";

const localHost = "127.0.0.1";
const requestHeaderTerminator = "\r\n\r\n";
const maxRequestHeaderBytes = 8192;

declare const require: (moduleName: string) => any;

type TcpSocketInstance = {
  destroy: () => void;
  end: (data?: string | Uint8Array, encoding?: string) => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
  setEncoding?: (encoding: string) => void;
  write: (data: string | Uint8Array, encoding?: string, callback?: (error?: Error) => void) => boolean;
};

type TcpServerInstance = {
  address: () => { address: string; family: string; port: number } | null | {};
  close: (callback?: (error?: Error) => void) => void;
  listen: (options: { host: string; port: number; reuseAddress?: boolean }, callback?: () => void) => TcpServerInstance;
  on: (event: string, listener: (...args: any[]) => void) => void;
};

type VideoPlaybackStore = {
  getFileSystem: () => VideoFileSystemAdapter;
  readManifest: (asset: LocalMediaAsset) => Promise<EncryptedVideoManifest>;
};

type VideoPlaybackDataSource = Pick<EncryptedVideoDataSource, "streamRange">;

export type EncryptedVideoLoopbackSession = {
  close: () => Promise<void>;
  uri: string;
};

export class EncryptedVideoLoopbackServer {
  private readonly dataSource: VideoPlaybackDataSource;
  private readonly keyReader: (keyRef: string) => Promise<Uint8Array>;
  private readonly store: VideoPlaybackStore;

  constructor(
    store: VideoPlaybackStore = defaultVideoPlaybackStore(),
    dataSource: VideoPlaybackDataSource = new EncryptedVideoDataSource(),
    keyReader: (keyRef: string) => Promise<Uint8Array> = defaultVideoKeyReader
  ) {
    this.store = store;
    this.dataSource = dataSource;
    this.keyReader = keyReader;
  }

  async open(asset: LocalMediaAsset, abortSignal?: AbortSignal): Promise<EncryptedVideoLoopbackSession> {
    if (!asset.encryptedVideo) {
      throw new Error("Streaming local exige video criptografado.");
    }

    throwIfAborted(abortSignal);
    const manifest = await this.store.readManifest(asset);
    throwIfAborted(abortSignal);
    const key = await this.keyReader(asset.encryptedVideo.keyRef);
    throwIfAborted(abortSignal);
    const capability = bytesToHex(Crypto.getRandomBytes(24));
    const sockets = new Set<TcpSocketInstance>();
    const server = await this.listen(asset, manifest, key, capability, sockets);
    const address = server.address();
    const port = address && "port" in address ? address.port : 0;
    if (!port) {
      closeServer(server, sockets);
      throw new Error("Servidor local do player nao retornou porta valida.");
    }

    if (abortSignal?.aborted) {
      closeServer(server, sockets);
      throwIfAborted(abortSignal);
    }

    return {
      close: () => closeServer(server, sockets),
      uri: `http://${localHost}:${port}/${capability}/${asset.id}.mp4`
    };
  }

  private listen(
    asset: LocalMediaAsset,
    manifest: EncryptedVideoManifest,
    key: Uint8Array,
    capability: string,
    sockets: Set<TcpSocketInstance>
  ) {
    return new Promise<TcpServerInstance>((resolve, reject) => {
      const tcpSocketModule = require("react-native-tcp-socket");
      const TcpSocket = tcpSocketModule.default ?? tcpSocketModule;
      const server = TcpSocket.createServer((socket: TcpSocketInstance) => {
        sockets.add(socket);
        socket.setEncoding?.("utf8");
        this.handleConnection(socket, asset, manifest, key, capability).finally(() => {
          sockets.delete(socket);
        });
      }) as TcpServerInstance;

      server.on("error", reject);
      server.listen({ host: localHost, port: 0, reuseAddress: false }, () => resolve(server));
    });
  }

  private async handleConnection(
    socket: TcpSocketInstance,
    asset: LocalMediaAsset,
    manifest: EncryptedVideoManifest,
    key: Uint8Array,
    capability: string
  ) {
    const abortController = new AbortController();
    let headerBuffer = "";

    socket.on("close", () => abortController.abort());
    socket.on("error", () => abortController.abort());

    await new Promise<void>((resolve) => {
      socket.on("data", (data: string | Uint8Array) => {
        headerBuffer += typeof data === "string" ? data : String.fromCharCode(...Array.from(data));

        if (headerBuffer.length > maxRequestHeaderBytes) {
          socket.end(buildErrorHeaders(431));
          resolve();
          return;
        }

        const headerEnd = headerBuffer.indexOf(requestHeaderTerminator);
        if (headerEnd < 0) return;

        const headerText = headerBuffer.slice(0, headerEnd);
        this.respondToRequest(socket, asset, manifest, key, capability, headerText, abortController.signal)
          .catch(() => {
            if (!abortController.signal.aborted) {
              socket.end(buildErrorHeaders(500));
            }
          })
          .finally(resolve);
      });
    });
  }

  private async respondToRequest(
    socket: TcpSocketInstance,
    asset: LocalMediaAsset,
    manifest: EncryptedVideoManifest,
    key: Uint8Array,
    capability: string,
    headerText: string,
    abortSignal: AbortSignal
  ) {
    const request = parseHttpRequestHeader(headerText);
    const expectedPath = `/${capability}/${asset.id}.mp4`;

    if (request.path !== expectedPath) {
      socket.end(buildErrorHeaders(404));
      return;
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      socket.end(buildErrorHeaders(405));
      return;
    }

    let range;
    try {
      range = parseSingleRange(request.headers.range, manifest.plaintextSizeBytes);
    } catch {
      socket.end(buildErrorHeaders(416));
      return;
    }

    const contentRange =
      range.status === 206
        ? `bytes ${range.start}-${range.endExclusive - 1}/${manifest.plaintextSizeBytes}`
        : undefined;
    await writeAndDrain(
      socket,
      buildStreamingHeaders({
        contentLength: range.length,
        contentRange,
        status: range.status
      })
    );

    if (request.method === "HEAD") {
      socket.end();
      return;
    }

    await this.dataSource.streamRange({
      abortSignal,
      key,
      length: range.length,
      manifest,
      readSealedChunk: async (chunkManifest) =>
        base64ToBytes(await this.store.getFileSystem().readBase64File(chunkManifest.chunkUri)),
      start: range.start,
      verifyPlaintextHash: false,
      onChunk: async (bytes) => {
        await writeAndDrain(socket, bytes);
      }
    });

    socket.end();
  }
}

function defaultVideoPlaybackStore(): VideoPlaybackStore {
  const { EncryptedVideoStore } = require("./EncryptedVideoStore");
  return new EncryptedVideoStore();
}

async function defaultVideoKeyReader(keyRef: string) {
  const { readVideoKey } = require("./EncryptedVideoStore");
  return readVideoKey(keyRef);
}

async function closeServer(server: TcpServerInstance, sockets: Set<TcpSocketInstance>) {
  for (const socket of sockets) {
    socket.destroy();
  }
  sockets.clear();
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
}

function throwIfAborted(abortSignal?: AbortSignal) {
  if (abortSignal?.aborted) {
    throw new Error("Streaming local de video cancelado.");
  }
}

function writeAndDrain(socket: TcpSocketInstance, data: string | Uint8Array) {
  return new Promise<void>((resolve, reject) => {
    try {
      const flushed = socket.write(data, undefined, (error?: Error) => {
        if (error) reject(error);
      });
      if (flushed) {
        resolve();
        return;
      }
      socket.on("drain", resolve);
    } catch (error) {
      reject(error);
    }
  });
}
