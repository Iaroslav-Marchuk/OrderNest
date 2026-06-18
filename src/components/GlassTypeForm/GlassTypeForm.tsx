import * as Yup from 'yup';

import type { AddNewGlassTypeReq, GlassType } from '../../types/glassType';
import css from './GlassTypeForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addNewGlassTypeApi,
  patchGlassTypeApi,
} from '../../services/glassTypesApi';
import toast from 'react-hot-toast';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { PulseLoader } from 'react-spinners';
import type { GlassCategory } from '../../types/glassCategory';
import type { AxiosError } from 'axios';

const MONOLITHIC_THICKNESS = ['4', '5', '6', '8', '10'];
const LAMINATED_THICKNESS = ['3+3', '4+4', '5+5', '6+6'];

function ThicknessFields({
  categoriesList,
}: {
  categoriesList: GlassCategory[];
}) {
  const { values } = useFormikContext<{ category: string }>();

  if (!values.category) return null;

  const selectedCategory = categoriesList.find(c => c._id === values.category);
  const thicknessList = selectedCategory?.isLaminated
    ? LAMINATED_THICKNESS
    : MONOLITHIC_THICKNESS;

  return (
    <div className={css.formGroup}>
      <span className={css.label}>Thickness</span>
      <div className={css.checkboxGroup}>
        {thicknessList.map(t => (
          <label key={t} className={css.checkboxLabel}>
            <Field type="checkbox" name="thickness" value={t} />
            {t} mm
          </label>
        ))}
      </div>
      <ErrorMessage name="thickness" component="span" className={css.error} />
    </div>
  );
}

interface GlassTypeFormProps {
  onClose: () => void;
  glassType?: GlassType;
  categoriesList: GlassCategory[];
}

const createValidationSchema = Yup.object().shape({
  label: Yup.string().min(3, 'Minimum 3 characters').required('Required field'),
  category: Yup.string().required('Required field'),
  thickness: Yup.array()
    .of(Yup.string())
    .min(1, 'Select at least one thickness')
    .required('Required field'),
  temper: Yup.string()
    .oneOf(['required', 'forbidden', 'optional'])
    .required('Required field'),
});

const editValidationSchema = Yup.object().shape({
  label: Yup.string().min(3, 'Minimum 3 characters'),
  category: Yup.string(),
  thickness: Yup.array()
    .of(Yup.string())
    .min(1, 'Select at least one thickness'),
  temper: Yup.string().oneOf(['required', 'forbidden', 'optional']),
});

function GlassTypeForm({
  onClose,
  glassType,
  categoriesList,
}: GlassTypeFormProps) {
  const queryClient = useQueryClient();

  const createInitialValues: AddNewGlassTypeReq = {
    label: '',
    category: '',
    thickness: [],
    temper: 'optional',
  };

  const editInitialValues = {
    label: glassType?.label ?? '',
    category: glassType?.category._id ?? '',
    thickness: glassType?.thickness ?? [],
    temper: glassType?.temper ?? 'optional',
  };

  const validationSchema = glassType
    ? editValidationSchema
    : createValidationSchema;
  const initialValues = glassType ? editInitialValues : createInitialValues;

  const { mutate: addNewGlassType, isPending } = useMutation({
    mutationFn: addNewGlassTypeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allGlassTypes'] });
      toast.success('Successfully added new glass type!');
      onClose();
    },

    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

  const { mutate: patchGlassType } = useMutation({
    mutationFn: patchGlassTypeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allGlassTypes'] });
      toast.success('Glass type updated successfully!');
      onClose();
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  const handleSubmit = (values: typeof initialValues) => {
    if (glassType) {
      patchGlassType({ glassTypeId: glassType._id, updateData: values });
    } else {
      addNewGlassType(values as AddNewGlassTypeReq);
    }
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="label" className={css.label}>
              Type's name
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
            <label htmlFor="category" className={css.label}>
              Glass category
            </label>
            <div className={css.inputContainer}>
              <Field
                as="select"
                name="category"
                id="category"
                className={css.input}
              >
                <option value="">Select category...</option>
                {categoriesList.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.label}
                  </option>
                ))}
              </Field>
            </div>
            <ErrorMessage
              name="category"
              component="span"
              className={css.error}
            />
          </div>

          <ThicknessFields categoriesList={categoriesList} />

          <div className={css.formGroup}>
            <span className={css.label}>Heat Treatment</span>
            <div className={css.radioGroup}>
              <label className={css.checkboxLabel}>
                <Field type="radio" name="temper" value="required" />
                Required
              </label>
              <label className={css.checkboxLabel}>
                <Field type="radio" name="temper" value="forbidden" />
                Forbidden
              </label>
              <label className={css.checkboxLabel}>
                <Field type="radio" name="temper" value="optional" />
                Optional
              </label>
            </div>
            <ErrorMessage
              name="temper"
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
            ) : glassType ? (
              'Update Glass Type'
            ) : (
              'Create Glass Type'
            )}
          </button>
        </Form>
      </Formik>
    </>
  );
}

export default GlassTypeForm;
