import React from 'react';
import { Link } from "react-router-dom";

function Home() {

  return (
    <div className="flex flex-col items-center justify-center h-screen p-8 text-title bg-global-gradient border-2">
       
      {/* Divisão 1: Criar uma votação */}
      <div className="mb-8 text-center">
      <Link to='/admin'><h1 className="text-3xl font-semibold text-title hover:text-titlechange">Crie facilmente uma votação online!</h1></Link>
        <p className="text-lg mt-4 font-medium">
          Você poderá:
        </p>
        <div className='border-2 rounded-xl'>
          <ul className="list-disc ml-8 text-white">
            <li>Criar uma votação</li>
            <li>Editar as cores e aparência da página de votação</li>
            <li>Escolher a data do começo e do término dessa votação</li>
            <li>Enviar o link ou QR code para seus amigos</li>
            <li>Disponibilizar o resultado para que todos possam ver</li>
          </ul>
        </div>
        <p className="text-lg mt-4">É rápido, é simples, comece agora!</p>
      </div>

      {/* Divisão 2: Participar de uma votação */}
      <div className="text-center">
       <Link to='/vote-for'><h1 className="text-3xl font-semibold hover:text-titlechange">Participe de uma votação online!</h1></Link>
        <p className="text-lg mt-4 font-medium">
          Você poderá:
        </p>
        <div className='border-2 rounded-xl'>
          <ul className="list-disc ml-8 text-white">
            <li>Usar o link que recebeu para participar de uma votação</li>
            <li>Escolher uma das cards disponíveis para seu voto</li>
            <li>Registrar sua opinião! E isso agora é muito mais fácil</li>
          </ul>
          </div>
        <p className="text-lg mt-4">Não perca essa chance!</p>
      
      </div>
    </div>
  );
}

export default Home;
