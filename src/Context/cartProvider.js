import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export default function CartProvider({ children }) {
    const [cart, setCart] = useState({});

    const addToCart = (foodId) => {
        setCart((prevCart) => ({
            ...prevCart,
            [foodId]: (prevCart[foodId] || 0) + 1,
        }));
    };

    const removeFromCart = (foodId) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };
            if (updatedCart[foodId] > 1) {
                updatedCart[foodId] -= 1;
            } else {
                delete updatedCart[foodId];
            }
            return updatedCart;
        });
    };

    const getFoodQuantity = (foodId) => {
        return cart[foodId] || 0;
    };

    const getTotalQuantity = () => {
        return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, getFoodQuantity, getTotalQuantity }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}