import { Toast } from "flowbite-react";
import React from "react";
import { HiFire } from "react-icons/hi";

interface props {
  showToast: boolean;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PopUpToast({ showToast, setShowToast }: props) {
  return (
    <>
      {showToast && (
        <Toast className="fixed right-4 top-4 z-50 w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
            <HiFire className="size-5" />
          </div>
          <div className="ml-3 text-sm font-normal">
            &quot;New notification&quot;
          </div>
          <Toast.Toggle onClick={() => setShowToast(false)} />
        </Toast>
      )}
    </>
  );
}
