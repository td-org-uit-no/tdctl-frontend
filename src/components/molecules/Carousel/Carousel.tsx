import React, { useEffect, useState } from 'react';
import Button from 'components/atoms/button/Button';
import styles from './carousel.module.scss';

export const CarouselItem: React.FC<{ itemWidth: number; padding: number }> =
  ({ itemWidth, padding, children }) => {
    return (
      <div
        className={styles.carouselItem}
        style={{
          flex: `0 0 ${itemWidth - padding}%`,
          padding: `0 ${padding}% ${padding}% 0`,
        }}>
        {children}
      </div>
    );
  };

// TODO add row support

type itemRange = 1 | 2 | 3 | 4 | 5;

interface CarouselProps {
  title?: string;
  dir: 'column' | 'row';
  viewItems?: itemRange;
  spacing?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  title,
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
  const nItems = React.Children.count(children);

  const updateIndex = (newIdx: number) => {
    if (newIdx >= nSlides) {
      return;
    }
    if (newIdx < 0) {
      return;
    }
    setActiveIndex(newIdx);
  };

  // calculates the translation factor based on direction and the width of each item
  const calcCarouselVariables = () => {
    const nViewItems = viewItems ? viewItems : 3;
    const slides = Math.ceil(nItems / nViewItems);
    const width = 100 / nViewItems;
    setItemSize(width);
    setSlides(slides);

    if (dir === 'column') {
      // finds the height of a row in percentage
      const translateYlength = 100 / slides;
      setTransistionLength(translateYlength);
      return;
    }
    // always move 100% in x-direction
    setTransistionLength(100);
  };

  useEffect(() => {
    calcCarouselVariables();
  }, []);

  useEffect(() => {
    setTransformation(
      dir === 'column'
        ? `translateY(-${activeIndex * transitionLength}%)`
        : `translateX(-${activeIndex * transitionLength}%)`
    );
  }, [activeIndex]);

  return (
    <div className={styles.carouselContainer}>
      {title && <h4>{title}</h4>}
      <div className={styles.carousel}>
        <div
          className={styles.inner}
          style={{
            transform: transformation,
            flexWrap: dir === 'column' ? 'wrap' : undefined,
          }}>
          {React.Children.map(children, (child, index) => {
            return (
              <CarouselItem itemWidth={itemSize} padding={itemSize*0.2}>
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
          paddingTop: '2.5%',
          paddingBottom: '5%',
        }}>
        <Button version="primary" onClick={() => updateIndex(activeIndex - 1)}>
          prev
        </Button>
        <Button version="primary" onClick={() => updateIndex(activeIndex + 1)}>
          next
        </Button>
      </div>
    </div>
  );
};

export default Carousel;
