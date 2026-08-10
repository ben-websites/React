import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CartContext } from "./CartDataContext";

const CART_STORAGE_KEY = "ben-store-cart";

function getSavedCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getSavedCart);
  const [storeOpen, setStoreOpen] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Get store settings
  useEffect(() => {
    async function fetchStoreSettings() {
      try {
        const res = await axios.get(
          "https://bens-store.vercel.app/settings"
        );

        if (res.data.success) {
          const isStoreOpen = res.data.data.storeOpen;

          setStoreOpen(isStoreOpen);

          // If store is closed, empty the customer's cart
          if (!isStoreOpen) {
            setCartItems([]);
            localStorage.removeItem(CART_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.log("Unable to load store settings", error);
      } finally {
        setSettingsLoading(false);
      }
    }

    fetchStoreSettings();
  }, []);

  // Save cart
  useEffect(() => {
    if (!storeOpen) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cartItems)
    );
  }, [cartItems, storeOpen]);

  function addToCart(product) {
    // Store closed
    if (!storeOpen) {
      toast.error("The store is currently closed");
      return;
    }

    setCartItems((items) => {
      const alreadyInCart = items.some(
        (item) => item._id === product._id
      );

      if (alreadyInCart) {
        toast.error("This item is already in the cart");
        return items;
      }

      toast.success("Item added to cart");

      return [
        ...items,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(id) {
    setCartItems((items) =>
      items.filter((item) => item._id !== id)
    );

    toast.success("Item removed from cart");
  }

  function clearCart() {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    toast.success("Cart cleared");
  }

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        clearCart,
        storeOpen,
        settingsLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
