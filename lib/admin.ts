import { getServerAuth } from "@/lib/server-auth";

const adminIds = [
  "user_2dGb6YEarBAQHrNYoB5dMtISRWK",
];

export const isAdmin = async () => {
  const { userId } = await getServerAuth();

  if (!userId) {
    return false;
  }

  return adminIds.indexOf(userId) !== -1;
};
