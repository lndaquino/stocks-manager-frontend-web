import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

import signUpBackgroundImg from '../../assets/sign-up-background.jpg';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
  background: url(${signUpBackgroundImg}) no-repeat center;
  background-size: auto;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto auto;
  width: 100%;
  max-width: 700px;
  background: rgba(4, 137, 152, 0.8);
  height: 90%;
  border-radius: 2em;
`;

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(150px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ff872c;
  opacity: 1;

  animation: ${appearFromRight} 1s;

  form {
    margin: 40px 0;
    text-align: center;
    width: 440px;

    h1 {
      color: #fff;
      font-weight: 400;
      margin-bottom: 12px;
    }

    a {
      text-decoration: none;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  a {
    text-decoration: none;
    color: #fff;
    font-size: 18px;
    font-weight: 700;

    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }

    svg {
      margin-right: 8px;
    }
  }
`;

export const Button = styled.button`
  display: block;
  height: 58px;
  width: 100%;
  margin: 8px 0;
  background: #ff872c;
  color: #fff;
  font-weight: 500;
  font-size: 20px;
  border-radius: 2em;
  padding: 10px 30px;
  border: 0;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#ff872c')};
  }
`;
