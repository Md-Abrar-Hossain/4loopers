//auto-scroll logic hook

import { useEffect, useRef } from "react";

const useAutoScroll = (
  ref,
  scrollByValue,
  fanFavorites,
  setActiveIndex,
  autoRotate
) => {
  const currentIndexRef = useRef(0);
  const pauseRef = useRef(false);
  const interactionTimeoutRef = useRef(null);

  useEffect(() => {
    if (!autoRotate || fanFavorites.length === 0) return;

    const scrollElement = ref.current;
    if (!scrollElement) return;

    const pause = () => {
      pauseRef.current = true;
      if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = setTimeout(() => {
        pauseRef.current = false;
      }, 3000);
    };

    scrollElement.addEventListener("mouseenter", pause);
    scrollElement.addEventListener("scroll", pause);

    const interval = setInterval(() => {
      if (pauseRef.current) return;

      if (!scrollElement) return;

      scrollElement.scrollBy({ left: scrollByValue, behavior: "smooth" });

      let nextIndex = currentIndexRef.current + 1;
      if (nextIndex >= fanFavorites.length) {
        nextIndex = 0;
        setTimeout(() => {
          scrollElement.scrollTo({ left: 0, behavior: "auto" });
        }, 300);
      }
      currentIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }, 3000);

    return () => {
      clearInterval(interval);
      scrollElement.removeEventListener("mouseenter", pause);
      scrollElement.removeEventListener("scroll", pause);
      if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    };
  }, [autoRotate, fanFavorites.length, ref, scrollByValue, setActiveIndex]);
};

export default useAutoScroll;
