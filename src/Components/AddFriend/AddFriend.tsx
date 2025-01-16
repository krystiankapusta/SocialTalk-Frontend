import React, { useEffect, useState } from "react";
import FriendService from "../../Services/FriendService";
import { authApi } from "../../../../Friends-Ui/src/Api/AxiosConfig";
import { getUserIdFromToken } from "../../Services/DecodeToken";

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

const FriendList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<PendingRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId = getUserIdFromToken();

  console.log(pendingRequests);

  console.log(users);

  const getUsernameByID = (userId: number) => {
    const findUser = users.filter((user) => user.id === userId);
    return findUser[0].username;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          setError("User ID is missing");
          return;
        }

        const usersResponse = await authApi.get("/users/all");

        const users = Array.isArray(usersResponse.data)
          ? usersResponse.data
          : Array.isArray(usersResponse.data.users)
            ? usersResponse.data.users
            : null;

        if (!users) {
          throw new Error(
            "Unexpected API response structure: " +
              JSON.stringify(usersResponse.data),
          );
        }

        setUsers(users);

        const pending = await FriendService.getPendingRequests();
        console.log("Pending requests:", pending);
        setPendingRequests(pending);

        const accepted = await FriendService.getAcceptedFriends();
        console.log("Accepted friends:", accepted);
        setFriends(accepted);
      } catch (err: any) {
        console.error(err);
        setError(
          "Error during fetched data: " +
            (err.response ? JSON.stringify(err.response.data) : err.message),
        );
      }
    };

    fetchData();
  }, []);

  const handleAddFriend = async (friendId: number) => {
    try {
      if (!userId) {
        setError("userId is missing in local storage");
        return;
      }

      await FriendService.sendFriendRequest(userId, friendId);
      alert("Invitation has been sent successfully!");
    } catch (err) {
      setError("Error when sending invitation");
    }
  };

  const handleAcceptRequest = async (friendId: number) => {
    try {
      if (!userId) {
        setError("userId is missing in local storage");
        return;
      }

      await FriendService.acceptFriendRequest(userId, friendId);
      alert("Invitation accepted!");
      setPendingRequests(
        pendingRequests.filter((request) => request.friendId !== friendId),
      );
      const acceptedUser = pendingRequests.find(
        (request) => request.friendId === friendId,
      );
      if (acceptedUser) {
        setFriends([...friends, acceptedUser]);
      }
    } catch (err) {
      setError("Error during accepting invitation");
    }
  };

  const handleRejectRequest = async (userIdToAdd: number) => {
    try {
      if (!userId) {
        setError("userId is missing in local storage");
        return;
      }
      await FriendService.rejectFriendRequest(userId, userIdToAdd);
      alert("Invitation reject!");
      setPendingRequests(
        pendingRequests.filter((request) => request.friendId !== userIdToAdd),
      );
    } catch (err) {
      setError("Error during rejecting invitation");
    }
  };

  const handleRemoveFriend = async (friendId: number) => {
    try {
      const loggedUserId = localStorage.getItem("userId");
      if (!loggedUserId) {
        setError("userId is missing in local storage");
        return;
      }
      await FriendService.removeFriend(loggedUserId, friendId);
      alert("Friend remove!");
      setFriends(friends.filter((request) => request.friendId !== friendId));
    } catch (err) {
      setError("Error during removing friend");
    }
  };

  const getUserStatus = (userId: number) => {
    if (friends.some((friend) => friend.id === userId)) return "friend";
    if (pendingRequests.some((request) => request.id === userId))
      return "pending";
    return "add";
  };
  const currentUserId = Number(getUserIdFromToken());

  const usersToDisplay = users.filter(
    (user) =>
      !friends.some((friend) => friend.id === user.id) &&
      user.id !== currentUserId,
  );

  // @ts-ignore
  return (
    <div>
      <div>
        <h1>Friends</h1>
        <p>Add friends or accept invitations!</p>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <h2>All users</h2>
        <ul>
          {usersToDisplay.map((user) => (
            <li key={user.id}>
              {user.username}
              {getUserStatus(user.id) === "add" && (
                <button onClick={() => handleAddFriend(user.id)}>Add</button>
              )}
              {getUserStatus(user.id) === "friend" && (
                <button onClick={() => handleRemoveFriend(user.id)}>
                  Delete
                </button>
              )}
              {getUserStatus(user.id) === "pending" && <span>Pending</span>}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Pending invitations</h2>
        <ul>
          {pendingRequests.map((request) => (
            <li key={request.id}>
              <p>
                <strong>Invitation from: </strong>{" "}
                {getUsernameByID(request.userId)}
              </p>
              <p>
                <strong>Invitation to: </strong>{" "}
                {getUsernameByID(request.friendId)}
              </p>
              <button onClick={() => handleAcceptRequest(request.friendId)}>
                Accept
              </button>
              <button onClick={() => handleRejectRequest(request.friendId)}>
                Reject
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendList;
