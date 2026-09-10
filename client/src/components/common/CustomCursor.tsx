import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, {
    stiffness: 450,
    damping: 30,
  });

  const springY = useSpring(mouseY, {
    stiffness: 450,
    damping: 30,
  });

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const interactiveElement = target.closest(
        "a, button, input, textarea, select, [data-cursor='interactive']"
      );

      setIsHovering(Boolean(interactiveElement));
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="custom-cursor-ring"
      style={{
        x: springX,
        y: springY,
      }}
      animate={{
        width: isHovering ? 52 : 34,
        height: isHovering ? 52 : 34,
        opacity: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    />
  );
};

export default CustomCursor;