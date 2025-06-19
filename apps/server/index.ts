import Fastify from "fastify";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const server: FastifyInstance = Fastify();

server.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  return { message: "Hello from Fastify + Bun!" };
});

const start = async (): Promise<void> => {
  try {
    await server.listen({ port: 3001, host: "0.0.0.0" });
    console.log("🚀 Passport Server ready at http://localhost:3001");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
