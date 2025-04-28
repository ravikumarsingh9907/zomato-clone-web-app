import { useState } from "react";
import { createContext } from "react";

export const searchContext = createContext({});

export default function SearchProvider(props) {
    const [isOpen, setIsOpen] = useState(false);

    const handleIsOpen = (value) => {
        setIsOpen(value);
    }

    const search = {
        isOpen,
        setIsOpen,
        handleIsOpen,
    }

    return (
        <searchContext.Provider value={search}>
            {props.children}
        </searchContext.Provider>
    )
}