import React, { useState } from "react";
import { useAuth } from "../../auth/Auth"; 
import { useNavigate } from "react-router-dom";
import '../../fonts.css'

function VoteFor() {
  const [pollLink, setPollLink] = useState("");
  const [password, setPassword] = useState("");

  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEnterPoll = () => {
    if (!user) {
      signInWithGoogle()
        .then(() => {
            window.location.href = `${pollLink}?passforvote=${password}`;
        })
        .catch((error) => {
          console.error("Erro durante a autenticação:", error);
        });
    } else {
        window.location.href = `${pollLink}?passforvote=${password}`;
    }
  };

  return (
    <div className="flex flex-col h-screen p-14 bg-global-gradient border-2">

      <div className="sticky top-0 w-full z-10">
          <div className="imgWrapper w-8 h-8 mt-4" onClick={() => navigate("/")}>
           <img
             src="/polls.jpeg"
             alt="Home"
             className="h-8 border-2 rounded-md cursor-pointer"
           />
          </div>
      </div>
 
     <div className="flex flex-col items-center justify-center">
     <h2 className="text-2xl font-semibold text-title mb-4 mt-4">Participar da Votação</h2>
      <div className="mt-2 p-4 rounded-lg border-2 ">
        <input
          type="text"
          placeholder="Link da Votação"
          className="w-full p-2 mb-4 bg-black text-white rounded-lg"
          value={pollLink}
          onChange={(e) => setPollLink(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha de Acesso"
          className="w-full p-2 mb-4 bg-black text-white rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="px-4 py-2  bg-navbg2  hover:bg-titlechange text-white rounded-lg"
          onClick={handleEnterPoll}
        >
          Participar
        </button>
      </div>
      </div>

    </div>
  );
}

export default VoteFor;
