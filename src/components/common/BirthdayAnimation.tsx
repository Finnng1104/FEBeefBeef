/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import create from "react-canvas-confetti";

interface BirthdayAnimationProps {
  username: string;
  onComplete?: () => void;
  isVisible: boolean;
}

const BirthdayAnimation = ({
  username,
  onComplete,
  isVisible,
}: BirthdayAnimationProps) => {
  const [visible, setVisible] = useState(true);
  const canvasInstance = useRef<any>(null);

  const fireRealistic = useCallback(() => {
    if (!canvasInstance.current) return;
    canvasInstance.current({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
    });
  }, []);

  const fireFireworks = useCallback(() => {
    if (!canvasInstance.current) return;
    canvasInstance.current({
      particleCount: 100,
      spread: 360,
      startVelocity: 40,
      origin: { y: 0.5 },
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !canvasInstance.current) {
      canvasInstance.current = create({});
    }

    if (isVisible) {
      setVisible(true);
      fireRealistic();
      fireFireworks();
      const interval = setInterval(() => {
        fireRealistic();
        fireFireworks();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [fireRealistic, fireFireworks, isVisible]);

  const handleThankYouClick = () => {
    setVisible(false);
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-85">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <motion.h1
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 1.5,
                }}
                className="text-5xl font-bold text-secondaryColor mb-4"
              >
                🎉 Happy Birthday! 🎉
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-3xl text-white font-semibold"
              >
                {username}
                <p className="mt-2 text-lg text-secondaryColor">
                  Chúc {username} luôn ngon miệng, vui vẻ và tràn đầy hương vị
                  hạnh phúc!
                </p>
              </motion.div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                onClick={handleThankYouClick}
                className="mt-8 px-6 py-2 bg-secondaryColor text-black rounded-full hover:bg-yellow-500 transition-colors"
              >
                Thank you!
              </motion.button>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BirthdayAnimation;
