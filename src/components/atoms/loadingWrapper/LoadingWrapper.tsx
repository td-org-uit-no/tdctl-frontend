import React, { useState, HTMLAttributes } from 'react';
import Loading from '../loading/Loading';
import './loadingWrapper.scss';

export interface LoadingWrapperInterface
  extends HTMLAttributes<HTMLDivElement> {
  data: any;
  animation?: boolean;
  animationTime?: number;
}

// TODO smoother rendereing of component
const LoadingWrapper: React.FC<LoadingWrapperInterface> = ({
  data,
  animation = false,
  animationTime = 250,
  children,
  ...rest
}) => {
  // sets render to opposite to animation since animation true will need to explicit set
  // render for childeren to load and no animation will just render children when defined
  const [render, setRender] = useState<boolean>(false);

  var interval = setInterval(function () {
    if (data != null) {
      setRender(true);
      clearInterval(interval);
    }
  }, animationTime);

  if (animation && !render) {
    return (
      <div {...rest} style={{ alignItems: 'center' }}>
        <Loading />
      </div>
    );
  }

  return <div {...rest}>{render && <div>{children} </div>}</div>;
};

export default LoadingWrapper;
