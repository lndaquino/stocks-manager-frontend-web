import React, { useState, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { FiMail, FiKey, FiLock, FiUser } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import Header from '../../components/Header';
import Input from '../../components/IconedInput';

import { Container, Content, Button } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

const Import: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data: ProfileFormData) => {
    console.log(data);

    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('Email obrigatório')
          .email('Digite um email válido'),
        newPassword: Yup.string().oneOf(
          [Yup.ref('confirmNewPassword'), null],
          'Nova senha deve ser igual ao campo de confirmação',
        ),
        confirmNewPassword: Yup.string().oneOf(
          [Yup.ref('newPassword'), null],
          'Confirmação de senha deve ser igual ao campo nova senha',
        ),
        password: Yup.string().required('Senha obrigatória'),
      });

      await schema.validate(data, { abortEarly: false });

      /* await signIn({ email: data.email, password: data.password }); */
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
  }, []);

  return (
    <>
      <Header size="small" />
      <Container>
        <Content>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Atualize seus dados</h1>

            <Input name="name" icon={FiUser} placeholder="Nome" />

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input
              name="newPassword"
              icon={FiLock}
              type="password"
              placeholder="Digite a nova senha"
            />

            <Input
              name="confirmNewPassword"
              icon={FiLock}
              type="password"
              placeholder="Digite novamente a nova senha"
            />

            <Input
              name="password"
              icon={FiKey}
              type="password"
              placeholder="Digite sua senha atual"
            />

            <Button type="submit">Confirmar alterações</Button>
          </Form>
        </Content>
      </Container>
    </>
  );
};

export default Import;
