import * as Yup from 'yup';

import type { GlassCategory } from '../../types/glassCategory';
import css from './GlassCategoryForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addNewGlassCategoryApi,
  patchGlassCategoryApi,
} from '../../services/glassCategoriesApi';
import toast from 'react-hot-toast';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { PulseLoader } from 'react-spinners';

interface GlassCategoryFormProps {
  onClose: () => void;
  glassCategory?: GlassCategory;
}

const validationSchema = Yup.object().shape({
  label: Yup.string().min(3, 'Minimum 3 characters').required('Required field'),
});

function GlassCategoryForm({ onClose, glassCategory }: GlassCategoryFormProps) {
  const queryClient = useQueryClient();

  const createInitialValues = {
    label: '',
  };

  const editInitialValues = {
    label: glassCategory?.label ?? '',
  };

  const initialValues = glassCategory ? editInitialValues : createInitialValues;

  const { mutate: addNewGlassCategory, isPending } = useMutation({
    mutationFn: addNewGlassCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allGlassCategories'] });
      toast.success('Successfully added new glass category!');
      onClose();
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  const { mutate: patchGlassCategory } = useMutation({
    mutationFn: patchGlassCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allGlassCategories'] });
      toast.success('Glass category updated successfully!');
      onClose();
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  const handleSubmit = (values: typeof initialValues) => {
    if (glassCategory) {
      patchGlassCategory({
        glassCategoryId: glassCategory._id,
        updateData: { label: values.label },
      });
    } else {
      addNewGlassCategory(values.label);
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
