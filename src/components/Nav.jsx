import { useAuth } from '../auth/Auth'; // Importe o hook useAuth
import { Link } from 'react-router-dom';
import  'font-awesome/css/font-awesome.min.css';

const Nav = () => {
    const { user, logout } = useAuth(); // Use o hook useAuth para acessar o estado do usuário e a função de logout
  
    const handleLogout = () => {
      // Realize o logout aqui
      logout();
      // Lógica adicional de logout, se necessário
    };
  
    return (
      <nav className="text-white flex justify-end" style={{ background: 'rgb(0,5,24)', background: '-moz-linear-gradient(167deg, rgba(0,5,24,1) 0%, rgba(13,12,12,1) 100%)', background: '-webkit-linear-gradient(167deg, rgba(0,5,24,1) 0%, rgba(13,12,12,1) 100%)', background: 'linear-gradient(167deg, rgba(0,5,24,1) 0%, rgba(13,12,12,1) 100%)', filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#000518",endColorstr="#0d0c0c",GradientType=1)' }}>
        <ul>
          <li>
            {user ? (
              <div className="flex items-center space-x-2 mr-10 p-0.5">
                  <span className='text-white'>{user.displayName}: </span>
                  <Link to="/my-polls" className='bg-navbg2 rounded-md'>Minhas Votações</Link>
                  <Link to="/voting-polls" className='bg-navbg2 rounded-md'>Votações que Participo</Link>
                  <button onClick={handleLogout} className='bg-navbg2 rounded-md'>Sair</button>
              </div>

            ) : (
              <div className="flex items-center space-x-2 mr-10 p-1">
                <Link to="/login">
                  Entrar  <i className={`fa fa-solid fa-sign-in fa-1x`}></i>
                </Link>
              </div>
            )}
          </li>
        </ul>
      </nav>
    );
  };
  
  export default Nav;
