import {
  useEffect,
  useState,
  DragEvent,
  Dispatch,
  SetStateAction,
} from 'react';
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
  setData?: Dispatch<SetStateAction<Array<T>>>;
  columns: Array<ColumnDefinitionType<T, K>>;
  showIdx?: boolean;
  type?: keyof SortOption;
  dragable?: boolean;
  sort?: boolean;
  mark?: number;
};

type TableHeaderProps<T, K extends keyof T> = {
  columns: Array<ColumnDefinitionType<T, K>>;
  setColumn: (column: SortColumn<T, K>) => void;
  showIdx?: boolean;
};

type TableRowsProps<T, K extends keyof T> = {
  data: Array<T>;
  setData?: Dispatch<SetStateAction<Array<T>>>;
  columns: Array<ColumnDefinitionType<T, K>>;
  selectedColumn: SortColumn<T, K>;
  showIdx?: boolean;
  dragble?: boolean;
  sort?: boolean;
  mark?: number;
};

type SortColumn<T, K extends keyof T> = {
  columnName: K;
  sortType: keyof SortOption;
};

const Table = <T, K extends keyof T>({
  data,
  setData,
  columns,
  showIdx = false,
  dragable = false,
  sort = true,
  mark,
}: TableProps<T, K>) => {
  const initColumn = {
    columnName: columns[0].cell as K,
    // defaults to number as its a straight comparison a < b
    sortType: columns[0]?.type ?? 'number',
  };
  const [selectedColumn, setSelectedColumn] =
    useState<SortColumn<T, K>>(initColumn);

  return (
    <table className={'table'}>
      <TableHeader
        columns={columns}
        setColumn={setSelectedColumn}
        showIdx={showIdx}
      />
      <TableRows
        data={data}
        setData={setData}
        columns={columns}
        selectedColumn={selectedColumn}
        showIdx={showIdx}
        dragble={dragable}
        sort={sort}
        mark={mark}
      />
    </table>
  );
};

const TableHeader = <T, K extends keyof T>({
  columns,
  setColumn,
  showIdx,
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
        {showIdx && <th>{'Indeks'}</th>}
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
  setData,
  columns,
  selectedColumn,
  showIdx = false,
  dragble = false,
  sort = true,
  mark,
}: TableRowsProps<T, K>) => {
  const [sortedData, setSortedData] = useState<Array<T>>(data);
  const [pos, setPos] = useState<number | undefined>();
  const [dragOver, setDragover] = useState<number | undefined>();

  function OrderByArray(values: Array<T>, orderType: K) {
    const func = typeToFunction[selectedColumn.sortType];
    const sorted = [...values].sort((a, b) => func(a[orderType], b[orderType]));
    setSortedData(sorted);
  }

  useEffect(() => {
    if (setData) {
      setData(sortedData);
    }
  }, [sortedData]);

  useEffect(() => {
    if (sort === false) {
      return;
    }
    OrderByArray(sortedData, selectedColumn.columnName as K);
  }, [selectedColumn]);

  useEffect(() => {
    if (sort === false) {
      setSortedData(data);
      return;
    }
    OrderByArray(data, selectedColumn.columnName as K);
  }, [data]);

  const dragStart = (_e: DragEvent<HTMLDivElement>, position: number) => {
    setPos(position);
  };

  const dragEnter = (_e: DragEvent<HTMLDivElement>, position: any) => {
    setDragover(position);
  };

  const drop = () => {
    const copyListItems = [...sortedData];
    if (pos !== undefined && dragOver !== undefined) {
      const dragItemContent = copyListItems[pos];
      copyListItems.splice(pos, 1);
      copyListItems.splice(dragOver, 0, dragItemContent);
    }
    setPos(undefined);
    setDragover(undefined);
    setSortedData(copyListItems);
  };

  return (
    <tbody>
      {sortedData.map((row, index) => {
        return (
          <tr
            key={`row-${index}`}
            draggable={dragble}
            onDragStart={(e) => dragStart(e, index)}
            onDragEnter={(e) => dragEnter(e, index)}
            onDragEnd={drop}
            className={index === mark ? 'marked' : undefined}>
            {showIdx && <td key={index}>{index}</td>}
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
