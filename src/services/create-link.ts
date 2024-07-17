import { ClientError } from "@/errors/client-error";
import { prisma } from "@/lib/prisma";

type CreateLinkServiceProps = {
  tripId: string;
  title: string;
  url: string;
};

export async function createLinkService({
  tripId,
  title,
  url,
}: CreateLinkServiceProps) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    throw new ClientError("Trip not found.");
  }

  const link = await prisma.link.create({
    data: {
      title,
      url,
      trip_id: tripId,
    },
  });

  return { linkId: link.id };
}
