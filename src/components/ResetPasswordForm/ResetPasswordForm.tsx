import * as Yup from 'yup';

import css from './ResetPasswordForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetPasswordApi } from '../../services/usersApi';
import toast from 'react-hot-toast';
import { PulseLoader } from 'react-spinners';
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import { KeyRound } from 'lucide-react';

interface ResetPasswordFormProps {
  userId: string;
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  newPass: Yup.string().required('Required field'),
});

const initialValues = {
  newPass: '',
};

function ResetPasswordForm({ userId, onClose }: ResetPasswordFormProps) {
  const queryClient = useQueryClient();

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      toast.success('Password reseted successfully!');
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  const handleSubmit = (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>
  ) => {
    resetPassword({ userId, newPass: values.newPass });
    actions.resetForm();
    onClose();
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
            <label htmlFor="password" className={css.label}>
              New password
            </label>
            <div className={css.inputContainer}>
              <Field
                type="password"
                name="newPass"
                id="newPass"
                placeholder=" "
                autoComplete="current-password"
                className={css.input}
                disabled={isPending}
              />
              <KeyRound className={css.inputIcon} size={24} strokeWidth={1.5} />
            </div>
            <ErrorMessage
              name="newPass"
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
              'Save'
            )}
          </button>
        </Form>
      </Formik>
    </>
  );
}

export default ResetPasswordForm;
