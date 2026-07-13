import type { LabServerOptions } from "./server.js";
import { handleLabRequest } from "./server.js";

type FastifyReply = {
  sent: boolean;
  header: (key: string, value: string) => FastifyReply;
  code: (statusCode: number) => FastifyReply;
  send: (payload?: unknown) => unknown;
};

type FastifyRequest = {
  raw: IncomingMessageLike;
};

type IncomingMessageLike = {
  url?: string;
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  on: (event: string, listener: (...args: unknown[]) => void) => void;
};

export function createLabFastifyPlugin(options: LabServerOptions) {
  return async function dnaLabPlugin(fastify: {
    addHook: (name: "onRequest", fn: (request: FastifyRequest, reply: FastifyReply) => Promise<void>) => void;
  }): Promise<void> {
    fastify.addHook("onRequest", async (request, reply) => {
      if (reply.sent) return;

      let finished = false;
      const resAdapter = {
        writeHead: (status: number, headers?: Record<string, string>) => {
          if (headers) {
            for (const [key, value] of Object.entries(headers)) {
              reply.header(key, value);
            }
          }
          reply.code(status);
        },
        end: (body?: string) => {
          finished = true;
          reply.send(body ?? "");
        },
      };

      const handled = await handleLabRequest(
        request.raw as Parameters<typeof handleLabRequest>[0],
        resAdapter as Parameters<typeof handleLabRequest>[1],
        options,
      );

      if (handled && !finished) {
        reply.send("");
      }
    });
  };
}
