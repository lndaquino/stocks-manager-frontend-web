import React, { useCallback, useRef } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import Input from '../../components/IconedInput';

import { Container, Content, Button } from './styles';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

interface ResetPasswordParams {
  token: string;
}

interface ProfileFormData {
  password: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { addToast } = useToast();

  const { params } = useRouteMatch<ResetPasswordParams>();
  const { token } = params;
  console.log({ token });

  const handleSubmit = useCallback(async ({ password }: ProfileFormData) => {
    console.log('handleSubmit');
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        password: Yup.string().min(6, 'No mínimo 6 dígitos'),
      });

      await schema.validate({ password }, { abortEarly: false });

      await api.post('/password/reset', { password, token });

      history.push('/');

      addToast({
        type: 'sucess',
        title: 'Senha resetada com sucesso',
        description:
          'Você já pode fazer seu login no StocksLife com sua nova senha!',
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }
    }
  }, []);

  return (
    <>
      <Header redirect="home" size="small" />
      <Container>
        <Content>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Informe sua nova senha</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Digite a nova senha"
            />

            <Button type="submit">Alterar minha senha</Button>
          </Form>
        </Content>
      </Container>
    </>
  );
};

export default ResetPassword;
