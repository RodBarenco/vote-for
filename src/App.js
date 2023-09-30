import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth, AuthProvider} from './auth/Auth'; 

import Nav from './components/Nav';
import Footer from './components/Footer';

import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Admin from './pages/admin/Admin';
import VoteFor from './pages/vote-for/VoteFor';
import Poll from './pages/poll/Poll';
import PollAdm from './pages/poll-adm/PollAdm';
import MyPolls from './pages/my-polls/MyPolls';
import VotingPolls from './pages/voting-polls/VotingPolls';

function App() {
  const { user } = useAuth(); // Use o hook useAuth para acessar o estado do usuário

  useEffect(() => {
    // Faça o que precisar com o estado do usuário aqui
  }, [user]);

  return (
    <Router>
      <Nav/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element = {<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/vote-for" element={<VoteFor />} />
        {user == null ? (
          <Route path="/my-polls" element={<Login />} />
        ) : (
          <Route path="/my-polls" element={<MyPolls />} />
        )}
         {user == null ? (
          <Route path="/voting-polls" element={<Login />} />
        ) : (
          <Route path="/voting-polls" element={<VotingPolls />} />
        )}
        {user == null ? (
          <Route path="/poll-admin/:id" element={<Login />} />
        ) : (
          <Route path="/poll-admin/:id" element={<PollAdm />} />
        )}
        {user == null ? (
          <Route path="/poll/:id" element={<Login />} />
        ) : (
          <Route path="/poll/:id" element={<Poll />} />
        )}
      </Routes>
      <Footer/>
    </Router>
  );
}

const AppWithAuthProvider = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuthProvider;
