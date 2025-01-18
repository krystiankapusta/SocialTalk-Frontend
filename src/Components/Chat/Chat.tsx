import React, { useEffect, useRef, useState } from "react";
import { getUserIdFromToken } from "../../Services/DecodeToken";
import "./styles.css";
import { authApi } from "../../Api/AxiosConfig";

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  sent_message_at: string;
}

interface User {
  id: number;
  username: string;
}

const ChatPage = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = Number(getUserIdFromToken());

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //const response = await getAcceptedFriends();
        const response = await authApi.get("/users/all");

        console.log(response);
        const data = await response.data;
        const filteredUsers = data.filter(
          (user: User) => user.id !== currentUserId,
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  // Fetch messages when user is selected
  useEffect(() => {
    if (!selectedUserId) return;

    const fetchMessages = async () => {
      try {
        // Modify this endpoint according to your API
        const response = await fetch(`/api/messages/${selectedUserId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUserId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: selectedUserId,
          content: newMessage,
        }),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages((prev) => [...prev, sentMessage]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const getSelectedUser = () => {
    return users.find((user) => user.id === selectedUserId);
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <ul className="chat-list">
          {users.map((user) => (
            <li
              key={user.id}
              className={`chat-list-item ${selectedUserId === user.id ? "active" : ""}`}
              onClick={() => setSelectedUserId(702)}
            >
              <div className="chat-list-avatar">
                {getUserInitials(user.username)}
              </div>
              <div className="chat-list-info">
                <div className="chat-list-name">{user.username}</div>
                <div className="chat-list-id">ID: {user.id}</div>
              </div>
            </li>
          ))}
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
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.sender_id === currentUserId ? "sent" : "received"
                  }`}
                >
                  <div className="message-content">
                    {message.content}
                    <span className="message-time">
                      {formatTime(message.sent_message_at)}
                    </span>
                  </div>
                </div>
              ))}
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
            <div className="messages-container">
              <div style={{ textAlign: "center", color: "#6b7280" }}>
                Select a user to start messaging
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
