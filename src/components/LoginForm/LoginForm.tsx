import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { KeyRound, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { PulseLoader } from 'react-spinners';

import css from './LoginForm.module.css';
import type { LoginUserReq } from '../../types/auth';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginApi } from '../../services/authApi';

const initialValues: LoginUserReq = {
  tel: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  tel: Yup.string().required('Required field'),
  password: Yup.string().required('Required field'),
});

function LoginForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success(`Welcome, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    },
    // onError: () => {
    //   toast.error('Invalid phone or password');
    // },
    onError: error => {
      console.log('error:', error);
      toast.error('Invalid phone or password');
    },
  });

  const handleSubmit = (
    values: LoginUserReq,
    actions: FormikHelpers<LoginUserReq>
  ) => {
    login(values);
    actions.resetForm();
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
    </>
  );
}

export default LoginForm;
