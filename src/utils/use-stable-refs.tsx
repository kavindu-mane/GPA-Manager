/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAxios } from "@/middleware";
import { useRef, useEffect } from "react";

export default function useStableRefs() {
  const axiosInstance = useAxios();
  const axiosRef = useRef(axiosInstance);

  useEffect(() => {
    axiosRef.current = axiosInstance;
  }, [axiosInstance]);

  return {
    axiosPrivateInstance: axiosRef,
  };
}
