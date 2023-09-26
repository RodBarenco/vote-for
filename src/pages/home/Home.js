import React from 'react';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-20 text-title"> {/* Adicione p-10 para o espaçamento */}
      {/* Divisão 1: Criar uma votação */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold">Crie facilmente uma votação online!</h1>
        <p className="text-lg mt-4 font-medium">
          Você poderá:
        </p>
        <div className='border-2'>
          <ul className="list-disc ml-8">
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
        <h1 className="text-3xl font-semibold">Participe de uma votação online!</h1>
        <p className="text-lg mt-4 font-medium">
          Você poderá:
        </p>
        <div className='border-2'>
          <ul className="list-disc ml-8">
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
