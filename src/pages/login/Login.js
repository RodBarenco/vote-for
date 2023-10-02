import React from "react";
import { useAuth } from "../../auth/Auth";
import { useNavigate } from "react-router-dom";
import '../../fonts.css'

function Login() {
  const navigate = useNavigate();
  const { user, signInWithGoogle, logout } = useAuth();

  const handleLoginWithGoogle = () => {
    signInWithGoogle().then(() => {
      // Determina a rota de redirecionamento com base nas condições
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
    <div className="bg-global-gradient flex flex-col items-center">

    <div className="sticky top-0 w-full pl-12 mt-8 z-10">
        <div className="imgWrapper w-8 h-8 mt-4" onClick={() => navigate("/")}>
         <img
           src="/polls.jpeg"
           alt="Home"
           className="h-8 border-2 rounded-md cursor-pointer"
        />
       </div>
      </div>

    <div className="flex flex-col items-center mt-28 h-screen p-20 text-title">
      <div className="text-center">
        {user ? (
          <div>
            <p>Bem-vindo, {user.displayName}!</p>
            <button onClick={logout} className="mt-4 px-4 py-2 bg-navbg2 hover:bg-titlechange text-white rounded-lg">
              Sair
            </button>
          </div>
        ) : (
          <div>
            <h1 className="font-Outfit text-5xl text-white">G</h1>
            <button onClick={handleLoginWithGoogle} className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-lg">
              Login com Google <i className="fa fa-solid fa-sign-in fa-1x ml-2"></i>
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default Login;
