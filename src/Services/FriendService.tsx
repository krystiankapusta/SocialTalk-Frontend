import { friendsApi } from "../../../Friends-Ui/src/Api/AxiosConfig";
import { getUserIdFromToken } from "./DecodeToken";

class FriendService {
  async getPendingRequests() {
    const userId = getUserIdFromToken();
    if (!userId) throw new Error("User ID is missing");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing");

    const response = await friendsApi.get("/pending", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { userId },
    });

    return response.data;
  }

  async getAcceptedFriends() {
    const userId = getUserIdFromToken();
    if (!userId) throw new Error("User ID is missing");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing");

    const response = await friendsApi.get("/accepted", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { userId },
    });
    return response.data;
  }

  async sendFriendRequest(loggedUserId: string, friendId: number) {
    if (!loggedUserId) throw new Error("loggedUserId is missing");
    if (!friendId) throw new Error("friendId is missing");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing");

    await friendsApi.post(
      `/add/${friendId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userId: loggedUserId },
      },
    );
  }

  async acceptFriendRequest(loggedUserId: string, friendId: number) {
    if (!loggedUserId) throw new Error("loggedUserId is missing");
    if (!friendId) throw new Error("friendId is missing");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing");

    await friendsApi.post(
      `/accept/${friendId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userId: loggedUserId },
      },
    );
  }

  async rejectFriendRequest(loggedUserId: string, friendId: number) {
    if (!loggedUserId) throw new Error("loggedUserId is missing");
    if (!friendId) throw new Error("friendId is missing");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is missing");

    await friendsApi.post(
      `/reject/${friendId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userId: loggedUserId },
      },
    );
  }

  async removeFriend(loggedUserId: string, friendId: number) {
    await friendsApi.delete(`/remove/${friendId}`, {
      params: { userId: loggedUserId },
    });
  }
}

export default new FriendService();
