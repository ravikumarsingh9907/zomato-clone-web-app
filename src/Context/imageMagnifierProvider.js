import { useState, useRef } from "react";

import { createContext } from "react";

const imageMagnifier = createContext({});

export {imageMagnifier};

export default function ImageMagnifier(props) {
    const [isOpen, SetIsOpen] = useState(false);
    const elementRef = useRef(null);

    const handleIsOpen = (value) => {
        SetIsOpen(value)
    }

    const data = {
        isOpen,
        handleIsOpen,
        elementRef,
    }

    return (
        <imageMagnifier.Provider value={data}>
            {props.children}
        </imageMagnifier.Provider>
    )
}