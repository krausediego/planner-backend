import { ClientError } from "@/errors/client-error";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

type GetActivitiesServiceProps = {
  tripId: string;
};

export async function getActivitiesService({
  tripId,
}: GetActivitiesServiceProps) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      activities: {
        orderBy: {
          occurs_at: "asc",
        },
      },
    },
  });

  if (!trip) {
    throw new ClientError("Trip not found.");
  }

  const differenceInDaysBetweenTripStartAndEnd = dayjs(trip.ends_at).diff(
    trip.starts_at,
    "days"
  );

  const activities = Array.from({
    length: differenceInDaysBetweenTripStartAndEnd + 1,
  }).map((_, index) => {
    const date = dayjs(trip.starts_at).add(index, "days");

    return {
      date: date.toDate(),
      activities: trip.activities.filter((activity) => {
        return dayjs(activity.occurs_at).isSame(date, "day");
      }),
    };
  });

  return { activities };
}
