import React, { useCallback, useRef } from 'react';
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
import { useAuth } from '../../hooks/auth';
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
  const { user, updateUser } = useAuth();
  const token = localStorage.getItem('@StocksLife:token');
  const parsedToken = `Bearer ${token}`;
  const history = useHistory();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        let schema;

        if (!data.newPassword) {
          schema = Yup.object().shape({
            name: Yup.string().required('Nome obrigatório'),
            email: Yup.string()
              .required('Email obrigatório')
              .email('Digite um email válido'),
            newPassword: Yup.string(),
            confirmNewPassword: Yup.string(),
            password: Yup.string().required('Senha obrigatória'),
          });
        } else {
          schema = Yup.object().shape({
            name: Yup.string().required('Nome obrigatório'),
            email: Yup.string()
              .required('Email obrigatório')
              .email('Digite um email válido'),

            newPassword: Yup.string().min(6, 'Minimo de 6 caracteres'),

            confirmNewPassword: Yup.string()
              .min(6, 'Minimo de 6 caracteres')
              .oneOf(
                [Yup.ref('newPassword'), null],
                'Confirmação de senha deve ser igual ao campo nova senha',
              ),
            password: Yup.string().required('Senha obrigatória'),
          });
        }

        await schema.validate(data, { abortEarly: false });

        const { name, email, password, newPassword } = data;

        const formData = {
          name,
          email,
          password,
          ...(newPassword ? { new_password: newPassword } : {}),
        };

        console.log(formData);
        const response = await api.put('/users/update', formData, {
          headers: {
            Authorization: parsedToken,
          },
        });

        updateUser(response.data);

        history.push('/dashboard');

        addToast({
          type: 'sucess',
          title: 'Perfil atualizado com sucesso',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description:
            'Ocorreu um erro ao atualizar os dados, cheque as credenciais.',
        });
      }
    },
    [addToast, parsedToken, history, updateUser],
  );

  return (
    <>
      <Header size="small" />
      <Container>
        <Content>
          <Form
            ref={formRef}
            initialData={{ name: user.name, email: user.email }}
            onSubmit={handleSubmit}
          >
            <h1>Atualize seus dados</h1>

            <Input name="name" icon={FiUser} placeholder="Nome" />

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input
              containerStyle={{ marginTop: 18 }}
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
              containerStyle={{ marginTop: 18 }}
              name="password"
              icon={FiKey}
              type="password"
              placeholder="Obrigatório - senha atual"
            />

            <Button type="submit">Confirmar alterações</Button>
          </Form>
        </Content>
      </Container>
    </>
  );
};

export default Import;
