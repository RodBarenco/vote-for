import React from "react";
import { useAuth } from "../../auth/Auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { user, signInWithGoogle, logout } = useAuth();

  const handleLoginWithGoogle = () => {
    signInWithGoogle().then(() => {
      // Determinar a rota de redirecionamento com base nas condições
      let redirectTo;
      if (window.location.pathname.includes("my-polls")) {
        redirectTo = "/voting-polls";
      } else if (window.location.pathname.includes("voting-polls")) {
        redirectTo = "/voting-polls";
      } else if (window.location.pathname.includes("poll-adm")) {
        redirectTo = window.location.pathname; // Mantém a mesma rota
      } else if (window.location.pathname.includes("poll")) {
        redirectTo = window.location.pathname; // Mantém a mesma rota
      } else {
        redirectTo = "/"; // Página inicial padrão
      }

      navigate(redirectTo);
    });
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Bem-vindo, {user.displayName}!</p>
          <button onClick={logout}>Sair</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLoginWithGoogle}>Login com Google</button>
        </div>
      )}
    </div>
  );
}

export default Login;
