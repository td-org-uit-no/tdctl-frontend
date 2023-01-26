import React, { useState } from 'react';
import styles from './dropdownHeader.module.scss';
import Dropdown from 'components/atoms/dropdown/Dropdown';
import Icon from 'components/atoms/icons/icon';

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {
  title: string;
}

const DropdownHeader: React.FC<Props> = ({ title, children, ...rest }) => {
  const [expanded, setExpanded] = useState(false);

  const onExpand = () => setExpanded(!expanded);

  return (
    <div className={styles.container}>
      <div className={styles.box} {...rest}>
        <div className={styles.base} onClick={onExpand}>
          <div className={styles.item2}>
            <p>{title}</p>
          </div>
          <div className={styles.item3}>
            <Icon type={'angle-double-down'} size={2} color={'#80a2e1'} />
          </div>
        </div>
        <Dropdown expanded={expanded}>{children}</Dropdown>
      </div>
    </div>
  );
};
export default DropdownHeader;
