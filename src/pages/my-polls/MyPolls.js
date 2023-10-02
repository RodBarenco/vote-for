import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from "../../auth/Auth";
import { useNavigate } from 'react-router-dom';

function MyPolls() {
  const { user } = useAuth();
  const [userPolls, setUserPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPolls = async () => {
      try {
        const pollsRef = collection(db, 'poll');
        const q = query(pollsRef, where('author.id', '==', user.id));
        const querySnapshot = await getDocs(q);
        const userPollsData = [];

        console.log("User ID:", user.id);
        
        querySnapshot.forEach((doc) => {
          const pollData = doc.data();
          
          if (pollData.author.id === user.id) {
            userPollsData.push({
              id: doc.id,
              name: pollData.name,
              startDate: pollData.startDate,
              endDate: pollData.endDate,
              summary: pollData.summary,
            });
          }
        });

        setUserPolls(userPollsData);
      } catch (error) {
        console.error('Error fetching user polls:', error);
      }
    };

    fetchUserPolls();
  }, [user.id]);

  const handleManageClick = (pollId) => {
    navigate(`/poll-admin/${pollId}`);
  };

  return (
    <div className="bg-global-gradient flex flex-col items-center h-screen p-8 text-white text-sm border-2 overflow-x-hidden">
      <div className="sticky top-0 w-full pl-6 z-10">
        <div className="imgWrapper w-8 h-8 mt-4" onClick={() => navigate("/")}>
         <img
           src="/polls.jpeg"
           alt="Home"
           className="h-8 border-2 rounded-md cursor-pointer"
        />
       </div>
      </div>

      <h1 className="text-title font-semibold text-3xl">Minhas votações</h1>
      {userPolls.map((poll) => (
        <div key={poll.id} className="bg-slate-950 text-white p-4 m-4 rounded-xl border-2 w-4/5">
          <h2 className="font-semibold text-title text-2xl">{poll.name}</h2>
          <p className="font-semibold">Sumário:</p> <p className=" bg-black p-1 rounded-md">{poll.summary}</p>

          <p className="font-semibold">Início:</p> <p className=" bg-black p-1 rounded-md">{poll.startDate}</p>
          <p className="font-semibold">Previsão de término:</p> <p className="text-red-900 font-bold bg-black p-1 rounded-md">{poll.endDate}</p>
          <button
            className="btn btn-primary mt-4 rounded-md bg-navbg2  hover:bg-titlechange p-0.5"
            onClick={() => handleManageClick(poll.id)}
          >
            Manage
          </button>
        </div>
      ))}
    </div>
  );
}

export default MyPolls;
