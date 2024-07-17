import { ClientError } from "@/errors/client-error";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

type CreateTripServiceProps = {
  destination: string;
  starts_at: Date;
  ends_at: Date;
  owner_name: string;
  owner_email: string;
  emails_to_invite: string[];
};

export async function createTripService({
  destination,
  starts_at,
  ends_at,
  owner_name,
  owner_email,
  emails_to_invite,
}: CreateTripServiceProps) {
  if (dayjs(starts_at).isBefore(new Date())) {
    throw new ClientError("Invalid trip start date.");
  }

  if (dayjs(ends_at).isBefore(starts_at)) {
    throw new ClientError("Invalid trip end date.");
  }

  const trip = await prisma.trip.create({
    data: {
      destination,
      starts_at,
      ends_at,
      participant: {
        createMany: {
          data: [
            {
              name: owner_name,
              email: owner_email,
              is_owner: true,
              is_confirmed: true,
            },
            ...emails_to_invite.map((email) => {
              return { email };
            }),
          ],
        },
      },
    },
  });

  return { tripId: trip.id };
}
