import React, { useEffect, useState, useRef } from "react";

interface StatisticCardProps {
  number: number;
  text: string;
  iconPath: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  number,
  text,
  iconPath,
}) => {
  const [clinicCount, setClinicCount] = useState(1);
  const actualClinicCount = number;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Adjust the threshold as needed
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      let count = 1;
      const interval = setInterval(() => {
        if (count < actualClinicCount) {
          count += 50;
          setClinicCount(count > actualClinicCount ? actualClinicCount : count);
        } else {
          clearInterval(interval);
        }
      }, 10); // Adjust the interval duration as needed

      return () => clearInterval(interval);
    }
  }, [isVisible, actualClinicCount]);

  return (
    // Statistic Card Container
    <div
      ref={ref}
      className="flex flex-row justify-center items-center space-x-4 font-bold text-white group transition-colors ease-in-out duration-1000"
    >
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-20 rounded-full border-2 text-white p-4 group-hover:bg-white group-hover:text-crimson transition-colors ease-in-out duration-500"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </svg>
      {/* Text Container */}
      <div className="flex flex-col justify-center items-center space-y-2 fonts-sans">
        {/* Number */}
        <p className="text-4xl">{clinicCount}</p>
        {/* Text */}
        <p className="text-lg font-serif">{text}</p>
      </div>
    </div>
  );
};

export default StatisticCard;
