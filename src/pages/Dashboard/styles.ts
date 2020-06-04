import styled from 'styled-components';

interface CardProps {
  wallet?: boolean;
}

export const Container = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const Title = styled.h1`
  font-size: 48px;
  color: #3a3a3a;
`;

export const CardContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 32px;
  margin-top: -150px;
`;

export const AddCard = styled.div`
  background: ${({ wallet }: CardProps): string =>
    wallet ? '#FF872C' : '#fff'};
  padding: 22px 32px;
  border-radius: 5px;
  color: ${({ wallet }: CardProps): string => (wallet ? '#fff' : '#363F5F')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;

  p {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 14px;
  }

  :hover {
    transform: translateX(-10px);

    svg {
      opacity: 0.7;
    }

    p {
      opacity: 0.7;
    }
  }
`;

export const Card = styled.div`
  background: ${({ wallet }: CardProps): string =>
    wallet ? '#FF872C' : '#fff'};
  padding: 17px 32px;
  border-radius: 5px;
  color: ${({ wallet }: CardProps): string => (wallet ? '#fff' : '#363F5F')};

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
      font-size: 16px;
    }
  }

  h1 {
    margin-top: 14px;
    font-size: 26px;
    font-weight: normal;
    line-height: 54px;
  }
`;

export const TableContainer = styled.section`
  margin-top: 32px;

  h1 {
    text-align: center;
    font-size: 24px;
  }

  table {
    width: 100%;
    border-spacing: 0 8px;

    th {
      color: #969cb3;
      font-weight: normal;
      padding: 2px 16px;
      text-align: left;
      font-size: 16px;
      line-height: 24px;
      text-align: center;
    }

    tbody {
      tr {
        transition: transform 0.2s;

        &:hover {
          transform: translateX(10px);
        }
      }
    }

    td {
      padding: 20px 16px;
      border: 0;
      background: #fff;
      font-size: 16px;
      font-weight: normal;
      color: #969cb3;
      text-align: center;

      a {
        text-decoration: none;
        color: #550498;
        transition: opacity 0.2s;

        &:hover {
          opacity: 0.8;
        }
      }

      &.ticker {
        color: #363f5f;
        font-weight: 700;
      }

      &.quantity {
        color: #363f5f;
        text-align: center;
      }

      &.profit {
        color: #12a454;
      }

      &.loss {
        color: #e83f5b;
      }
    }

    td:first-child {
      border-radius: 8px 0 0 8px;
    }

    td:last-child {
      border-radius: 0 8px 8px 0;
    }
  }
`;
