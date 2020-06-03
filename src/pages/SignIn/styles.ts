import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

import signInBackgroundImg from '../../assets/sign-in-background.jpg';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  background: #048998;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 700px;
`;

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-150px);
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

  animation: ${appearFromLeft} 1s;

  form {
    margin: 80px 0;
    text-align: center;
    width: 340px;

    h1 {
      color: #fff;
      font-weight: 400;
      margin-bottom: 12px;
    }

    .forgotPassword {
      color: #fff;
      border: none;
      background: none;
      font-weight: 400;
      font-size: 14px;

      transition: opacity 0.2s;

      &:hover {
        opacity: 0.7;
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

export const Background = styled.div`
  flex: 1;
  background: url(${signInBackgroundImg}) no-repeat center;
  background-size: cover;
  color: #191d2b;
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

export const AnimatedTextContainer = styled.div`
  background-color: rgba(220, 220, 220, 0.5);
  margin: 0 auto;
  width: 90%;
  align-items: center;
  border-radius: 2em;

  animation: ${appearFromRight} 1s;

  h1 {
    margin-top: 20px;
    text-align: center;
    font-size: 32px;
  }

  p {
    margin-top: 20px;
    text-align: center;
    font-size: 24px;
  }
`;
