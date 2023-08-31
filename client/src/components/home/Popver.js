import { useRef } from "react"
import { createPortal } from "react-dom";


const Popver = ({
    coords,
    position = "left",
    children,
}) => {
    if (typeof document === "undefined") return null;

    return createPortal(
        <div className="popver"
        style={{
            left: position === "right" ? coords.x + coords.width : coords.x,
            top: coords.y + coords.height * 1.5,
          }}
        >
            <ul>
                {
                    children
                }
                
            </ul>
        </div>,
        document.getElementById("root")
    )
}

export default Popver