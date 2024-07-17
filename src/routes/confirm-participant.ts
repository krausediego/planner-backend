import { confirmParticipantService } from "@/services/confirm-participant";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function confirmParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/participants/:participantId/confirm",
    {
      schema: {
        params: z.object({
          participantId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { redirect } = await confirmParticipantService(request.params);

      return reply.redirect(redirect);
    }
  );
}
