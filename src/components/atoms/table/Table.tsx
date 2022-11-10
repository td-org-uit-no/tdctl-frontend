import { useEffect, useState } from 'react';
import { SortOption, typeToFunction } from 'utils/sorting';
import './table.scss';
// extends https://www.bekk.christmas/post/2020/22/create-a-generic-table-with-react-and-typescript
export type ColumnDefinitionType<T, K extends keyof T> = {
  // Type can be the key of the object or a callback that takes in the
  // row-values and returns an element
  cell: K | ((values: any) => JSX.Element);
  header: string;
  width?: number;
  // sort the column based on the type
  type?: keyof SortOption;
};

type TableProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<ColumnDefinitionType<T, K>>;
  type?: keyof SortOption;
};

type TableHeaderProps<T, K extends keyof T> = {
  columns: Array<ColumnDefinitionType<T, K>>;
  setColumn: (column: SortColumn<T, K>) => void;
};

type TableRowsProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<ColumnDefinitionType<T, K>>;
  selectedColumn: SortColumn<T, K>;
};

type SortColumn<T, K extends keyof T> = {
  columnName: K;
  sortType: keyof SortOption;
};

const Table = <T, K extends keyof T>({ data, columns }: TableProps<T, K>) => {
  const initColumn = {
    columnName: columns[0].cell as K,
    // defaults to number as its a straight comparison a < b
    sortType: columns[0]?.type ?? 'number',
  };
  const [selectedColumn, setSelectedColumn] =
    useState<SortColumn<T, K>>(initColumn);

  return (
    <table className={'table'}>
      <TableHeader columns={columns} setColumn={setSelectedColumn} />
      <TableRows
        data={data}
        columns={columns}
        selectedColumn={selectedColumn}
      />
    </table>
  );
};

const TableHeader = <T, K extends keyof T>({
  columns,
  setColumn,
}: TableHeaderProps<T, K>) => {
  const onColumnClick = (column: ColumnDefinitionType<T, K>) => {
    const selected = {
      columnName: column.cell as K,
      sortType: column.type ?? 'number',
    };
    setColumn(selected);
  };

  return (
    <thead>
      <tr>
        {columns.map((column, index) => {
          return (
            <th key={`headCell-${index}`} onClick={() => onColumnClick(column)}>
              {column.header}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

const TableRows = <T, K extends keyof T>({
  data,
  columns,
  selectedColumn,
}: TableRowsProps<T, K>) => {
  const [sortedData, setSortedData] = useState<Array<T>>(data);

  function OrderByArray(values: Array<T>, orderType: K) {
    const func = typeToFunction[selectedColumn.sortType];
    const sorted = [...values].sort((a, b) => func(a[orderType], b[orderType]));
    setSortedData(sorted);
  }

  useEffect(() => {
    OrderByArray(sortedData, selectedColumn.columnName as K);
  }, [selectedColumn]);

  useEffect(() => {
    OrderByArray(data, selectedColumn.columnName as K);
  }, [data]);

  return (
    <tbody>
      {sortedData.map((row, index) => {
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
      })}
    </tbody>
  );
};

export default Table;
