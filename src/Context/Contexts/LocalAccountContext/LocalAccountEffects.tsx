import React, { ReactNode, useEffect } from 'react';

type PropsType = {
  children: ReactNode;
};

export const LocalAccountEffects: React.FC<PropsType> = props => {
  useEffect(() => {}, []);

  return props.children;
};
