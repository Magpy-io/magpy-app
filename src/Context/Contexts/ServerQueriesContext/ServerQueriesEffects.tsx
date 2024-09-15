import React, { ReactNode, useEffect } from 'react';

type PropsType = {
  children: ReactNode;
};

export const ServerQueriesEffects: React.FC<PropsType> = props => {
  useEffect(() => {}, []);

  return props.children;
};
