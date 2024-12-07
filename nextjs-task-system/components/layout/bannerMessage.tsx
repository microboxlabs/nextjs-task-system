"use client";

import { Banner, Progress } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { useEffect, useState } from "react";

interface props {
  showToast: boolean;
  setShowToast: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      message: string;
      icon: "alert" | "warning" | "success" | "";
    }>
  >;
  message: string;
  icon: "alert" | "warning" | "success" | "";
}

export function DynamicBanner({
  showToast,
  setShowToast,
  icon,
  message,
}: props) {
  const [progress, setProgress] = useState(0); // Estado para el progreso

  useEffect(() => {
    if (showToast) {
      const startTime = Date.now(); // marks the start of the timers

      const timer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = Math.min((elapsedTime / 3000) * 100, 100); //  calculate the progress
        setProgress(newProgress);

        if (elapsedTime >= 3000) {
          clearInterval(timer);
        }
      }, 10);

      const hideToastTimer = setTimeout(() => {
        setShowToast({ icon: "", message: "", show: false });
      }, 3000);

      // clean the timers
      return () => {
        clearInterval(timer);
        clearTimeout(hideToastTimer);
      };
    }
  }, [showToast, setShowToast]);

  return (
    <div className="space-y-4">
      {showToast && (
        <Banner>
          <Progress progress={progress} />
          <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
            <div className="mx-auto flex items-center">
              <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                {icon === "success" ? (
                  <HiCheck className="size-5" />
                ) : icon === "warning" ? (
                  <HiX className="size-5" />
                ) : null}
                <span className="[&_p]:inline">{message}</span>
              </p>
            </div>
            <Banner.CollapseButton
              onClick={() =>
                setShowToast({ icon: "", message: "", show: false })
              }
              color="gray"
              className="border-0 bg-transparent text-gray-500 dark:text-gray-400"
            >
              <HiX className="size-4" />
            </Banner.CollapseButton>
          </div>
        </Banner>
      )}
    </div>
  );
}
