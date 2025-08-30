import { authSchema, resetPasswordSchema } from "@/schema/authSchema";
import { fetchApi } from "@/utils/api";

/**
 *
 * @param data - data of type authSchema containing email and password
 * @returns an object with success status and user data or error message
 */
export const createUserAction = async (data: authSchema) => {
  const { email, password } = data;

  const response = await fetchApi("/api/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.error) {
    return { error: response.error || "Failed to create user" };
  }

  return { success: true, user: response.user };
};

/**
 *
 * @param data - data of type Omit<authSchema, "password"> containing only email
 * @returns an object with success status and message or error message
 */
export const forgotPasswordAction = async (
  data: Omit<authSchema, "password">,
) => {
  const { email } = data;

  const token = await fetchApi("/api/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  if (token.error) {
    return { error: token.error || "Failed to generate Token" };
  }

  return { success: true, message: token.message };
};

/**
 *
 * @param data - data of type resetPasswordSchema containing token and new password
 * @returns an object with success status and message or error message
 */
export const resetPasswordAction = async (data: resetPasswordSchema) => {
  const result = await fetchApi("/api/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (result.error) {
    return { error: result.error || "Failed to reset password" };
  }
  return { success: true, message: result.message };
};

/**
 *
 * @param token - email verification token
 * @returns an object with success status and message or error message
 */
export const verifyEmailAction = async (token: string) => {
  const response = await fetchApi(`/api/verify-email?token=${token}`, {
    method: "GET",
  });

  if (response.error) {
    return { error: response.error || "Failed to verify email" };
  }

  return { success: true, message: response.message };
};
