import React, { useEffect, useRef, useState } from 'react';
import styles from './carousel.module.scss';
import Icon from 'components/atoms/icons/icon';
import { useMobileScreen } from 'hooks/useCheckMobileScreen';
import { use } from 'echarts';

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
        padding: `0 ${padding}% 5%`,
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

const Carousel: React.FC<CarouselProps> = ({
  title,
  height,
  dir,
  viewItems,
  spacing,
  children,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchPosition, setTouchPosition] = useState<number | null>(null);
  const [transformation, setTransformation] = useState('');
  const [nSlides, setSlides] = useState(0);
  const [itemSize, setItemSize] = useState(0);
  const [transitionLength, setTransistionLength] = useState(0);
  const itemRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileScreen();

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
    console.log(itemRef.current?.offsetHeight);
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
        setTransistionLength(itemRef.current?.offsetHeight ?? 100);
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
        ? `translateY(-${activeIndex * transitionLength}px)`
        : `translateX(-${activeIndex * transitionLength}%)`
    );
  }, [activeIndex, dir, transitionLength]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchDown = e.touches[0].clientY;
    setTouchPosition(touchDown);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchDown = touchPosition;

    if (touchDown === null) {
      return;
    }

    const currentTouch = e.touches[0].clientY;
    const diff = touchDown - currentTouch;

    if (diff > 5) {
      updateIndex(activeIndex + 1);
    }

    if (diff < -5) {
      updateIndex(activeIndex - 1);
    }
    setTouchPosition(null);
  };

  return (
    <div className={styles.carouselContainer}>
      {title && <h4>{title}</h4>}
      <div
        className={styles.carousel}
        style={{ height: height, touchAction: isMobile ? 'none' : 'auto' }}
        ref={itemRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}>
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
      <div className={styles.carouselButtonsContainer}>
        <div>
          <Icon
            type={isMobile ? 'angle-double-up' : 'angle-double-left'}
            size={isMobile ? 2 : 1.5}
            onClick={() => updateIndex(activeIndex - 1)}
          />
          <Icon
            type={isMobile ? 'angle-double-down' : 'angle-double-right'}
            size={isMobile ? 2 : 1.5}
            onClick={() => updateIndex(activeIndex + 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
