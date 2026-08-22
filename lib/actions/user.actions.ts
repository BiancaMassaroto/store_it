"use server";

import { Query, ID } from "node-appwrite";
import { cookies } from "next/headers";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";

const handleError = (error: unknown, message: string) => {
  console.error(`${message}:`, error);
  throw error;
};

export const getUserByEmail = async (email: string) => {
  try {
    const { databases } = await createAdminClient();

    // Validando se o ID da coleção não está vindo vazio do config
    const collectionId = appwriteConfig.usersCollectionId;
    if (!collectionId) {
      throw new Error(
        "O ID da coleção 'usersCollectionId' não foi definido no config.",
      );
    }

    const result = await databases.listDocuments(
      "6a84e3aa001346d0eff2",
      "users",
      [Query.equal("email", [email])],
    );

    return result.total > 0 ? result.documents[0] : null;
  } catch (error) {
    handleError(error, "Failed to get user by email");
    return null;
  }
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  try {
    const existingUser = await getUserByEmail(email);

    const accountId = await sendEmailOTP({ email });
    if (!accountId) throw new Error("Failed to send an OTP");

    if (!existingUser) {
      const { databases } = await createAdminClient();

      await databases.createDocument(
        "6a84e3aa001346d0eff2", // ID fixo e garantido
        "users",
        ID.unique(),
        {
          fullName,
          email,
          avatar: avatarPlaceholderUrl,
          accountId,
        },
      );
    }

    return parseStringify({ accountId });
  } catch (error) {
    handleError(error, "Failed to create account");
  }
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
      "6a84e3aa001346d0eff2", // ID fixo e garantido
      "users",
      [Query.equal("accountId", result.$id)],
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    // User exists, send OTP
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};
