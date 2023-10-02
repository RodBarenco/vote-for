import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/Auth";
import { useParams, useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase-config';
import QRCode from "qrcode.react";
import generateUniqueId from "../../utils/RandId";
import CopyToClipboard from "react-copy-to-clipboard";
import { RaceBy } from '@uiball/loaders';
import { toBlob } from 'html-to-image';

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
            // Se não for o autor, redireciona para a página inicial com a mensagem de não autorizado
            window.alert("Você não está autorizado a acessar esta pesquisa.");
            navigate("/");
            return;
          }
  
          const candidates = data.candidates;
          const sortedCandidates = Object.keys(candidates).map(candidateId => ({
            name: candidates[candidateId].name,
            votes: candidates[candidateId].votes || 0,
          })).sort((a, b) => b.votes - a.votes);
  
          setMostVotedList(sortedCandidates.map((candidate, index) => `${index + 1} - ${candidate.name} (${candidate.votes} votos)`).join("\n"));
        } else {
          console.error("Votação não encontrada");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados da votação:", error);
      }
    };
  
    fetchPollData();
  }, [id, user.id]); 

  if (!pollData) {
    // Exibe uma mensagem de carregamento enquanto os dados estão sendo buscados
    return <div>Carregando...</div>;
  }

  const addCandidate = async () => {

    //VALIDATIONS
        // Validação do nome da votação
        const insertRegex = /^[a-zA-Z0-9\s?!.@,:áàãâéêíóôõúüçÁÀÃÂÉÊÍÓÔÕÚÜÇ]+$/u;


        if (newCandidate.length === 0 || newCandidate.length > 55 || !insertRegex.test(newCandidate)) {
          alert('O nome do candidato deve ter entre 1 e 55 caracteres e conter apenas caracteres válidos.');
          return;
        }


        // Verifica se o arquivo tem uma extensão de imagem válida (por exemplo, .jpg, .jpeg, .png, .gif)
        const allowedExtensions = /\.(jpg|jpeg|png|gif|svg)$/i; // Extensões de imagem permitidas
        if (!allowedExtensions.test(newCandidateImg.name)) {
          alert('A foto deve ter extensão .jpg, .jpeg, .png, .svg ou .gif.');
        return;
        }

        const maxSizeInBytes = 5 * 1024 * 1024; // 5 megabytes

        if (newCandidateImg.size > maxSizeInBytes) {
          alert('A foto deve ter menos de 5 megabytes.');
        return;
        }
    //--------------

    setIsLoading(true);
    window.scrollTo(0, 0);
    const candidateId = generateUniqueId(); // Gera um ID exclusivo para o candidato
    const storageRef = ref(storage, `/candidates/${candidateId}`);
  
    try {
      // Faz upload da imagem do candidato para o armazenamento.
      await uploadBytes(storageRef, newCandidateImg);
      console.log('Upload da imagem do candidato concluído com sucesso.');
      const imageUrl = await getDownloadURL(storageRef);
  
      // Verifica se o campo 'candidates' já existe no documento
      const pollDoc = await getDoc(pollRef);
      const candidates = pollDoc.data().candidates || {};
  
      const candidateId = generateUniqueId()
      const newCandidateData = {
        id: candidateId,
        name: newCandidate,
        image: imageUrl,
        votes: 0
      };
  
      const updatedCandidates = {
        ...candidates,
        [candidateId]: newCandidateData
      };
  
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
        // 1. Pega a URL da imagem da capa da pesquisa
        const coverImageUrl = pollData.coverPhoto;
  
        // 2. Recupera os candidatos da pesquisa
        const candidates = pollData.candidates;
  
        // 3. Ordena os candidatos com base no número de votos (decrescente)
        const sortedCandidates = Object.keys(candidates).map(candidateName => ({
          name: candidateName,
          votes: candidates[candidateName].votes || 0,
        })).sort((a, b) => b.votes - a.votes);
 
        // 4. Exclui a imagem da capa da pesquisa
        const coverImageRef = ref(storage, coverImageUrl);
        await deleteObject(coverImageRef);
  
        // 5. Exclui as imagens dos candidatos
        for (const candidateKey of Object.keys(candidates)) {
           const candidate = candidates[candidateKey];
           const candidateImageRef = ref(storage, candidate.image);
           await deleteObject(candidateImageRef); 
        }
  
        // 6. Exclui a pesquisa
        await deleteDoc(pollRef);

  
        // 7. Redireciona para a página inicial com a mensagem de "Votação encerrada com sucesso"
        window.alert("Votação encerrada com sucesso e RESULTADO copiado para área de transferência!");
        window.location.href = `/`;
      } catch (error) {
        console.error("Erro ao encerrar a votação:", error);
      }
    }
  };  

  //---------------------- copy qrcode
  
  const handleCopyImage = () => {
    const qrCodeContainer = document.querySelector('.qr-code-container'); // Substitua pela classe correta

    if (!qrCodeContainer) {
      alert('QR Code não encontrado.');
      return;
    }

    toBlob(qrCodeContainer)
      .then((blob) => {
        const item = new ClipboardItem({ 'image/png': blob });

        navigator.clipboard.write([item]).then(
          () => {
            alert('Imagem do QR Code copiada com sucesso!');
          },
          (err) => {
            console.error('Erro ao copiar a imagem do QR Code: ', err);
          }
        );
      })
      .catch((error) => {
        console.error('Erro ao gerar a imagem do QR Code: ', error);
      });
  };
  
    
  //-----------------------------------------------------------------------------

  return  (
    <div className="flex flex-col items-center bg-global-gradient min-h-screen text-white text-sm">
      {isLoading ? (
        <RaceBy size={75} color="#993399" />
      ) : (

      <div>
       
       <div className="sticky top-0 w-full z-10">
        <div className="imgWrapper w-8 h-8 mt-4" onClick={() => navigate("/")}>
         <img
           src="/polls.jpeg"
           alt="Home"
           className="h-8 border-2 rounded-md cursor-pointer"
         />
        </div>
       </div>

      {/* Primeira Parte */}
      <div  className="mt-4 p-10 mb-6">
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
      <div className="font-medium">
       <p>Link da Pesquisa: {link}</p>
       <p>Senha da Pesquisa: {password}</p>
      </div>
      {/* Renderize o QR Code com o link e senha no corpo */}
      <div className="mt-4 qr-code-container border-2 w-40 h-40 p-3">
       <div>
         <QRCode value={`${link}?passforvote=${password}`} />
       </div>
      </div>

      </div>

    {/* Botões para copiar o texto do link e senha e copiar a imagem do QR Code */}
    <div className="flex flex-row space-x-4 font-semibold">

    <div className="mt-4">
       <button
         className="btn btn-primary rounded-md bg-navbg2 hover:bg-titlechange p-0.5"
         onClick={handleCopyImage}
       >
         Copiar Imagem do QR Code
       </button>
    </div>

    <div className="mt-4">
      <CopyToClipboard
        text={`Link da Pesquisa: ${link}\nSenha da Pesquisa: ${password}`}
        onCopy={() => alert("Texto copiado!")}
      >
      <button
        className="btn btn-primary rounded-md bg-navbg2 hover:bg-titlechange p-0.5"
      >
        Copiar Link e Senha
      </button>
      </CopyToClipboard>
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
    </div>
      )}
    </div>
  )}

export default PollAdm;
