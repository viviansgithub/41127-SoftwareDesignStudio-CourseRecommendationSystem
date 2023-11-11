import React, { useEffect, useState } from 'react';
import './progressBar.scss';

export const ProgressBar = (props: any) => {
  const { loading, value } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 100);
    }
  }, [loading]);

  return (
    <div className="container">
      <div className="progress-bar">
        <div className={`progress-bar-fill ${isLoaded ? 'loaded' : ''}`}></div>
      </div>
      <div className="progress-label">{value}</div>
    </div>
  );
};
