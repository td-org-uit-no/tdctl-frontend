import './table.scss';
// https://www.bekk.christmas/post/2020/22/create-a-generic-table-with-react-and-typescript
export type ColumnDefinitionType<T, K extends keyof T> = {
  // Type can be the key of the object or a callback that takes in the
  // row-values and returns an element
  cell: K | ((values: any) => JSX.Element);
  header: string;
  width?: number;
};

type TableProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<ColumnDefinitionType<T, K>>;
};

const Table = <T, K extends keyof T>({ data, columns }: TableProps<T, K>) => {
  return (
    <table className={'table'}>
      <TableHeader columns={columns} />
      <TableRows data={data} columns={columns} />
    </table>
  );
};

export default Table;

type TableHeaderProps<T, K extends keyof T> = {
  columns: Array<ColumnDefinitionType<T, K>>;
};

const TableHeader = <T, K extends keyof T>({
  columns,
}: TableHeaderProps<T, K>) => {
  const headers = columns.map((column, index) => {
    return <th key={`headCell-${index}`}>{column.header}</th>;
  });

  return (
    <thead>
      <tr>{headers}</tr>
    </thead>
  );
};

type TableRowsProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<ColumnDefinitionType<T, K>>;
};

const TableRows = <T, K extends keyof T>({
  data,
  columns,
}: TableRowsProps<T, K>) => {
  const rows = data.map((row, index) => {
    return (
      <tr key={`row-${index}`}>
        {columns.map((column, index2) => {
          return (
            <td key={`cell-${index2}`}>
              {typeof column.cell === 'function'
                ? column.cell(row)
                : row[column.cell]}
            </td>
          );
        })}
      </tr>
    );
  });

  return <tbody>{rows}</tbody>;
};
