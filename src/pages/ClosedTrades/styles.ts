import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const TableContainer = styled.section`
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
      padding: 20px 32px;
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
