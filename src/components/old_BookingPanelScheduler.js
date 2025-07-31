import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import BookingPanel from "./BookingPanel";

const BookingPanelScheduler = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const showCount = useRef(0);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.push(
      setTimeout(() => setIsOpen(true), 2000)
    );
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    showCount.current += 1;
    if (showCount.current === 1) {
      timers.current.push(
        setTimeout(() => setIsOpen(true), 3000)
      );
    } else if (showCount.current === 2) {
      timers.current.push(
        setTimeout(() => setIsOpen(true), 5000)
      );
    }
    // No more appearances after third show
  };

  // Allow parent to open the panel manually
  useImperativeHandle(ref, () => ({
    openPanel: () => setIsOpen(true)
  }));

  return <BookingPanel isOpen={isOpen} onClose={handleClose} />;
});

export default BookingPanelScheduler;
