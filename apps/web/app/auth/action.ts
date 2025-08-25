import { authSchema } from "@/schema/loginSchema";

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

export const generateResetPasswordTokenAction = async (
  data: Omit<authSchema, "password">,
) => {
  const { email } = data;

  const token = await fetch("http://localhost:3000/api/reset-password", {
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
