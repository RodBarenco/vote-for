import React, { useState } from "react";
import '../../fonts.css'

function VoteFor() {
  const [votingLink, setVotingLink] = useState("");
  const [password, setPassword] = useState("");

  const handleVoteSubmit = () => {
    // Adicione aqui a lógica para processar o link da votação e a senha de acesso.
    // Por enquanto, vou apenas exibir os valores no console.
    console.log("Link da Votação:", votingLink);
    console.log("Senha de Acesso:", password);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-20 bg-global-gradient">
     <h2 className="text-2xl font-semibold text-title mb-4">Participar da Votação</h2>
      <div className="mt-2 p-4 rounded-lg border-2 ">
        <input
          type="text"
          placeholder="Link da Votação"
          className="w-full p-2 mb-4 bg-black text-white rounded-lg"
          value={votingLink}
          onChange={(e) => setVotingLink(e.target.value)}
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
          onClick={handleVoteSubmit}
        >
          Participar
        </button>
      </div>
    </div>
  );
}

export default VoteFor;
