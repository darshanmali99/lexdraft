import {
  Navigate
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

function ProtectedRoute({

  children

}) {

  // ======================================
  // STATE
  // ======================================

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);


  // ======================================
  // VALIDATE TOKEN
  // ======================================

  useEffect(() => {

    const validateToken = () => {

      try {

        const token =
          localStorage.getItem("token");

        // No token

        if (!token) {

          setAuthenticated(false);

          setCheckingAuth(false);

          return;
        }

        // Decode JWT

        const payload =
          JSON.parse(
            atob(
              token.split(".")[1]
            )
          );

        // Check expiration

        const currentTime =
          Date.now() / 1000;

        if (payload.exp < currentTime) {

          // Expired token cleanup

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          setAuthenticated(false);

        } else {

          setAuthenticated(true);
        }

      } catch (error) {

        console.error(
          "Invalid token:",
          error
        );

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        setAuthenticated(false);

      } finally {

        setCheckingAuth(false);
      }
    };

    validateToken();

  }, []);


  // ======================================
  // PREVENT FLASH
  // ======================================

  if (checkingAuth) {

    return null;
  }


  // ======================================
  // REDIRECT
  // ======================================

  if (!authenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // ======================================
  // ALLOW ACCESS
  // ======================================

  return children;
}

export default ProtectedRoute;