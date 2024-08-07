import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = () => {
      localStorage.removeItem('accessToken');
    
      Swal.fire({
        title: 'Logged out successfully!',
        icon: 'success',
      });
      navigate('/login');
    };

    logoutUser();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
