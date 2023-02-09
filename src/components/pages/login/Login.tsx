import React from 'react';
import { LoginForm } from 'components/molecules/forms/';
import './login.scss';
import useTitle from 'hooks/useTitle';

const LoginPage: React.FC = () => {
  useTitle('Login');
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
