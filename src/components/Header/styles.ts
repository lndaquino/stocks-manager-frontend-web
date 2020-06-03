import styled from 'styled-components';

interface ContainerProps {
  size?: 'small' | 'large';
}

export const Container = styled.div<ContainerProps>`
  background: #048998;
  padding: 30px 0;

  header {
    width: 1120px;
    margin: 0 auto;
    padding: ${({ size }) => (size === 'small' ? '0 20px ' : '0 20px 150px')};
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'Montserrat', sans-serif;

    div {
      display: flex;
      align-items: center;
      color: #fff;

      h1 {
        font-size: 48px;
        font-weight: 900;
        margin-right: 12px;
      }

      span {
        font-size: 32px;
        font-weight: 500;
      }
    }

    nav {
      display: flex;
      align-items: center;
      font-weight: 500;

      button {
        background: none;
        border: 0;
        color: #fff;
        text-decoration: none;
        font-size: 16px;
        font-weight: 500;
      }

      a {
        color: #fff;
        text-decoration: none;
        font-size: 16px;
        transition: opacity 0.2s;
        padding: 0 0 10px 0;

        & + a {
          margin-left: 36px;
        }

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
`;
