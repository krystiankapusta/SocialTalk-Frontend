import React, { useEffect, useRef, useState } from "react";
import { getUserIdFromToken } from "../../Services/DecodeToken";
import "./styles.css";
import { authApi } from "../../Api/AxiosConfig";
import { getAcceptedFriends } from "../../endpoints/friends";
import { getConversation, sendMessage } from "../../endpoints/chats";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  sentMessageAt: string;
}

interface User {
  id: number;
  username: string;
}

interface PendingRequest {
  id: string;
  userId: number;
  friendId: number;
  status: "pending" | "accepted" | "rejected";
}

const ChatPage = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<PendingRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = Number(getUserIdFromToken());

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authApi.get("/users/all", {
          params: { excludeCurrentUserId: currentUserId },
        });
        const filteredUsers = response.data;
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  useEffect(() => {
    if (!selectedUserId) return;

    const fetchMessages = async () => {
      try {
        const data = await getConversation(selectedUserId);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUserId]);

  useEffect(() => {
    const fetchAcceptedFriends = async () => {
      try {
        const accepted = await getAcceptedFriends();
        setFriends(accepted);
      } catch (err) {
        console.error("Error fetching friends: ", err);
      }
    };

    fetchAcceptedFriends();
  }, [currentUserId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    try {
      await sendMessage(selectedUserId, newMessage);

      const sentMessage: Message = {
        id: Date.now(),
        senderId: currentUserId,
        receiverId: selectedUserId,
        content: newMessage,
        sentMessageAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getUsernameByID = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    return user?.username || "Unknown User";
  };

  const getUserInitials = (username: string) =>
    username.slice(0, 2).toUpperCase();

  const getSelectedUser = () =>
    users.find((user) => user.id === selectedUserId);

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="header-chat-list">
          <h2>Friends</h2>
        </div>
        <ul className="chat-list">
          {friends.length > 0 ? (
            friends.map((friend) => {
              const friendUserId =
                friend.userId === currentUserId
                  ? friend.friendId
                  : friend.userId;

              return (
                <li
                  key={friend.id}
                  className={`chat-list-item ${
                    selectedUserId === friendUserId ? "active" : ""
                  }`}
                  onClick={() => setSelectedUserId(friendUserId)}
                >
                  <div className="chat-list-avatar">
                    {getUserInitials(getUsernameByID(friendUserId))}
                  </div>
                  <div className="chat-list-info">
                    <div className="chat-list-name">
                      {getUsernameByID(friendUserId)}
                    </div>
                    <div className="chat-list-id">ID: {friendUserId}</div>
                  </div>
                </li>
              );
            })
          ) : (
            <div className="no-friends">No friends available</div>
          )}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {selectedUserId ? (
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-header-avatar">
                {getUserInitials(getSelectedUser()?.username || "")}
              </div>
              <div className="chat-header-info">
                <div className="chat-header-name">
                  {getSelectedUser()?.username}
                </div>
                <div className="chat-header-id">ID: {selectedUserId}</div>
              </div>
            </div>
            <div className="messages-container">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${
                      message.senderId === currentUserId ? "sent" : "received"
                    }`}
                  >
                    <div className="message-content">
                      {message.content}
                      <span className="message-time">
                        {formatTime(message.sentMessageAt)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-messages">No messages yet</div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="message-input-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="message-input"
              />
              <button type="submit" className="send-button">
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="chat-container">
            <div className="no-user">Select a user to start messaging</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
