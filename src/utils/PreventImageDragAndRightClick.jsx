import { useEffect } from "react";

const PreventImageDragAndRightClick = () => {
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
      }
    };

    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.setAttribute("draggable", "false");
    });

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return null;
};

export default PreventImageDragAndRightClick;
