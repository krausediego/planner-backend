import { env } from "@/env";
import { ClientError } from "@/errors/client-error";
import { prisma } from "@/lib/prisma";

type ConfirmParticipantServiceProps = {
  participantId: string;
};

export async function confirmParticipantService({
  participantId,
}: ConfirmParticipantServiceProps) {
  const participant = await prisma.participant.findUnique({
    where: {
      id: participantId,
    },
  });

  if (!participant) {
    throw new ClientError("Participant not found.");
  }

  if (participant.is_confirmed) {
    return { redirect: `${env.WEB_BASE_URL}/trips/${participant.trip_id}` };
  }

  await prisma.participant.update({
    where: { id: participantId },
    data: { is_confirmed: true },
  });

  return { redirect: `${env.WEB_BASE_URL}/trips/${participant.trip_id}` };
}
