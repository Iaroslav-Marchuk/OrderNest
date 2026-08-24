import * as Yup from 'yup';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { PulseLoader } from 'react-spinners';

import type { GlassCategory } from '../../types/glassCategory';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addNewGlassCategoryApi,
  patchGlassCategoryApi,
} from '../../services/glassCategoriesApi';

import css from './GlassCategoryForm.module.css';

interface GlassCategoryFormProps {
  onClose: () => void;
  glassCategory?: GlassCategory;
}

const createValidationSchema = Yup.object().shape({
  label: Yup.string().min(3, 'Minimum 3 characters').required('Required field'),
  isLaminated: Yup.boolean().required(),
});

const editValidationSchema = Yup.object().shape({
  label: Yup.string().min(3, 'Minimum 3 characters'),
  isLaminated: Yup.boolean(),
});

function GlassCategoryForm({ onClose, glassCategory }: GlassCategoryFormProps) {
  const queryClient = useQueryClient();

  const createInitialValues = {
    label: '',
    isLaminated: false,
  };

  const editInitialValues = {
    label: glassCategory?.label ?? '',
    isLaminated: glassCategory?.isLaminated ?? false,
  };

  const initialValues = glassCategory ? editInitialValues : createInitialValues;
  const validationSchema = glassCategory
    ? editValidationSchema
    : createValidationSchema;

  const { mutate: addNewGlassCategory, isPending } = useMutation({
    mutationFn: addNewGlassCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allGlassCategories'] });
      queryClient.invalidateQueries({ queryKey: ['glassCategories'] });
      toast.success('Successfully added new glass category!');
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

  const { mutate: patchGlassCategory } = useMutation({
    mutationFn: patchGlassCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allGlassCategories'] });
      queryClient.invalidateQueries({ queryKey: ['glassCategories'] });
      toast.success('Glass category updated successfully!');
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

  const handleSubmit = (values: typeof initialValues) => {
    if (glassCategory) {
      patchGlassCategory({
        glassCategoryId: glassCategory._id,
        updateData: { label: values.label, isLaminated: values.isLaminated },
      });
    } else {
      addNewGlassCategory({
        label: values.label,
        isLaminated: values.isLaminated,
      });
    }
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
            <label htmlFor="label" className={css.label}>
              Glass Category name
            </label>
            <div className={css.inputContainer}>
              <Field
                type="text"
                name="label"
                id="label"
                placeholder=" "
                autoComplete="label"
                className={css.input}
                disabled={isPending}
              />
            </div>
            <ErrorMessage name="label" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label className={css.checkboxLabel}>
              <Field type="checkbox" name="isLaminated" />
              Laminated glass
            </label>
            <ErrorMessage
              name="isLaminated"
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
            ) : glassCategory ? (
              'Update glass category'
            ) : (
              'Add new Glass category'
            )}
          </button>
        </Form>
      </Formik>
    </>
  );
}

export default GlassCategoryForm;
