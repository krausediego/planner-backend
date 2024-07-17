import { ClientError } from "@/errors/client-error";
import { prisma } from "@/lib/prisma";

type GetParticipantsServiceProps = {
  tripId: string;
};

export async function getParticipantsService({
  tripId,
}: GetParticipantsServiceProps) {
  const trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
    include: {
      participants: {
        select: {
          id: true,
          name: true,
          email: true,
          is_confirmed: true,
        },
      },
    },
  });

  if (!trip) {
    throw new ClientError("Trip not found.");
  }

  return { participants: trip.participants };
}
