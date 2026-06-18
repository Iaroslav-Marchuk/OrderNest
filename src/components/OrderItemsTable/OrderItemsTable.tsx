import css from './OrderItemsTable.module.css';

interface OrderItem {
  id: string;
  glassType: string; // ref → GlassType label
  thickness: number;
  size: { width: number; height: number };
  quantity: number;
  note?: string;
}

interface Props {
  items: OrderItem[];
}

function OrderItemsTable({ items }: Props) {
  return (
    <div className={css.wrapper}>
      <table className={css.table}>
        <thead>
          <tr>
            <th className={css.th}>Glass type</th>
            <th className={css.th}>Thickness</th>
            <th className={css.th}>Size (mm)</th>
            <th className={css.th}>Qty</th>
            <th className={css.th}>Reason</th>
            <th className={css.th}>Note</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className={css.row}>
              <td className={css.td}>{item.glassType}</td>
              <td className={css.td}>{item.thickness} mm</td>
              <td className={css.td}>
                {item.size.width} × {item.size.height}
              </td>
              <td className={css.td}>{item.quantity}</td>
              <td className={css.td}>{item.note ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderItemsTable;
