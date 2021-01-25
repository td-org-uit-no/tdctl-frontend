import React, {useState} from 'react';
import styles from './dropdown.module.scss';
import Button from '../button/Button';
import cx from 'classnames';

interface Props {
    items: {
        label: string,
        url: string, 
    }[];
}
const Dropdown: React.FC<Props> = ({ items }) => {
    const [active, setActive] = useState(false);

    return(
        <div className={styles.menuContainer}>
            <Button version = {'secondary'} onClick={() => setActive(!active)}>
                Menu
            </Button>
            <nav className={cx(styles.menu, {[styles.active]: active})}>
                <ul>
                    {items.map((item, index:number) => (
                        <li key={index}><a href={item.url}>{item.label}</a></li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Dropdown
