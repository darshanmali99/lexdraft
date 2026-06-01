import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);

      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = (jwtToken, userData) => {
    localStorage.setItem("token", jwtToken);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setToken(jwtToken);

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setToken(null);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        authenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;