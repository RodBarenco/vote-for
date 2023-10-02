import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from "../../auth/Auth";
import  'font-awesome/css/font-awesome.min.css';

function Poll() {
  const { id } = useParams();
  const [pollData, setPollData] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const passforvote = searchParams.get('passforvote');

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

      fetchPollData();
    }, [id]); 

    if (!pollData) {
      // Exibe uma mensagem de carregamento enquanto os dados estão sendo buscados
      return <div className="bg-global-gradient h-screen text-white">Carregando...</div>;
    }
    

    const participants = pollData.participants || {};
    const addParticipant = async (pollId, participantId, participantName) => {
      try {
        const pollRef = doc(db, 'poll', pollId);
        const pollDoc = await getDoc(pollRef);
    
        if (pollDoc.exists()) {
    
          if (!participants[participantId]) {
           
            const newParticipantData = {
              id: participantId,
              name: participantName,
              votedfor: null // O campo voted-for começa como nulo
            };
    
            // Mesclar o novo participante com os participantes existentes
            const updatedParticipants = {
              ...participants,
              [participantId]: newParticipantData
            };
    
            await updateDoc(pollRef, { participants: updatedParticipants });
    
            console.log('Participante adicionado com sucesso à votação.');
          } else {
            console.log('Participante já foi adicionado anteriormente.');
          }
        } else {
          console.error('Votação não encontrada.');
        }
      } catch (error) {
        console.error('Erro ao adicionar o participante à votação:', error);
      }
    };

  //-----------------------------------------------------CONTROL ACSS -----------------------      
    console.log(passforvote)
    if (passforvote === pollData.password) {
      addParticipant(id, user.id, user.displayName);
    } else {
      alert('Erro 401: Não está autorizado. Senha incorreta para acessar essa votação.');
      navigate("/");
    }


  //----------------------------------------------------------------------------------------

  const voteFor = async (candidateId) => {

    const pollId = id;
    const participantId = user.id;
    try {
      const pollRef = doc(db, 'poll', pollId);
      const pollDoc = await getDoc(pollRef);
  
      if (pollDoc.exists()) {
        const pollData = pollDoc.data();
        const participants = pollData.participants || {};
        const candidates = pollData.candidates || {};
  
        if (participants[participantId] && participants[participantId].votedfor) {
          const previousCandidateId = participants[participantId].votedfor;
  
          if (candidates[previousCandidateId]) {
            candidates[previousCandidateId].votes--;
          }
        }
  
        if (candidates[candidateId]) {
          candidates[candidateId].votes++;
        }
  
        participants[participantId].votedfor = candidateId;
  
        await updateDoc(pollRef, { participants, candidates });
  
        console.log('Voto computado com sucesso.');
        window.alert('Voto computado com sucesso. Aguerde o autor divulgar o resultado!')
        navigate("/");
      } else {
        console.error('Votação não encontrada.');
        window.alert('Votação não encontrada.')
      }
    } catch (error) {
      console.error('Erro ao computar o voto:', error);
      window.alert('Erro ao computar o voto.')
    }
  };

//---------------------------------------------------------------------------------------  

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
        <div className="imgWrapper w-8 h-8 mt-4" onClick={() => navigate("/")}>
         <img
           src="/polls.jpeg"
           alt="Home"
           className="h-8 border-2 rounded-md cursor-pointer"
        />
       </div>
      </div>

       {/* Title name and summary*------------------------------------------------*/}
      <div className="text-3xl font-semibold mt-4 w-4/5 flex flex-col items-center " style={{ color: pollData.titleColor }}>
        {pollData.name}
      </div>
      <div className="text-lg font-medium w-4/5 flex flex-col items-center " style={{ color: pollData.textColor }}>
        {pollData.summary}
      </div>

      <div className="text-xs mt-8 w-4/5" style={{ color: pollData.textColor }}> Ao escolher um candidato você será redireionado a página inicial. Caso volte a essa página,
      lembre-se, se escolher outro candidato, seu voto no candidato anterior será eliminado.</div>
      <div className="w-full h-px bg-gray-900 mt-4" style={{ color: pollData.textColor }}></div>
      {/*------------------------------------------------------------------------------------*/}

      <div className="text-2xl mt-2 font-medium" style={{color: pollData.titleColor}}>Candidatos</div>

      <div className="flex flex-col items-center ">
        {Object.keys(pollData.candidates).map((candidateKey, index) => {
          const candidate = pollData.candidates[candidateKey];
          const participant = participants[user.id]
          return (
            <div 
            key={index} 
            className="p-4 m-4 w-64 relative flex flex-col items-center"
            style={{
              borderColor: pollData.textColor,
              borderWidth: "3px",
              borderRadius: "6px",
            }}
            >
            <div key={index} style={{
              borderColor: participant.votedfor === candidate.id ? pollData.titleColor : 'transparent',
              borderWidth: participant.votedfor === candidate.id ? '2px' : '0',
              borderRadius: participant.votedfor === candidate.id ? '4px' : '0',
            }}>
              <div className="text-xl font-medium ml-1" style={{ color: pollData.textColor }}>
                {candidate.name}
              </div>

              <div className="text-lg" style={{ color: pollData.textColor }}>
                <img src={candidate.image} alt={`Imagem de ${candidate.name}`} />
              </div>

              <div className="absolute bottom-1 right-2">  
                <button
                  className="rounded-lg p-0.5 font-bold"
                  onClick={() => {
                  voteFor(candidate.id);
                  }}
                  style={{
                    color: pollData.textColor,
                    backgroundColor: pollData.titleColor,
                    transform: 'scale(1)',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.10)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }} 
              >
                <i className={`fa fa-regular fa-heart fa-1x`}></i> Votar
              </button>
            </div>
            </div>
      </div>
    );
  })}
</div>


  </div>
  );
}

export default Poll;
