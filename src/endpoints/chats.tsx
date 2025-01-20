import { getUserIdFromToken } from "../Services/DecodeToken";
import { chatApi } from "../Api/AxiosConfig";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is missing");
  return `Bearer ${token}`;
};

export const sendMessage = async (receiverId: number, content: string) => {
  const senderId = getUserIdFromToken();
  console.log("Logged user id = ", senderId);
  if (!senderId) throw new Error("senderId is missing");
  if (!receiverId) throw new Error("receiverId is missing");

  console.log("Content to send: ", content);
  await chatApi.post(`/send`, content, {
    headers: {
      Authorization: getAuthHeader(),
    },
    params: {
      senderId: senderId,
      receiverId: receiverId,
    },
  });
  console.log("Message sent successfully!");
};

export const getConversation = async (senderId: number) => {
  const loggedUserId = getUserIdFromToken();
  console.log("Logged user id = ", loggedUserId);

  if (!loggedUserId) throw new Error("loggedUserId is missing");
  if (!senderId) throw new Error("senderId is missing");

  const response = await chatApi.get(`/conversation`, {
    headers: {
      Authorization: getAuthHeader(),
    },
    params: {
      userId1: loggedUserId,
      userId2: senderId,
    },
  });

  console.log("Messages fetched successfully!");
  return response.data;
};
