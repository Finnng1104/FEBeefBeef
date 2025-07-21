/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactCanvasConfetti from "react-canvas-confetti";

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
  const refAnimationInstance = useRef<any>(null);

  // Hàm bắn confetti
  const makeShot = useCallback((particleRatio: number, opts: any) => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.6 },
        particleCount: Math.floor(200 * particleRatio),
      });
    }
  }, []);

  const fireRealistic = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    makeShot(0.2, {
      spread: 60,
    });
    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  const fireFireworks = useCallback(() => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current({
        particleCount: 100,
        spread: 360,
        startVelocity: 40,
        origin: { y: 0.5 },
      });
    }
  }, []);

  // Lưu instance của confetti
  const handleInit = useCallback((params: { confetti: any }) => {
    refAnimationInstance.current = params.confetti;
  }, []);

  useEffect(() => {
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
          <ReactCanvasConfetti
            onInit={handleInit}
            style={{
              position: "fixed",
              pointerEvents: "none",
              width: "100vw",
              height: "100vh",
              top: 0,
              left: 0,
            }}
          />
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
