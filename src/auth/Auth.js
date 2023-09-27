import React, { createContext, useContext, useState, useEffect } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase-config";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { uid, displayName } = result.user;
      
      // Crie um objeto user com as informações necessárias
      const user = {
        id: uid,
        displayName: displayName,
      };
  
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error("Erro ao fazer login com o Google:", error);
    }
  };
  

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      setUser(null);
      console.log("Logout realizado com sucesso");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
