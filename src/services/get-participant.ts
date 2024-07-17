import { ClientError } from "@/errors/client-error";
import { prisma } from "@/lib/prisma";

type GetParticipantServiceProps = {
  participantId: string;
};

export async function getParticipantService({
  participantId,
}: GetParticipantServiceProps) {
  const participant = await prisma.participant.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      is_confirmed: true,
    },
    where: { id: participantId },
  });

  if (!participant) {
    throw new ClientError("Participant not found.");
  }

  return { participant };
}
