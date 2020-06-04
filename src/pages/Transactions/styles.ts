import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const Title = styled.h1`
  font-weight: 500;
  font-size: 36px;
  line-height: 54px;
  color: #363f5f;
  text-align: center;
`;

export const RegisterContainer = styled.section`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-gap: 12px;
`;

export const TickerRegisterContainer = styled.form`
  background: #fff;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr;
  padding: 5px 20px;
  min-width: 700px;
`;

export const InputContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 5px 0;

  input {
    padding: 2px;
    font-size: 14px;
  }
`;

export const DataContainer = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-weight: 700;
    color: #363f5f;
    margin-bottom: 2px;

    span {
      color: red;
      font-weight: 500;
      font-size: 12px;
    }
  }

  input {
    width: 80%;
    border-radius: 2em;
    padding: 0.2em 0.5em;
    border: 2px solid #f5f5f5;
    background: #f0f2f5;

    ::placeholder {
      color: #a8a8a8;
    }
  }

  div {
    display: flex;
    width: 80%;
    text-align: left;

    input {
      margin-top: 4px;
    }

    label {
      font-weight: 500;
    }
  }
`;

export const ButtonContainer = styled.div`
  margin: 10px 0;

  button {
    float: right;
    background: #ff872c;
    color: #fff;
    font-weight: 500;
    border-radius: 5px;
    padding: 10px 30px;
    border: 0;
    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#ff872c')};
    }
  }
`;

export const TotalInfosContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 25px;
  text-align: center;
  min-width: 250px;

  p {
    font-size: 24px;
    position: relative;
    top: 25%;
  }
`;

export const TableContainer = styled.section`
  margin-top: 10px;
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
      padding: 2px 32px;
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

      button {
        color: #550498;
        border: 0;
        background: #fff;
        transition: opacity 0.2s;

        &:hover {
          opacity: 0.8;
        }
      }

      a {
        text-decoration: none;
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
