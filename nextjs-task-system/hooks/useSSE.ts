import { Task } from "@/types";
import { useEffect, useState } from "react";

export const useSSE = (url: string) => {
  const [data, setData] = useState<Task[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    eventSource.onerror = () => {
      console.error("SSE connection error");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return data;
};
