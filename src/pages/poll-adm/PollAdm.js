import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/Auth";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase-config';
import QRCode from "qrcode.react";
import generateUniqueId from "../../utils/RandId";
import CopyToClipboard from "react-copy-to-clipboard";
import { RaceBy } from '@uiball/loaders'

function PollAdm() {
  const { user } = useAuth();
  const { id } = useParams();
  const [pollData, setPollData] = useState(null);
  const [password, setPassword] = useState("");
  const [link, setLink] = useState("");
  const [newCandidate, setNewCandidate] = useState("");
  const [newCandidateImg, setNewCandidateImg] = useState(null);
  const [mostVotedList, setMostVotedList] = useState("Nenhum candidato ainda foi votado!");
  const [isLoading, setIsLoading] = useState(false);


  const pollRef = doc(db, 'poll', id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const pollSnapshot = await getDoc(pollRef);
  
        if (pollSnapshot.exists()) {
          const data = pollSnapshot.data();
          setPollData(data);
          setPassword(data.password);
          setLink(window.location.origin + `/poll/${id}`);
  
          // Verifique se o usuário é o autor da pesquisa
          if (user.id !== data.author.id) {
            // Se não for o autor, redirecione para a página inicial com a mensagem de não autorizado
            window.alert("Você não está autorizado a acessar esta pesquisa.");
            navigate("/");
            return;
          }
  
          const candidates = data.candidates;
          const sortedCandidates = Object.keys(candidates).map(candidateName => ({
            name: candidateName,
            votes: candidates[candidateName].votes || 0,
          })).sort((a, b) => b.votes - a.votes);
  
          setMostVotedList(sortedCandidates.map((candidate, index) => `${index + 1} - ${candidate.name} (${candidate.votes} votos)`).join("\n"));
        } else {
          console.error("Votação não encontrada");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados da votação:", error);
      }
    };
  
    // Chame a função para buscar os dados da votação quando o componente for montado
    fetchPollData();
  }, [id, user.id]); // Certifique-se de incluir "id" na lista de dependências para que a consulta seja refeita quando o ID da votação mudar

    
  if (!pollData) {
    // Exibe uma mensagem de carregamento enquanto os dados estão sendo buscados
    return <div>Carregando...</div>;
  }

  const addCandidate = async () => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    const candidateId = generateUniqueId(); // Gere um ID exclusivo para o candidato
    const storageRef = ref(storage, `/candidates/${candidateId}`);
  
    try {
      // Fazer upload da imagem do candidato para o armazenamento.
      await uploadBytes(storageRef, newCandidateImg);
      console.log('Upload da imagem do candidato concluído com sucesso.');
      const imageUrl = await getDownloadURL(storageRef);
  
      // Verifique se o campo 'candidates' já existe no documento
      const pollDoc = await getDoc(pollRef);
      const candidates = pollDoc.data().candidates || {};
  
      // Crie um novo candidato com base nos dados fornecidos
      const newCandidateData = {
        name: newCandidate,
        image: imageUrl,
        votes: 0
      };
  
      // Mesclar o novo candidato com os candidatos existentes
      const updatedCandidates = {
        ...candidates,
        [newCandidate]: newCandidateData
      };
  
      // Use updateDoc para atualizar o documento no Firestore
      await updateDoc(pollRef, {
        candidates: updatedCandidates,
      });
  
      console.log('Candidato adicionado com sucesso.');
      window.alert("Candidato adicionado com sucesso!")
    } catch (error) {
      console.error('Erro ao adicionar candidato:', error);
    }finally {
        setIsLoading(false); // Define isLoading como false após o carregamento ser concluído (com sucesso ou erro)
      }
  };
  

  //----------------------------------------------------------------------------
  const closePoll = async () => {
    const confirmacao = window.confirm("Tem certeza de que deseja encerrar a votação?");
    if (confirmacao) {
      try {
        // 1. Pegue a URL da imagem da capa da pesquisa
        const coverImageUrl = pollData.coverPhoto;
  
        // 4. Recupere os candidatos da pesquisa
        const candidates = pollData.candidates;
  
        // 5. Ordene os candidatos com base no número de votos (decrescente)
        const sortedCandidates = Object.keys(candidates).map(candidateName => ({
          name: candidateName,
          votes: candidates[candidateName].votes || 0,
        })).sort((a, b) => b.votes - a.votes);
 
        // 4. Exclua a imagem da capa da pesquisa
        const coverImageRef = ref(storage, coverImageUrl);
        await deleteObject(coverImageRef);
  
        // 5. Exclua as imagens dos candidatos
     // Certifique-se de que candidates esteja definido ou seja um objeto vazio, se não houver candidatos.
        for (const candidateKey of Object.keys(candidates)) {
           const candidate = candidates[candidateKey];
           const candidateImageRef = ref(storage, candidate.image);
           await deleteObject(candidateImageRef); 
        }
  
        // 6. Exclua a pesquisa
        await deleteDoc(pollRef);

  
        // 7. Redirecione para a página inicial com a mensagem de "Votação encerrada com sucesso"
        window.alert("Votação encerrada com sucesso e RESULTADO copiado para área de transferência!");
        window.location.href = `/`;
      } catch (error) {
        console.error("Erro ao encerrar a votação:", error);
      }
    }
  };  
  
  
  
  //-----------------------------------------------------------------------------

  return  (
    <div className="flex flex-col items-center bg-global-gradient h-screen p-8 text-white text-sm">
      {isLoading ? (
        <RaceBy size={75} color="#993399" />
      ) : (
      <div>
      {/* Primeira Parte */}
      <div>
        <h1 className="text-title text-3xl">{pollData.name}</h1>
        <p>Data prevista de término: {pollData.endDate}</p>
        <p>Autor: {pollData.author.name}</p>
      </div>
      <div className="w-full h-px bg-title mt-8"></div>

      {/* Resultado Momentâneo */}
      <div>
        <h2 className="text-title text-xl">Resultado Momentâneo</h2>
        {/*
        TODO
        */}
        <p>{mostVotedList}</p>
      </div>

      {/* Botão Encerrar Votação */}
      <div className="mt-4">
        <CopyToClipboard text={mostVotedList}>
          <button
            className="bg-red-500 text-white px-4  hover:bg-red-700 p-0.5 rounded-lg"
            onClick={closePoll}
          >
            Encerrar Votação
          </button>
        </CopyToClipboard>

      </div>
      <div className="w-full h-px bg-title mt-8"></div>

      {/* ----------------------------------------------------------------------*/}
       <div>
       <h1 className="text-title text-xl">Chame os participantes</h1>
        <div>
          <p>Link da Pesquisa: {link}</p>
          <p>Senha da Pesquisa: {password}</p>
        </div>
      {/* Renderize o QR Code com o link e senha no corpo */}
        <div className="mt-4">
            <QRCode value={`poll/${id}?senha=${password}`} />
          </div>
        </div>

    <div className="w-full h-px bg-title mt-8"></div>
    {/*--------------------------------------------------------------------------------*/}
      {/* Inserir Candidatos */}
      <div>
        <h2>Inserir Candidatos</h2>
        <div>
          <input
            type="text"
            className="form-control rounded-md bg-slate-900 border-2"
            placeholder="Nome do Candidato"
            value={newCandidate}
            onChange={(e) => setNewCandidate(e.target.value)}
          />
          <p className="text-sm mt-4">Faça upload de uma foto.</p>
          <input
            type="file"
            className="form-control-file btn btn-primary rounded-md bg-slate-900"
            onChange={(e) => setNewCandidateImg(e.target.files[0])}
          />
        </div>

        <button 
            onClick={addCandidate}
            className="btn btn-primary rounded-md bg-navbg2  hover:bg-titlechange p-0.5 mt-6"
          >Adicionar Candidato</button>

      </div>
    </div>
      )}
    </div>
  )}

export default PollAdm;
