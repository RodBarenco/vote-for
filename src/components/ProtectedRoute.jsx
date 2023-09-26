import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/Auth';

function ProtectedRoute({ element, ...rest }) {
  const { user } = useAuth();

  if (user) {
    return <Route {...rest} element={element} />;
  } else {
    // Se o usuário não estiver autenticado, redirecione para a página de login
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
