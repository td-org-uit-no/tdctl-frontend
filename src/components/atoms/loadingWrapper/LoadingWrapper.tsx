import React, { useState, HTMLAttributes, useEffect } from 'react';
import Loading from '../loading/Loading';

export interface LoadingWrapperInterface
  extends HTMLAttributes<HTMLDivElement> {
  data: any;
  animation?: boolean;
  // option to make animation trigger after n milliseconds
  startAfter?: number;
  animationTime?: number;
}

// TODO smoother rendering of component
// Render components after data is fetched
// animationTime -> ensures that the loading animation is displayed for minimum "animationTime" milliseconds (only if animation is true)
// startAfter -> if > 0 the render animation starts after "startAfter" milliseconds (only if animation is true)
const LoadingWrapper: React.FC<LoadingWrapperInterface> = ({
  data,
  animation = true,
  animationTime = 250,
  startAfter = 0,
  children,
  ...rest
}) => {
  // sets render to opposite to animation since animation true will need to explicit set
  // render for childeren to load and no animation will just render children when defined
  const [render, setRender] = useState<boolean>(false);
  const [animationRender, setAnimationRender] = useState<boolean>(false);
  const [animationDone, setAnimationDone] = useState<boolean>(
    animation === false
  );

  useEffect(() => {
    // Render if we have data and the animation is either finished or not started
    if (data != null && (animationDone || !animationRender)) {
      setRender(true);
    }
  }, [data, animationDone, animationRender]);

  useEffect(() => {
    if (!animation) {
      return;
    }
    const timeout = setTimeout(function () {
      setAnimationDone(true);
    }, animationTime);

    return () => clearTimeout(timeout);
  }, [animationRender, animation, animationTime]);

  useEffect(() => {
    const timeout = setTimeout(function () {
      setAnimationRender(true);
    }, startAfter);

    return () => clearTimeout(timeout);
  }, [startAfter]);

  if (animationRender && !render) {
    return (
      <div {...rest} style={{ alignItems: 'center' }}>
        <Loading />
      </div>
    );
  }

  return <div {...rest}>{render && <div {...rest}>{children} </div>}</div>;
};

export default LoadingWrapper;
