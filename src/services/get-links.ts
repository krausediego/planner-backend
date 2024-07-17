import { ClientError } from "@/errors/client-error";
import { prisma } from "@/lib/prisma";

type GetLinksServiceProps = {
  tripId: string;
};

export async function getLinksService({ tripId }: GetLinksServiceProps) {
  const trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
    include: {
      links: true,
    },
  });

  if (!trip) {
    throw new ClientError("Trip not found.");
  }

  return { links: trip.links };
}
