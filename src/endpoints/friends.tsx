import { friendsApi } from "../../../Friends-Ui/src/Api/AxiosConfig";
import { getUserIdFromToken } from "../Services/DecodeToken";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return `Bearer ${token}`;
};

export const getPendingRequests = async () => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error("User ID is missing");

  const response = await friendsApi.get("/pending", {
    headers: {
      Authorization: getAuthHeader(),
    },
    params: { userId },
  });

  return response.data;
};

export const getAcceptedFriends = async () => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error("User ID is missing");

  const response = await friendsApi.get("/accepted", {
    headers: {
      Authorization: getAuthHeader(),
    },
    params: { userId },
  });
  return response.data;
};

export const sendFriendRequest = async (
  loggedUserId: string,
  friendId: number,
) => {
  if (!loggedUserId) throw new Error("loggedUserId is missing");
  if (!friendId) throw new Error("friendId is missing");

  await friendsApi.post(
    `/add/${friendId}`,
    {},
    {
      headers: {
        Authorization: getAuthHeader(),
      },
      params: { userId: loggedUserId },
    },
  );
};

export const acceptFriendRequest = async (
  loggedUserId: string,
  friendId: number,
) => {
  if (!loggedUserId) throw new Error("loggedUserId is missing");
  if (!friendId) throw new Error("friendId is missing");

  await friendsApi.post(
    `/accept/${friendId}`,
    {},
    {
      headers: {
        Authorization: getAuthHeader(),
      },
      params: { userId: loggedUserId },
    },
  );
};

export const rejectFriendRequest = async (
  loggedUserId: string,
  friendId: number,
) => {
  if (!loggedUserId) throw new Error("loggedUserId is missing");
  if (!friendId) throw new Error("friendId is missing");

  await friendsApi.post(
    `/reject/${friendId}`,
    {},
    {
      headers: {
        Authorization: getAuthHeader(),
      },
      params: { userId: loggedUserId },
    },
  );
};

export const removeFriend = async (loggedUserId: string, friendId: number) => {
  if (!loggedUserId) throw new Error("loggedUserId is missing");

  await friendsApi.delete(`/remove/${friendId}`, {
    headers: {
      Authorization: getAuthHeader(),
    },
    params: { userId: loggedUserId },
  });
};

export const checkFriendshipStatus = async (
  userId1: number,
  userId2: number,
): Promise<boolean> => {
  try {
    const response = await friendsApi.get(`/isFriend`, {
      headers: {
        Authorization: getAuthHeader(),
      },
      params: {
        userId1,
        userId2,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking friendship status:", error);
    throw error;
  }
};
