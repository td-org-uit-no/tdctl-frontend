import React, { useEffect, useRef, useState } from 'react';
import styles from './carousel.module.scss';
import Icon from 'components/atoms/icons/icon';
import { useMobileScreen } from 'hooks/useMobileScreen';
import { useHistory } from 'react-router-dom';
import Button from 'components/atoms/button/Button';

export const CarouselItem: React.FC<{ itemWidth: number; padding: number }> = ({
  itemWidth,
  padding,
  children,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        flex: `0 0 ${itemWidth - 2 * padding}%`,
        padding: `0% ${padding}% 0%`,
      }}>
      <div className={styles.carouselItem}>{children}</div>
    </div>
  );
};

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
  // 12.5% of given space is used as spacing between items
  const itemSpaceConst = 0.125;

  const updateIndex = (newIdx: number) => {
    if (newIdx >= nSlides) {
      return;
    }
    if (newIdx < 0) {
      return;
    }
    setActiveIndex(newIdx);
  };

  const history = useHistory();
  const handleClick = () => {
    history.push('/eventoverview');
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

      setTransistionLength(100);
    }
    calcCarouselVariables();
  }, [children, dir, viewItems]);

  useEffect(() => {
    setTransformation(dir === 'column' ? 'translateY' : 'translateX');
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
      {title && <h4 className={styles.headerTitle}>{title}</h4>}
      <div
        className={styles.carousel}
        style={{ height: height, touchAction: isMobile ? 'none' : 'auto' }}
        ref={itemRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}>
        <div
          className={styles.inner}
          style={{
            // translate `translateLength` in x or y dir based on direction
            transform: `${transformation}(-${activeIndex * transitionLength}%)`,
            flexWrap: dir === 'column' ? 'wrap' : undefined,
          }}>
          {React.Children.map(children, (child) => {
            return (
              <CarouselItem
                itemWidth={itemSize}
                padding={spacing ? itemSize * itemSpaceConst : 0}>
                {child}
              </CarouselItem>
            );
          })}
        </div>
      </div>
      {isMobile && (
        <Button
          version="primary"
          className={styles.headerButton}
          onClick={handleClick}>
          Se Alle
        </Button>
      )}
      <div className={styles.carouselButtonsContainer}>
        <div>
          <Icon
            type={isMobile ? 'angle-double-up' : 'angle-double-left'}
            size={isMobile ? 2 : 1.5}
            onClick={() => updateIndex(activeIndex - 1)}
          />
          {!isMobile && (
            <Button
              version="primary"
              className={styles.headerButton}
              onClick={handleClick}>
              Se Alle
            </Button>
          )}
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
