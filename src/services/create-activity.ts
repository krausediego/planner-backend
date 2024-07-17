import { ClientError } from "@/errors/client-error";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

type CreateActivityServiceProps = {
  tripId: string;
  title: string;
  occurs_at: Date;
};

export async function createActivityService({
  tripId,
  title,
  occurs_at,
}: CreateActivityServiceProps) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    throw new ClientError("Trip not found.");
  }

  if (dayjs(occurs_at).isBefore(trip.starts_at)) {
    throw new ClientError("Invalid activity date.");
  }

  if (dayjs(occurs_at).isAfter(trip.ends_at)) {
    throw new ClientError("Invalid activity date.");
  }

  const activity = await prisma.activity.create({
    data: {
      title,
      occurs_at,
      trip_id: tripId,
    },
  });

  return { activityId: activity.id };
}
