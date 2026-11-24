import { type ReactNode, useState } from "react";
import AuthContext from "./AuthContext";
import { useNavigate } from "react-router-dom";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(getUserToken());

  function getUserToken() {
    const foundToken = localStorage.getItem("token");
    return foundToken ? JSON.parse(foundToken) : null;
  }

  const isAuthenticated = !!user;

  async function login(signInCredentials: FormData) {
    const tokenData = await window.electron.signIn(
      new URLSearchParams(
        signInCredentials as unknown as Record<string, string>,
      ).toString(),
    );

    if (tokenData.success) {
      localStorage.setItem("token", JSON.stringify(tokenData));
      setUser(tokenData.data ? tokenData.data : null);
    }

    return tokenData;
  }

  async function register(registerCredentials: RegisterCredentials) {
    const registered = await window.electron.register(registerCredentials);
    return registered;
  }

  function logOut() {
    setUser(null);
    localStorage.removeItem("token");
    console.log("Move to auth page");
    navigate("/auth");
  }

  const authProviderValue = {
    user,
    isAuthenticated,
    login,
    register,
    logOut,
  };

  return (
    <AuthContext.Provider value={authProviderValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
