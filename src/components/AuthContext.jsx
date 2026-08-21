import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    console.log("Checking redirect result...");
    getRedirectResult(auth)
      .then((result) => {
        console.log("Redirect result:", result);
        if (result?.user) {
          console.log("User from redirect:", result.user.email);
          setUser(result.user);
        } else {
          console.log("No redirect result — result was null");
        }
      })
      .catch((err) => {
        console.error("Redirect login failed:", err.code, err.message);
        setAuthError(err.message);
      });

    const unsub = onAuthStateChanged(auth, (u) => {
      console.log("onAuthStateChanged fired, user:", u?.email || "null");
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginWithGoogle = () => signInWithRedirect(auth, googleProvider);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithGoogle, logout, authError }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
