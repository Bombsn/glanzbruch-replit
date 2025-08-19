import { useState, useEffect, useRef } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  startDelay?: number;
  trigger?: boolean;
}

export const useTypewriter = ({ 
  text, 
  speed = 50, 
  startDelay = 0, 
  trigger = false 
}: UseTypewriterOptions) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!trigger) {
      setDisplayText('');
      setIsComplete(false);
      return;
    }

    // Clear any existing timeouts/intervals
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Reset state
    setDisplayText('');
    setIsComplete(false);

    // Start typing after delay
    timeoutRef.current = setTimeout(() => {
      let currentIndex = 0;
      
      intervalRef.current = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsComplete(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, speed);
    }, startDelay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, startDelay, trigger]);

  return { displayText, isComplete };
};
