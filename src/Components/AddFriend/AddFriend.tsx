import React, { useEffect, useState } from "react";
import { authApi } from "../../../../Friends-Ui/src/Api/AxiosConfig";
import { getUserIdFromToken } from "../../Services/DecodeToken";
import {
  acceptFriendRequest,
  getAcceptedFriends,
  getPendingRequests,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "../../endpoints/friends";
import "./styles.css";
import Button from "../Button/Button";

interface User {
  id: number;
  username: string;
  isFriend?: boolean;
}

interface PendingRequest {
  id: string;
  userId: number;
  friendId: number;
  status: "pending" | "accepted" | "rejected";
}

const FriendList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<PendingRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId = getUserIdFromToken();
  const currentUserId = Number(userId);

  const getUsernameByID = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    return user?.username || "Unknown User";
  };

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          setError("User ID is missing");
          return;
        }

        const [usersResponse, pending, accepted] = await Promise.all([
          authApi.get("/users/all"),
          getPendingRequests(),
          getAcceptedFriends(),
        ]);

        const users = Array.isArray(usersResponse.data)
          ? usersResponse.data
          : Array.isArray(usersResponse.data.users)
            ? usersResponse.data.users
            : [];

        setUsers(users);
        setPendingRequests(pending);
        setFriends(accepted);
      } catch (err: any) {
        setError(
          "Error fetching data: " +
            (err.response ? err.response.data.message : err.message),
        );
      }
    };

    fetchData();
  }, [userId]);

  const handleAddFriend = async (friendId: number) => {
    try {
      if (!userId) throw new Error("User ID is missing");
      await sendFriendRequest(userId, friendId);
      setPendingRequests([
        ...pendingRequests,
        {
          id: Date.now().toString(),
          userId: currentUserId,
          friendId,
          status: "pending",
        },
      ]);
    } catch (err) {
      setError("Failed to send friend request");
    }
  };

  const handleAcceptRequest = async (friendId: number) => {
    try {
      if (!userId) throw new Error("User ID is missing");
      await acceptFriendRequest(userId, friendId);

      const acceptedRequest = pendingRequests.find(
        (request) => request.friendId === friendId,
      );

      setPendingRequests(
        pendingRequests.filter((request) => request.friendId !== friendId),
      );

      if (acceptedRequest) {
        setFriends([...friends, acceptedRequest]);
      }
    } catch (err) {
      setError("Failed to accept friend request");
    }
  };

  const handleRejectRequest = async (friendId: number) => {
    try {
      if (!userId) throw new Error("User ID is missing");
      await rejectFriendRequest(userId, friendId);
      setPendingRequests(
        pendingRequests.filter((request) => request.friendId !== friendId),
      );
    } catch (err) {
      setError("Failed to reject friend request");
    }
  };

  const handleRemoveFriend = async (friendId: number) => {
    try {
      if (!userId) throw new Error("User ID is missing");
      await removeFriend(userId, friendId);
      setFriends(friends.filter((friend) => friend.friendId !== friendId));
    } catch (err) {
      setError("Failed to remove friend");
    }
  };

  const usersToDisplay = users.filter(
    (user) =>
      !friends.some((friend) => friend.friendId === user.id) &&
      user.id !== currentUserId &&
      !pendingRequests.some(
        (request) =>
          request.userId === currentUserId && request.friendId === user.id,
      ),
  );

  return (
    <div className="friend-list-container">
      <div className="friend-list-header">
        <h1>Friends</h1>
        <p>Add friends or accept invitations!</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="columns-container">
        <div className="column">
          <h2>My Friends ({friends.length})</h2>
          <ul className="user-list">
            {friends.map((friend) => (
              <li key={friend.id} className="user-item">
                <div className="user-info">
                  <div className="user-avatar">
                    {getUserInitials(getUsernameByID(friend.friendId))}
                  </div>
                  <span className="user-name">
                    {getUsernameByID(friend.friendId)}
                  </span>
                </div>
                <button
                  className="btn btn-remove"
                  onClick={() => handleRemoveFriend(friend.friendId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="column">
          <h2>All Users ({usersToDisplay.length})</h2>
          <ul className="user-list">
            {usersToDisplay.map((user) => (
              <li key={user.id} className="user-item">
                <div className="user-info">
                  <div className="user-avatar">
                    {getUserInitials(user.username)}
                  </div>
                  <span className="user-name">{user.username}</span>
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleAddFriend(user.id)}
                  label="Add Friend"
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="column">
          <h2>Pending Requests ({pendingRequests.length})</h2>
          <ul className="user-list">
            {pendingRequests.map((request) => (
              <li key={request.id} className="user-item">
                <div className="user-info">
                  <div className="user-avatar">
                    {getUserInitials(getUsernameByID(request.userId))}
                  </div>
                  <span className="user-name">
                    {getUsernameByID(request.userId)}
                  </span>
                </div>
                <div className="btn-group">
                  <button
                    className="btn btn-accept"
                    onClick={() => handleAcceptRequest(request.friendId)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-reject"
                    onClick={() => handleRejectRequest(request.friendId)}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FriendList;
