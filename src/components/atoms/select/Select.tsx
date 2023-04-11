import { useReducer } from 'react';
import { useEffect, useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import styles from './select.module.scss';

// TODO: Have another type for value and/or key inside Item?
type Value = string;

enum Key {
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp',
  Enter = 'Enter',
}

interface Item {
  key: string;
  label: string;
  value: Value;
}

interface Props {
  value?: Value;
  onChange?: (value: Value, name: string) => void;
  minWidth?: number;
  maxWidth?: number;
  label: string;
  items: Item[];
  name: string;
}

const Select: React.FC<Props> = ({
  label,
  items,
  minWidth,
  maxWidth,
  value,
  name,
  onChange,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Item | undefined>(() =>
    items.find((it) => it.value === value)
  );

  useEffect(() => {
    setSelectedValue(() => {
      return items.find((it) => it.value === value);
    });
    // TODO: Should do something here with items. It will return a new reference
    // each time therefore counting it as new and then having to rerun this
    // everytime. Should not happen so only subscribe to value for now

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const handler = () => setShowMenu(false);

    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  });

  const isSelected = (item: Item) => {
    if (!selectedValue) {
      return false;
    }

    // TODO: If value is any then we need to fix this equals
    return selectedValue.value === item.value;
  };

  function reducer(state: any, action: any) {
    switch (action.type) {
      case Key.ArrowUp:
        return {
          selectedIndex:
            state.selectedIndex > 0
              ? state.selectedIndex - 1
              : items.length - 1,
        };
      case Key.ArrowDown:
        return {
          selectedIndex:
            state.selectedIndex !== items.length - 1
              ? state.selectedIndex + 1
              : 0,
        };
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, { selectedIndex: -1 });

  // TODO: Add these colors somewhere
  const getBackgroundColor = (item: any, index: number) => {
    if (isSelected(item)) {
      return '#0d6efd';
    } else if (index === state.selectedIndex) {
      return '#9fc3f8';
    } else {
      return '';
    }
  };

  const styleLabel: boolean = showMenu || !!selectedValue;

  return (
    <div
      className={styles.container}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === Key.ArrowDown) {
          dispatch({ type: Key.ArrowDown });
        } else if (e.key === Key.ArrowUp) {
          dispatch({ type: Key.ArrowUp });
        } else {
          setSelectedValue(items[state.selectedIndex]);
          setShowMenu(false);
        }
      }}>
      <div className={styles.wrapper}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          style={{
            maxWidth: maxWidth ? maxWidth + 'ch' : '',
            minWidth: minWidth ? minWidth + 'ch' : '',
            border: showMenu ? '2px solid #7e4ccb' : '',
          }}
          className={styles.text}>
          {selectedValue?.label}
        </div>
        {
          <label
            className={styles.label}
            style={{
              ...(styleLabel && {
                top: '-10px',
                color: '#7e4ccb',
                fontSize: '14px',
              }),
            }}>
            {label}
          </label>
        }
        {showMenu ? (
          // TODO: Try to make the arrow rotate gradually
          <MdKeyboardArrowUp className={styles.icon} />
        ) : (
          <MdKeyboardArrowDown className={styles.icon} />
        )}
      </div>
      {showMenu && (
        <div className={styles.menu}>
          {items.map((item, index) => {
            return (
              <div
                onClick={() => {
                  setSelectedValue(item);
                  onChange && onChange(item.value, name);
                }}
                key={item.value}
                style={{
                  background: getBackgroundColor(item, index),
                }}
                className={styles.item}>
                {item.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
