"use client";
import { signIn } from "@/auth";
import { authSchema } from "@/schema/loginSchema";

export const loginAction = async (data: authSchema) => {
  const { email, password } = data;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    return { error: (error as Error).message || "Login failed" };
  }

  return { success: true };
};

export const createUserAction = async (data: authSchema) => {
  const { email, password } = data;

  const user = await fetch("http://localhost:3000/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const response = await user.json();
  if (response.error) {
    return { error: response.error || "Failed to create user" };
  }

  return { success: true, user: response.user };
};
