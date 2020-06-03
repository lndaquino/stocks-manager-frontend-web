import React, { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiKey, FiMail, FiLock } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import Logo from '../../components/Logo';
import Input from '../../components/IconedInput';

import {
  Container,
  Content,
  Background,
  AnimationContainer,
  Button,
  AnimatedTextContainer,
} from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      console.log('handleSubmit');
      console.log(data);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um email válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, { abortEarly: false });

        await signIn({ email: data.email, password: data.password });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
        });
      }
    },
    [addToast, signIn],
  );

  const handleResetPassword = useCallback(async () => {
    const email = prompt('Insira seu email para recuperar a senha');

    if (email) {
      const schema = Yup.string().email();
      const isEmail = await schema.isValid(email);

      if (!isEmail) {
        addToast({
          type: 'error',
          title: 'Email inválido',
          description: 'Digite um email válido para resetar a senha.',
        });

        return;
      }

      try {
        await api.post('/password/forgot', { email });

        addToast({
          type: 'sucess',
          title: 'Email enviado com sucesso',
          description:
            'Verifique seu email com instruções para reset de senha.',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Email não cadastrado',
          description: 'Email informado não está cadastrado como usuário.',
        });
      }
    }
  }, []);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <Logo />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu logon</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input
              name="password"
              icon={FiKey}
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Entrar</Button>

            <button
              className="forgotPassword"
              type="button"
              onClick={handleResetPassword}
            >
              Esqueci minha senha
            </button>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>

      <Background>
        <AnimatedTextContainer>
          <h1>Gerencie seu portfólio de ações e FIIs.</h1>
          <h1>Veja seu histórico de investimentos.</h1>
          <p>Fácil. Em qualquer lugar.</p>
        </AnimatedTextContainer>
      </Background>
    </Container>
  );
};

export default SignIn;
