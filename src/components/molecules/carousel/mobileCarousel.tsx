import React, { useEffect, useState } from 'react';
import styles from './mobilecarousel.module.scss';
import Icon from 'components/atoms/icons/icon';

export const CarouselItem: React.FC<{ itemWidth: number; padding: number }> = ({
  itemWidth,
  padding,
  children,
}) => {
  return (
    <div
      className={styles.carouselItem}
      style={{
        flex: `0 0 ${itemWidth - 2 * padding}%`,
        padding: `1% ${padding}% 1%`,
      }}>
      {children}
    </div>
  );
};

// TODO add row support

type itemRange = 1 | 2 | 3 | 4 | 5;

interface CarouselProps {
  title?: string;
  height: string;
  dir: 'column' | 'row';
  viewItems?: itemRange;
  spacing?: boolean;
}

const Verticalcarousel: React.FC<CarouselProps> = ({
  title,
  height,
  dir,
  viewItems,
  spacing,
  children,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transformation, setTransformation] = useState('');
  const [nSlides, setSlides] = useState(0);
  const [itemSize, setItemSize] = useState(0);
  const [transitionLength, setTransistionLength] = useState(0);

  const updateIndex = (newIdx: number) => {
    if (newIdx >= nSlides) {
      return;
    }
    if (newIdx < 0) {
      return;
    }
    setActiveIndex(newIdx);
  };

  // handle mount before data is fetched
  useEffect(() => {
    // calculates the translation factor based on direction and the width of each item
    function calcCarouselVariables() {
      const nItems = React.Children.count(children);
      const nViewItems = viewItems ? viewItems : 3;
      const slides = Math.ceil(nItems / nViewItems);
      const width = 100 / nViewItems;
      setItemSize(width);
      setSlides(slides);

      if (dir === 'column') {
        // TODO find a better solution
        setTransistionLength(100);
        return;
      }
      // always move 100% in x-direction
      setTransistionLength(100);
    }
    calcCarouselVariables();
  }, [children, dir, viewItems]);

  useEffect(() => {
    setTransformation(
      dir === 'column'
        ? `translateY(-${activeIndex * transitionLength}%)`
        : `translateX(-${activeIndex * transitionLength}%)`
    );
  }, [activeIndex, dir, transitionLength]);

  return (
    <div className={styles.carouselContainer}>
      {title && <h4>{title}</h4>}
      <div className={styles.carousel} style={{ height: height }}>
        <div
          className={styles.inner}
          style={{
            transform: transformation,
            flexWrap: dir === 'column' ? 'wrap' : undefined,
          }}>
          {React.Children.map(children, (child) => {
            return (
              <CarouselItem
                itemWidth={itemSize}
                padding={spacing ? itemSize * 0.125 : 0}>
                {child}
              </CarouselItem>
            );
          })}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '11%',
          paddingBottom: '5%',
        }}>
        <div>
          <Icon
            type={'angle-double-up'}
            size={2}
            onClick={() => updateIndex(activeIndex - 1)}
          />
          <Icon
            type={'angle-double-down'}
            size={2}
            onClick={() => updateIndex(activeIndex + 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default Verticalcarousel;