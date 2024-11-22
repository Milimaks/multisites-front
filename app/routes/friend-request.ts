import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { getUserToken } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userToken = await getUserToken({ request });
  const formData = await request.formData();
  const friendRequestId = formData.get("friendRequestId");
  const actionType = formData.get("actionType");

  const senderUserId = formData.get("senderUserId");
  const receiverUserId = formData.get("receiverUserId");

  const method = request.method;
  // Send a new friend request
  if (method === "POST" && senderUserId && receiverUserId) {
    const url = `${process.env.BACKEND_URL}/friend/request`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          senderUserId,
          receiverUserId,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de la demande d'ami");
      }

      return json({
        success: true,
        message: "Friend request sent successfully",
      });
    } catch (error) {
      return json({ error: (error as Error).message }, { status: 500 });
    }
  }
  // Delete a friend

  if (method === "DELETE" && senderUserId && receiverUserId) {
    const url = `${process.env.BACKEND_URL}/friend/${senderUserId}/${receiverUserId}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          senderUserId,
          receiverUserId,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'ami");
      }

      return json({
        success: true,
        message: "Friend deleted successfully",
      });
    } catch (error) {
      return json({ error: (error as Error).message }, { status: 500 });
    }
  }

  // Accept or decline a friend request
  if (!friendRequestId || !actionType) {
    return json({ error: "Missing data" }, { status: 400 });
  }
  const url = `${process.env.BACKEND_URL}/friend/request/${friendRequestId}/${actionType}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to ${actionType} friend request`);
    }
    return json({ success: true, message: `Friend request ${actionType}ed` });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const userToken = await getUserToken({ request });
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/friend/requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des demandes d'amis");
    }

    const data = await response.json();
    const { friendRequests } = data;
    return json(friendRequests);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};
