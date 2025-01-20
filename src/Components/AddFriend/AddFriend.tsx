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
    const fetchUsers = async () => {
      try {
        const usersResponse = await authApi.get("/users/all");
        const users = Array.isArray(usersResponse.data)
          ? usersResponse.data
          : Array.isArray(usersResponse.data.users)
            ? usersResponse.data.users
            : [];
        setUsers(users);
      } catch (err: any) {
        setError("Error fetching users: " + err.message);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        if (!userId) return;
        const pending = await getPendingRequests();
        setPendingRequests(pending);
      } catch (err: any) {
        setError("Error fetching pending requests: " + err.message);
      }
    };

    fetchPendingRequests();
  }, [userId]);

  useEffect(() => {
    const fetchAcceptedFriends = async () => {
      try {
        if (!userId) return;
        const accepted = await getAcceptedFriends();
        setFriends(accepted);
      } catch (err: any) {
        setError("Error fetching friends: " + err.message);
      }
    };

    fetchAcceptedFriends();
  }, [userId]);

  const handleAddFriend = async (friendId: number) => {
    try {
      if (!userId) throw new Error("User ID is missing");
      await sendFriendRequest(userId, friendId);
      const updatedPendingRequests = await getPendingRequests();
      setPendingRequests(updatedPendingRequests);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== friendId));
    } catch (err) {
      setError("Failed to send friend request");
    }
  };

  const handleAcceptRequest = async (friendId: number) => {
    try {
      if (!userId) throw new Error("User ID is missing");
      await acceptFriendRequest(userId, friendId);

      const [updatedPending, updatedFriends] = await Promise.all([
        getPendingRequests(),
        getAcceptedFriends(),
      ]);

      setPendingRequests(updatedPending);
      setFriends(updatedFriends);
    } catch (err) {
      setError("Failed to accept friend request");
    }
  };

  const handleRejectRequest = async (friendId: number) => {
    try {
      if (!userId) throw new Error("User ID is missing");
      await rejectFriendRequest(userId, friendId);
      const updatedPending = await getPendingRequests();
      setPendingRequests(updatedPending);
    } catch (err) {
      setError("Failed to reject friend request");
    }
  };

  const handleRemoveFriend = async (friendId: number) => {
    try {
      if (!userId) throw new Error("User ID is missing");

      const friendRelationship = friends.find(
        (friend) => friend.userId === friendId || friend.friendId === friendId,
      );

      if (!friendRelationship) {
        throw new Error("Friend relationship not found");
      }

      await removeFriend(
        friendRelationship.userId,
        friendRelationship.friendId,
      );

      const updatedFriends = await getAcceptedFriends();
      setFriends(updatedFriends);
    } catch (err) {
      setError("Failed to remove friend");
    }
  };

  const usersToDisplay = users.filter((user) => {
    if (user.id === currentUserId) return false;

    if (
      friends.some(
        (friend) => friend.friendId === user.id || friend.userId === user.id,
      )
    )
      return false;

    const hasPendingRequest = pendingRequests.some(
      (request) =>
        (request.userId === currentUserId && request.friendId === user.id) ||
        (request.userId === user.id && request.friendId === currentUserId),
    );

    return !hasPendingRequest;
  });
  console.log("Friends Array:", friends);
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
            {friends.map((friend) => {
              const friendUserId =
                friend.userId === currentUserId
                  ? friend.friendId
                  : friend.userId;

              return (
                <li key={friend.id} className="user-item">
                  <div className="user-info">
                    <div className="user-avatar">
                      {getUserInitials(getUsernameByID(friendUserId))}
                    </div>
                    <span className="user-name">
                      {getUsernameByID(friendUserId)}
                    </span>
                  </div>
                  <button
                    className="btn btn-remove"
                    onClick={() => handleRemoveFriend(friendUserId)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
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
                    onClick={() => handleAcceptRequest(request.userId)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-reject"
                    onClick={() => handleRejectRequest(request.userId)}
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
