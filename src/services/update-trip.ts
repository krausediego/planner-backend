import { ClientError } from "@/errors/client-error";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

type UpdateTripServiceProps = {
  tripId: string;
  destination: string;
  starts_at: Date;
  ends_at: Date;
};

export async function updateTripService({
  tripId,
  destination,
  starts_at,
  ends_at,
}: UpdateTripServiceProps) {
  const trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
  });

  if (!trip) {
    throw new ClientError("Trip not found.");
  }

  if (dayjs(starts_at).isBefore(new Date())) {
    throw new ClientError("Invalid trip start date.");
  }

  if (dayjs(ends_at).isBefore(starts_at)) {
    throw new ClientError("Invalid trip end date.");
  }

  await prisma.trip.update({
    where: { id: tripId },
    data: {
      destination,
      starts_at,
      ends_at,
    },
  });

  return { tripId: trip.id };
}
