import { ErrorMessage, Field, useFormikContext } from 'formik';
import css from './OrderItemForm.module.css';
import { X } from 'lucide-react';
import type { GlassCategory } from '../../types/glassCategory';
import type { GlassType } from '../../types/glassType';
import type { OrderFormValues } from '../../types/order';

interface OrderItemFormProps {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
  isPending: boolean;
  categoriesList: GlassCategory[];
  typesList: GlassType[];
}

function OrderItemForm({
  index,
  onRemove,
  canRemove,
  isPending,
  categoriesList,
  typesList,
}: OrderItemFormProps) {
  const { values, setFieldValue } = useFormikContext<OrderFormValues>();
  const selectedTypeId = values.items[index].type;
  const selectedType = typesList.find(t => t._id === selectedTypeId);
  const thicknessList = selectedType?.thickness || [];

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldValue(`items[${index}].type`, e.target.value);
    setFieldValue(`items[${index}].thickness`, '');
  };

  return (
    <div className={css.orderRow}>
      <div className={css.row1}>
        <div className={css.formGroup}>
          <label className={css.label}>Type</label>
          <Field
            as="select"
            name={`items[${index}].type`}
            onChange={handleTypeChange}
          >
            <option value="">Select type...</option>
            {categoriesList.map(category => (
              <optgroup key={category._id} label={category.label}>
                {typesList
                  .filter(t => t.category._id === category._id)
                  .map(type => (
                    <option key={type._id} value={type._id}>
                      {type.label}
                    </option>
                  ))}
              </optgroup>
            ))}
          </Field>
          <ErrorMessage
            name={`items[${index}].type`}
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label className={css.label}>Thickness</label>
          <Field
            as="select"
            name={`items[${index}].thickness`}
            disabled={!selectedTypeId || isPending}
          >
            <option value="">—</option>
            {thicknessList.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Field>
          <ErrorMessage
            name={`items[${index}].thickness`}
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.temperedGroup}>
          <label className={css.label}>Tempered</label>
          <div className={css.checkboxWrapper}>
            <Field type="checkbox" name={`items[${index}].isTempered`} />
          </div>
        </div>
      </div>

      <div className={css.row2}>
        <div className={css.sizeWrapper}>
          <div className={css.formGroup}>
            <label className={css.label}>Size X</label>
            <Field
              type="number"
              name={`items[${index}].sizeX`}
              className={css.input}
              disabled={isPending}
            />
            <ErrorMessage
              name={`items[${index}].sizeX`}
              component="span"
              className={css.error}
            />
          </div>
          <span className={css.sizeSpan}>×</span>
          <div className={css.formGroup}>
            <label className={css.label}>Size Y</label>
            <Field
              type="number"
              name={`items[${index}].sizeY`}
              className={css.input}
              disabled={isPending}
            />
            <ErrorMessage
              name={`items[${index}].sizeY`}
              component="span"
              className={css.error}
            />
          </div>
        </div>

        <div className={css.formGroup}>
          <label className={css.label}>Quantity</label>
          <Field
            type="number"
            name={`items[${index}].quantity`}
            className={css.input}
            disabled={isPending}
          />
          <ErrorMessage
            name={`items[${index}].quantity`}
            component="span"
            className={css.error}
          />
        </div>
      </div>

      <div className={css.row3}>
        <div className={css.formGroup}>
          <label className={css.label}>Reason</label>
          <Field
            as="textarea"
            name={`items[${index}].reason`}
            className={css.input}
            disabled={isPending}
            rows={2}
          />
          <ErrorMessage
            name={`items[${index}].reason`}
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label className={css.label}>Notes</label>
          <Field
            as="textarea"
            name={`items[${index}].notes`}
            className={css.input}
            disabled={isPending}
            rows={2}
          />
          <ErrorMessage
            name={`items[${index}].notes`}
            component="span"
            className={css.error}
          />
        </div>
      </div>

      {canRemove && (
        <button type="button" className={css.removeBtn} onClick={onRemove}>
          <X size={12} />
        </button>
      )}
    </div>
  );
}

export default OrderItemForm;
