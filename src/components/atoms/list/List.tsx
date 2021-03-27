import React, { LiHTMLAttributes } from 'react';
import styles from './list.module.scss';

interface Props extends LiHTMLAttributes<HTMLElement> {
  items: {
    lable: string;
    data: string;
  }[];
}

const List: React.FC<Props> = ({ items, ...rest }) => {
  return (
    <div className={styles.list}>
      <ul>
        {items.map((item, index: number) => (
          <li key={index} {...rest}>
            <p>
              {item.lable} : {item.data}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default List;
