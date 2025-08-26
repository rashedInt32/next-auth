import { authSchema, resetPasswordSchema } from "@/schema/authSchema";
import { succeed } from "effect/Exit";

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

export const forgotPasswordAction = async (
  data: Omit<authSchema, "password">,
) => {
  const { email } = data;

  const token = await fetch("http://localhost:3000/api/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const response = await token.json();
  if (response.error) {
    return { error: response.error || "Failed to generate Token" };
  }

  return { success: true, message: response.message };
};

export const resetPasswordAction = async (data: resetPasswordSchema) => {
  const response = await fetch("http://localhost:3000/api/reset-password", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();

  if (result.error) {
    return { error: result.error || "Failed to reset password" };
  }
  return { success: true, message: result.message };
};
