import React, { useState, useEffect } from "react";
import Preview from "../../components/Previwe";
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import {  ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase-config';
import { useAuth } from "../../auth/Auth"; 
import GenerateRandomPassword from "../../utils/RandPass";
import generateUniqueId from "../../utils/RandId";
import { useNavigate } from "react-router-dom";
import { RaceBy } from "@uiball/loaders";


function Admin() {
  const [newPollName, setNewPollName] = useState("");
  const [newPollSummary, setNewPollSummary] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [titleColor, setTitleColor] = useState("#6363ff"); // Cor do título
  const [textColor, setTextColor] = useState("#ffffff");   // Cor do texto comum
  const [bgColor, setBgColor] = useState("#000000");       // Cor do background
  const [coverPhoto, setCoverPhoto] = useState(null); 
  const { user, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);     

  useEffect(() => {

  }, [titleColor, textColor, bgColor, coverPhoto]);

  // handle new poll --------------------------------------------------------------//
  const navigate = useNavigate();

  const postsCollectionRef = collection(db, 'poll');
  const coverPhotId = generateUniqueId(); 
  const storageRef = ref(storage, `/img/${coverPhotId}`);

  const handleCreatePoll = async () => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    let imageUrl = null;
    if (!user) {
      signInWithGoogle();
      return;     
    } else {
      try {
        await uploadBytes(storageRef, coverPhoto);
        console.log('Upload concluído com sucesso.');
        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error('Erro no upload: coverPhoto', error);
      }
    }

    const poll = ({
      author: {
        id: user.id,
        name: user.displayName
      },
      participants: {},
      candidates: {},
      name: newPollName,
      summary: newPollSummary,
      startDate: startDate,
      endDate: endDate,
      titleColor: titleColor,
      textColor: textColor,
      bgColor: bgColor,
      coverPhoto: imageUrl,
      password: GenerateRandomPassword()
    })
    const docRef = await addDoc(postsCollectionRef, poll);
    console.log("Publicação feita ccom sucesso!")
    setIsLoading(false);
    

    navigate(`/poll-admin/${docRef.id}`);
  };

  //--------------------------------------------------------------------------------------

  return (
    <div className="flex flex-col items-center h-auto p-8 bg-global-gradient text-white text-sm border-2 overflow-x-hidden">
       {isLoading ? (
        <div className="h-screen justify-center">
          <RaceBy size={95} color="#993399" />
        </div>
      ) : (
      <div>
      <div className="text-title text-center text-2xl">Página de criação</div>
      <div className="container mt-8 p-6 rounded-xl flex flex-col items-center">
      <div className="text-xs"> OBS: Você está na página de criação de votações, preencha os dados com atenção. Todas as informações 
      da votação serão deletadas após a data de término, tenha isso em mente na hora de criar a mesma. A página para administrar a 
      votação criada só poderá ser acessada através de um login via sua conta Google, os votos dos participantes também dependem disso.
      </div>
  {/*--------------------------------------------------------------------------------------------------------------------------*/}
        <div className="w-full h-px bg-title mt-4"></div>
        <div className="text-title text-3xl mb-4 mt-4"> 1 - INFORMAÇÕES BÁSICAS</div>  
        <div className="w-full  flex-col space-x-4 mt-4">      

        <div className="form-group space-x-2 mt-4 flex flex-row items-center w-full">
          <label htmlFor="newPollName">Nome da Nova Votação:</label>
          <input
            type="text"
            className="form-control rounded-md bg-slate-900 border-2 w-5/12"
            id="newPollName"
            value={newPollName}
            onChange={(e) => setNewPollName(e.target.value)}
          />
        </div>
        
        <div className="text-xs mt-12">Atenção para escolher as datas corretamente, a sugestão é escolher sempre um dia após o término esperado.</div>
        <div className="w-full flex flex-row items-center mt-6">
          <div className="form-group space-x-2">
            <label htmlFor="startDate">Data de Início:</label>
            <input
              type="date"
              className="form-control rounded-md bg-slate-900 border-2"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group space-x-2">
            <label htmlFor="endDate">Data de Término:</label>
            <input
              type="date"
              className="form-control rounded-md bg-slate-900 border-2"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          </div>
        </div>
        
        <div className="text-xs mt-16">O nome da votação irá aparecer como o título da nova página que será criada</div>
        {/*--------------------------------------------------------------------------------------------------------------------------*/}
        <div className="w-full h-px bg-title mt-4"></div>
        <div className="text-title text-3xl mb-4 mt-4"> 2 - BREVE RESUMO</div>  
        <div className="form-group space-x-2 mt-4 flex flex-col items-center w-11/12">
          <label htmlFor="newPollSummary">Pequeno Resumo (até 250 caracteres):</label>
          <textarea
            className="form-control rounded-md bg-slate-900 border-2 w-full"
            id="newPollSummary"
            rows="4"
            value={newPollSummary}
            onChange={(e) => setNewPollSummary(e.target.value)}
          ></textarea>
        </div>

        <div className="text-xs mt-16">Logo abaixo teremos um breve resumo que explicará aos participantes um pouco sobre
        o que se espera alcançar com determinada votação.</div>
        {/* --------------------------------------------------------------------------------------------------------------------------- */}
        <div className="w-full h-px bg-title mt-4"></div>
        <div className="text-title text-3xl mb-4 mt-4"> 3 - APARÊNCIA</div> 
        <div className="flex flex-row items-center space-x-2 mt-4">

        <div className="form-group space-x-2">
          <label htmlFor="titleColor">Cor das Letras de Título:</label>
          <input
            type="color"
            className="form-control rounded-md"
            id="titleColor"
            value={titleColor}
            onChange={(e) => setTitleColor(e.target.value)}
          />
        </div>

        <div className="form-group space-x-2">
          <label htmlFor="textColor">Cor do Texto Comum:</label>
          <input
            type="color"
            className="form-control rounded-md"
            id="textColor"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </div>

        <div className="form-group space-x-2">
          <label htmlFor="bgColor">Cor do Background:</label>
          <input
            type="color"
            className="form-control rounded-md"
            id="bgColor"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </div>

        </div>
        
        <div className="text-xs mt-16">A aparência básica da página não poderá ser alteráda após sua criação, ela será 
        composta pelas cores que você escolher aqui. Também disponibilizamos temas pré-selecionáveis como Halloween, Carnaval, 
        Praiano, Estudantil, e Político.</div>
        {/* --------------------------------------------------------------------------------------------------------------------------- */}
        <div className="w-full h-px bg-title mt-4"></div>
        <div className="text-title text-3xl mb-4 mt-4"> 4 - CAPA TEMÁTICA!</div> 
        <div className="flex flex-row items-center space-x-2">
        <div className="form-group space-x-2">
          <label htmlFor="coverPhoto">Enviar Foto de Capa:</label>
          <input
            type="file"
            className="form-control-file btn btn-primary mt-4 rounded-md bg-slate-900"
            id="coverPhoto"
            onChange={(e) => setCoverPhoto(e.target.files[0])}
          />
        </div>
      </div>
      
      <div className="text-xs mt-16">Aqui você pode escolher uma capa temática ou uma das pré selecionáveis, 
      ela ficará ao topo da página de votação.</div>
    {/* --------------------------------------------------------------------------------------------------------------------------- */}
    <div className="w-full h-px bg-title mt-4"></div>
    <div className="text-title text-3xl mb-4 mt-4"> 5 - PREVIEW E CRIAR!</div>
      <div className="flex flex-col items-center space-x-2 w-8/12">
        <div className="form-group space-x-2">
        <div className="border-2 rounded-lg">
          <Preview 
            newPollName={newPollName} 
            newPollSummary={newPollSummary} 
            titleColor={titleColor} 
            textColor={textColor} 
            bgColor={bgColor} 
            coverPhoto={coverPhoto} />
        </div>

        </div>


        <button className="btn btn-primary mt-4 rounded-md bg-navbg2  hover:bg-titlechange p-0.5" onClick={handleCreatePoll}>
          Criar Votação
        </button>
      </div>

      <div className="text-xs mt-16">Visualize com ateção os dados que você preencheu antes de criar sua nova votação.
      Após clicar em criar você será direcionado para página de administração da mesma onde poderá fazer upload dos
      arquivos de imagem em que os participantes poderão votar, você também poderá visualizar o número de votos
      que cada imagem recebeu, e destacadamente as trÊs primeiras colocações. Você também poderá gerar um QR code para convite de 
      participantes, além de um link e uma senha de acesso para quem for ingressar na votação dessa maneira.</div>

      </div>
      </div>
        )}
    </div>
    )}

export default Admin;
