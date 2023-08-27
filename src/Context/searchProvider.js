import { searchContext } from "./search-context";
import { useState } from "react";

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