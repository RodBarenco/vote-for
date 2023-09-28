import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

function Poll() {
  const { id } = useParams();
  const [pollData, setPollData] = useState(null);

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const pollRef = doc(db, 'poll', id);
        const pollSnapshot = await getDoc(pollRef);

        if (pollSnapshot.exists()) {
            // O documento da votação com o ID fornecido existe no Firebase
            const data = pollSnapshot.data();
            setPollData(data);
          } else {
            // O documento da votação com o ID fornecido não foi encontrado
            console.error("Votação não encontrada");
          }
        } catch (error) {
          console.error("Erro ao buscar os dados da votação:", error);
        }
      };
  
      // Chame a função para buscar os dados da votação quando o componente for montado
      fetchPollData();
    }, [id]); // Certifique-se de incluir "id" na lista de dependências para que a consulta seja refeita quando o ID da votação mudar
  
    if (!pollData) {
      // Exibe uma mensagem de carregamento enquanto os dados estão sendo buscados
      return <div>Carregando...</div>;
    }

  return (
    <div 
    style={{
      backgroundColor: pollData.bgColor,
      minHeight: window.innerHeight,
    }} 
    className="flex flex-col items-center p-1"
    >
      <div className="bg-cover bg-center w-full h-44" style={{ backgroundImage: `url(${pollData.coverPhoto})` }}>
        {/* Conteúdo da capa */}
      </div>

      <div className="text-3xl font-semibold mt-4" style={{ color: pollData.titleColor }}>
        {pollData.name}
      </div>
      <div className="text-lg" style={{ color: pollData.textColor }}>
        {pollData.summary}
      </div>

      <div className="w-full h-px bg-gray-900 mt-4"></div>

      <div className="text-2xl mt-4">Candidatos</div>

      <div className="flex flex-wrap">
        {Object.keys(pollData.candidates).map((candidateKey, index) => {
        const candidate = pollData.candidates[candidateKey];
          return (
            <div key={index} className="border rounded-lg p-4 m-4 w-60">
              <div className="text-xl" style={{ color: pollData.titleColor }}>
                {candidate.name}
            </div>

            <div className="text-lg" style={{ color: pollData.textColor }}>
              {candidate.img}
            </div>
        
      </div>
    );
  })}
</div>



    </div>
  );
}

export default Poll;
