import { useEffect, useRef } from "react";

type InfiniteScrollProps = {
  callback: () => void;
  loading: boolean;
  hasMore: boolean;
};
function useInfiniteScroll({
  callback,
  loading,
  hasMore,
}: InfiniteScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          callback();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [loading, hasMore, callback]);
  return { ref };
}

export default useInfiniteScroll;
