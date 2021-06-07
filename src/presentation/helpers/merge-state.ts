import React from 'react';

export const mergeState = <T>(
  setter: React.Dispatch<React.SetStateAction<T>>,
  value: Partial<T> | ((currVal: T) => Partial<T>),
): void =>
  setter((currVal: T) => ({ ...currVal, ...(value instanceof Function ? value(currVal) : value) }));
