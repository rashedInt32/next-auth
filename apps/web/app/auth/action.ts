"use client";
import { signIn } from "@/auth";
import { authSchema } from "@/schema/loginSchema";

export const loginAction = async (data: authSchema) => {
  "use client";
  const { email, password } = data;

  console.log("Login action data:", data);

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    console.error("Login error from action:", error);
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
  console.log("User creation:", response);
  if (response.error) {
    return { error: response.error || "Failed to create user" };
  }

  return { success: true, user: response.user };
};
