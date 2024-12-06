"use client";

import { Banner, Button, Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";
import { MdAnnouncement } from "react-icons/md";
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
  return (
    <div className="space-y-4">
      {showToast && (
        <Banner>
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
