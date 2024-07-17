import { env } from "@/env";
import { ClientError } from "@/errors/client-error";
import { prisma } from "@/lib/prisma";

type ConfirmTripServiceProps = {
  tripId: string;
};

export async function confirmTripService({ tripId }: ConfirmTripServiceProps) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { participant: { where: { is_owner: false } } },
  });

  if (!trip) {
    throw new ClientError("Trip not found.");
  }

  if (trip.is_confirmed) {
    return { redirect: `${env.WEB_BASE_URL}/trips/${tripId}` };
  }

  await prisma.trip.update({
    where: { id: tripId },
    data: { is_confirmed: true },
  });

  return { redirect: `${env.WEB_BASE_URL}/trips/${tripId}` };
}
