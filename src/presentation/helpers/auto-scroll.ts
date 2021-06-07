import { useEffect, useRef } from 'react';

export const useAutoScroll = (trigger: any): React.MutableRefObject<HTMLElement> => {
  const scrollBottom = useRef<HTMLElement>(null);

  const scrollToBottom = (elem: HTMLElement): void => {
    const { top } = elem.getBoundingClientRect();
    if (top - 200 <= window.innerHeight) {
      elem?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom(scrollBottom.current);
  }, [trigger]);

  return scrollBottom;
};
