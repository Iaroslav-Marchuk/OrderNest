import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { KeyRound, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { useState } from 'react';
import type { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { LoginUserReq } from '../../types/auth';

import { changeLocationApi, loginApi } from '../../services/authApi';

import LocationModal from '../LocationModal/LocationModal';
import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';
import ModalOverlay from '../ModalOverlay/ModalOverlay';

import css from './LoginForm.module.css';

const initialValues: LoginUserReq = {
  tel: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  tel: Yup.string()
    .matches(/^\d{9}$/, 'Must be 9 digits')
    .required('Required field'),
  password: Yup.string()
    .min(6, 'Minimum 6 characters')
    .max(16, 'Maximum 16 characters')
    .required('Required field'),
});

function LoginForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showForceModal, setShowForceModal] = useState(false);
  const [pendingCredentials, setPendingCredentials] =
    useState<LoginUserReq | null>(null);

  const [userName, setUserName] = useState('');

  const { mutate: setLocation, isPending: isSettingLocation } = useMutation({
    mutationFn: changeLocationApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success(`Welcome, ${userName}!`);
      setShowLocationModal(false);
      navigate('/');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message ?? 'Failed to set location';
      toast.error(message);
    },
  });

  const handleLoginSuccess = (data: Awaited<ReturnType<typeof loginApi>>) => {
    setShowForceModal(false);
    setPendingCredentials(null);

    if (data.user.role === 'assembly') {
      setUserName(data.user.name);
      setShowLocationModal(true);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    toast.success(`Welcome, ${data.user.name}!`);
    navigate(data.user.role === 'admin' ? '/admin' : '/');
  };

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: handleLoginSuccess,
    onError: (error: AxiosError<{ message: string }>, variables) => {
      if (error.response?.status === 409) {
        setPendingCredentials(variables);
        setShowForceModal(true);
        return;
      }
      const message = error.response?.data?.message;
      toast.error(message ?? 'Invalid phone or password');
    },
  });

  const handleSubmit = (
    values: LoginUserReq,
    actions: FormikHelpers<LoginUserReq>
  ) => {
    login(values);
    actions.resetForm();
  };

  const handleSelectLine = (line: string) => {
    setLocation(line);
  };

  const handleConfirmForceLogin = () => {
    if (!pendingCredentials) return;
    login({ ...pendingCredentials, force: true });
  };

  const handleCancelForceLogin = () => {
    setShowForceModal(false);
    setPendingCredentials(null);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="tel" className={css.label}>
              Telephone number
            </label>
            <div className={css.inputContainer}>
              <Field
                type="tel"
                name="tel"
                id="tel"
                placeholder=" "
                autoComplete="tel"
                className={css.input}
                disabled={isPending}
              />
              <Phone className={css.inputIcon} size={24} strokeWidth={1.5} />
            </div>
            <ErrorMessage name="tel" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="password" className={css.label}>
              Password
            </label>
            <div className={css.inputContainer}>
              <Field
                type="password"
                name="password"
                id="password"
                placeholder=" "
                autoComplete="current-password"
                className={css.input}
                disabled={isPending}
              />
              <KeyRound className={css.inputIcon} size={24} strokeWidth={1.5} />
            </div>
            <ErrorMessage
              name="password"
              component="span"
              className={css.error}
            />
          </div>

          <button type="submit" className={css.btn} disabled={isPending}>
            {isPending ? (
              <PulseLoader
                loading={true}
                aria-label="Loading Spinner"
                data-testid="loader"
                color="#9fb9e2ff"
                size={5}
                className={css.spiner}
              />
            ) : (
              'Login'
            )}
          </button>
        </Form>
      </Formik>

      {showLocationModal && (
        <LocationModal
          onSelect={handleSelectLine}
          isPending={isSettingLocation}
          userName={userName}
        />
      )}

      {showForceModal && (
        <ModalOverlay onClose={handleCancelForceLogin}>
          <ConfirmContainer
            text="This account is already logged in on another device. Continue here and log out there?"
            onConfirm={handleConfirmForceLogin}
            onClose={handleCancelForceLogin}
          />
        </ModalOverlay>
      )}
    </>
  );
}

export default LoginForm;
