import React, { useState, useEffect, useRef } from 'react';

/**
 * CLEAN DEVELOPER-GRADE PAGE TRANSITION
 * Fast, elegant 160ms crossfade with zero lag or blocking canvases.
 */
export default function PageTransition({ pageKey, children }) {
  const [opacity, setOpacity] = useState(1);
  const [displayChildren, setDisplayChildren] = useState(children);
  const prevKeyRef = useRef(pageKey);

  useEffect(() => {
    if (prevKeyRef.current !== pageKey) {
      prevKeyRef.current = pageKey;
      setOpacity(0.4);

      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setOpacity(1);
      }, 70);

      return () => clearTimeout(timeout);
    } else {
      setDisplayChildren(children);
    }
  }, [pageKey, children]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      opacity,
      transition: 'opacity 0.14s ease-out',
      overflow: 'hidden'
    }}>
      {displayChildren}
    </div>
  );
}
