import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const Content = styled.div`
  width: 520px;
  margin: auto auto;
  background: #fff;
  border-radius: 2em;

  form {
    max-width: 360px;
    margin: 0 auto;
    padding: 12px 0;

    h1 {
      font-size: 18px;
      color: #363f5f;
      margin-bottom: 16px;
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
