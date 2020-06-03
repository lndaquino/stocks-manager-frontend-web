import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}
export const Container = styled.div<ContainerProps>`
  background: #f0f2f5;
  border-radius: 2em;
  padding: 16px;
  width: 100%;

  border: 3px solid #f0f2f5;
  color: #666360;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  ${props =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  ${props =>
    props.isFocused &&
    css`
      border-color: #ff872c;
    `}

  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #191d2b;
    font-weight: 500;

    &::placeholder {
      color: #a39e99;
    }
  }

  svg {
    margin-right: 16px;
    color: #a39e99;

    ${props =>
      props.isFocused &&
      css`
        color: #ff872c;
      `}

    ${props =>
      props.isFilled &&
      css`
        color: #ff872c;
      `}
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
