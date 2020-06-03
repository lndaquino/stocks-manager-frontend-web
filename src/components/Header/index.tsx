import React, { useCallback } from 'react';
import { FiX } from 'react-icons/fi';

import { Link, NavLink, useHistory } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';

import { Container } from './styles';

interface HeaderProps {
  size?: 'small' | 'large';
  redirect?: 'statement' | 'home';
}

const Header: React.FC<HeaderProps> = ({
  size = 'large',
  redirect,
}: HeaderProps) => {
  const history = useHistory();
  const { signOut } = useAuth();

  const handleLogout = useCallback(() => {
    signOut();
  }, []);

  return (
    <Container size={size}>
      <header>
        <div>
          <h1>$</h1>
          <span>StocksLife</span>
        </div>

        <nav>
          {redirect ? (
            <NavLink exact to="/">
              <button
                type="button"
                onClick={() =>
                  redirect === 'statement'
                    ? history.goBack()
                    : history.push('/')
                }
              >
                <FiX size={40} color="#fff" />
              </button>
            </NavLink>
          ) : (
            <>
              <NavLink
                exact
                to="/dashboard"
                activeStyle={{
                  fontWeight: 700,
                  borderBottom: '4px solid #FF872C',
                }}
                activeClassName="current"
              >
                Dashboard
              </NavLink>
              <NavLink
                exact
                to="/transactions"
                activeStyle={{
                  fontWeight: 700,
                  borderBottom: '4px solid #FF872C',
                }}
                activeClassName="current"
              >
                Cadastrar Transação
              </NavLink>
              <NavLink
                exact
                to="/closedtrades"
                activeStyle={{
                  fontWeight: 700,
                  borderBottom: '4px solid #FF872C',
                }}
                activeClassName="current"
              >
                Trades encerrados
              </NavLink>
              <NavLink
                exact
                to="/profile"
                activeStyle={{
                  fontWeight: 700,
                  borderBottom: '4px solid #FF872C',
                }}
                activeClassName="current"
              >
                Meus dados
              </NavLink>
              <NavLink exact to="/">
                <button type="button" onClick={handleLogout}>
                  Sair
                </button>
              </NavLink>
            </>
          )}
        </nav>
      </header>
    </Container>
  );
};
export default Header;
