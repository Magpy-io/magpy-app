import React, { ReactNode } from 'react';

type PropsType = {
  children: ReactNode;
};

export const LocalServersEffects: React.FC<PropsType> = props => {
  return props.children;
};
