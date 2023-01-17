import React from 'react';
import { LoginForm } from 'components/molecules/forms/';
import './login.scss';

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
