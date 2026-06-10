import * as Yup from 'yup';

import css from './ChangePasswordForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changePasswordApi } from '../../services/authApi';
import toast from 'react-hot-toast';
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';

import { PulseLoader } from 'react-spinners';
import { setAccessToken } from '../../services/axiosInstance';

const validationSchema = Yup.object().shape({
  oldPass: Yup.string().required('Required field'),
  newPass: Yup.string().required('Required field'),
  confirmPass: Yup.string()
    .required('Required field')
    .oneOf([Yup.ref('newPass')], 'Passwords do not match'),
});

const initialValues = {
  oldPass: '',
  newPass: '',
  confirmPass: '',
};

function ChangePasswordForm() {
  const queryClient = useQueryClient();

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: changePasswordApi,
    onSuccess: data => {
      setAccessToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('Password changed successfully!');
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  const handleSubmit = (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>
  ) => {
    changePassword({
      oldPass: values.oldPass,
      newPass: values.newPass,
    });
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="password" className={css.label}>
            Old password
          </label>
          <div className={css.inputContainer}>
            <Field
              type="password"
              name="oldPass"
              id="oldPass"
              placeholder=" "
              autoComplete="current-password"
              className={css.input}
              disabled={isPending}
            />
          </div>
          <ErrorMessage name="oldPass" component="span" className={css.error} />
        </div>

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
          </div>
          <ErrorMessage name="newPass" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password" className={css.label}>
            Confirm password
          </label>
          <div className={css.inputContainer}>
            <Field
              type="password"
              name="confirmPass"
              id="confirmPass"
              placeholder=" "
              autoComplete="current-password"
              className={css.input}
              disabled={isPending}
            />
          </div>
          <ErrorMessage
            name="confirmPass"
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
            'Change password'
          )}
        </button>
      </Form>
    </Formik>
  );
}

export default ChangePasswordForm;
