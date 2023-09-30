import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import  'font-awesome/css/font-awesome.min.css';

function Poll() {
  const { id } = useParams();
  const [pollData, setPollData] = useState(null);
  const navigate = useNavigate();

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
      
      <div className="sticky top-0 w-full pl-6 z-10">
        <div className="imgWrapper" onClick={() => navigate("/")}>
         <img
           src="/polls.jpeg"
           alt="Home"
           className="h-8 mt-4 border-2 rounded-md cursor-pointer"
        />
       </div>
      </div>

      <div className="text-3xl font-semibold mt-4" style={{ color: pollData.titleColor }}>
        {pollData.name}
      </div>
      <div className="text-lg" style={{ color: pollData.textColor }}>
        {pollData.summary}
      </div>
      
      <div className="w-full h-px bg-gray-900 mt-4"></div>

      <div className="text-2xl mt-4" style={{color: pollData.titleColor}}>Candidatos</div>

      <div className="flex flex-col items-center ">
        {Object.keys(pollData.candidates).map((candidateKey, index) => {
          const candidate = pollData.candidates[candidateKey];
          return (
            <div key={index} className="border rounded-lg p-4 m-4 w-64 relative flex flex-col items-center">
            <div className="text-xl" style={{ color: pollData.textColor }}>
            {candidate.name}
            </div>

            <div className="text-lg" style={{ color: pollData.textColor }}>
              <img src={candidate.image} alt={`Imagem de ${candidate.name}`} />
            </div>

            <div className="absolute bottom-1 right-2">  
            <button
              className="rounded-lg p-0.5 font-bold"
                style={{
                  color: pollData.textColor,
                  backgroundColor: pollData.titleColor,
                }}
            >
            <i className={`fa fa-regular fa-heart fa-1x`}></i> Votar
            </button>
            </div>
            </div>
    );
  })}
</div>


  </div>
  );
}

export default Poll;
