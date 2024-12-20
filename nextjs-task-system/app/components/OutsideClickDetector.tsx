import React, { useEffect, useRef } from "react";

interface Props {
  onOutsideClick: () => void;
  children: React.ReactNode;
}

const OutsideClickDetector: React.FC<Props> = ({
  onOutsideClick,
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onOutsideClick]);

  return <div ref={ref}>{children}</div>;
};

export default OutsideClickDetector;
