import { ClientError } from "@/errors/client-error";
import { prisma } from "@/lib/prisma";

type CreateInviteServiceProps = {
  tripId: string;
  email: string;
};

export async function createInviteService({
  tripId,
  email,
}: CreateInviteServiceProps) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    throw new ClientError("Trip not found");
  }

  const participant = await prisma.participant.create({
    data: {
      email,
      trip_id: tripId,
    },
  });

  return { participantId: participant.id };
}
