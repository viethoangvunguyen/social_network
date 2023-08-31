import { useEffect, useRef, useState } from "react";
function handleSetElementCoords(
  node,
  callback
) {
  const clientRect = node.getBoundingClientRect();
  callback({
    x: clientRect.left,
    y: clientRect.top + window?.scrollY,
    width: clientRect.width,
    height: clientRect.height,
  });
}
export default function useGetElementCoords() {
  const elmRef = useRef(null);
  const [coords, setCoords] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const handleGetElementCoords = (
    e
  ) => {
    handleSetElementCoords(e.target , setCoords);
  };
  useEffect(() => {
    function handleElementResize() {
      if (elmRef.current) {
        handleSetElementCoords(elmRef.current, setCoords);
      }
    }
    window.addEventListener("resize", handleElementResize);
    return () => {
      window.removeEventListener("resize", handleElementResize);
    };
  }, []);
  return {
    coords,
    elmRef,
    handleGetElementCoords,
  };
}