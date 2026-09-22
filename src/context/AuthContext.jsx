import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context.js";
import { createUser, getUsers } from "../services/api.js";
import { readStorage, removeStorage, writeStorage } from "../utils/storage.js";

const AUTH_STORAGE_KEY = "commerce-auth-user";

function publicUser(user) {
  if (!user || typeof user !== "object" || Array.isArray(user)) {
    return null;
  }

  const { password: _password, ...safeUser } = user;
  return {
    ...safeUser,
    role: user.role === "admin" ? "admin" : "customer",
  };
}

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = readStorage(AUTH_STORAGE_KEY, null);
    return publicUser(storedUser);
  });

  useEffect(() => {
    if (currentUser) {
      writeStorage(AUTH_STORAGE_KEY, currentUser);
    } else {
      removeStorage(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  async function login(email, password) {
    const users = await getUsers();
    const userList = Array.isArray(users) ? users : [];
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const matchedUser = userList.find(
      (user) =>
        typeof user?.email === "string" &&
        user.email.toLowerCase() === normalizedEmail &&
        user?.password === password,
    );

    if (!matchedUser) {
      throw new Error("Invalid email or password.");
    }

    const safeUser = publicUser(matchedUser);
    setCurrentUser(safeUser);
    return safeUser;
  }

  async function register(userDetails) {
    const email =
      typeof userDetails?.email === "string"
        ? userDetails.email.trim().toLowerCase()
        : "";
    const password =
      typeof userDetails?.password === "string" ? userDetails.password : "";
    const name =
      typeof userDetails?.name === "string" ? userDetails.name.trim() : "";

    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required.");
    }

    const users = await getUsers();
    const userList = Array.isArray(users) ? users : [];
    const emailExists = userList.some(
      (user) =>
        typeof user?.email === "string" && user.email.toLowerCase() === email,
    );

    if (emailExists) {
      throw new Error("An account with that email already exists.");
    }

    const createdUser = await createUser({
      name,
      email,
      password,
      role: "customer",
      createdAt: new Date().toISOString(),
    });
    const safeUser = publicUser(createdUser);
    setCurrentUser(safeUser);
    return safeUser;
  }

  function logout() {
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isAdmin: currentUser?.role === "admin",
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
