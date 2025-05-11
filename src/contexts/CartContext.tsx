import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { CartResponse, CartItemRequest } from "@/types/cart.types";
import { CartService } from "@/services/cart.service";
import { useAppSelector } from "@/store/hooks";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { StorageService } from "@/services/storage.service";
import type { ProductResponse } from "@/types/product.types";
import type { UUID } from "crypto";

// Action types
type CartAction =
  | { type: "FETCH_CART_REQUEST" }
  | { type: "FETCH_CART_SUCCESS"; payload: CartResponse }
  | { type: "FETCH_CART_FAILURE"; payload: string }
  | { type: "ADD_TO_CART_REQUEST" }
  | {
      type: "ADD_TO_CART_SUCCESS";
      payload: CartResponse;
      product?: ProductResponse;
      quantity?: number;
    }
  | { type: "ADD_TO_CART_FAILURE"; payload: string }
  | { type: "UPDATE_QUANTITY_REQUEST"; payload: string }
  | { type: "UPDATE_QUANTITY_SUCCESS"; payload: CartResponse }
  | { type: "UPDATE_QUANTITY_FAILURE"; payload: string }
  | { type: "REMOVE_ITEM_REQUEST"; payload: string }
  | { type: "REMOVE_ITEM_SUCCESS"; payload: CartResponse }
  | { type: "REMOVE_ITEM_FAILURE"; payload: string }
  | { type: "CLEAR_CART_REQUEST" }
  | { type: "CLEAR_CART_SUCCESS" }
  | { type: "CLEAR_CART_FAILURE"; payload: string }
  | { type: "MERGE_CART_SUCCESS"; payload: CartResponse }
  | { type: "RESET_LAST_ADDED" }
  | { type: "CHECK_STOCK_QUANTITY"; productId: UUID; variantId?: UUID; stockQty: number };

interface CartContextProps {
  state: CartState;
  fetchCart: () => Promise<void>;
  addToCart: (
    item: CartItemRequest,
    productDetails?: ProductResponse
  ) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeGuestCart: () => Promise<void>;
  lastAddedProduct: ProductResponse | null;
  lastAddedQuantity: number;
  resetLastAdded: () => void;
  canAddToCart: (productId: UUID, variantId?: UUID, qty?: number) => boolean;
  getCartItemQuantity: (productId: UUID, variantId?: UUID) => number;
  getItemStockRemaining: (productId: UUID, variantId?: UUID) => number;
}

// State type
interface CartState {
  cart: CartResponse | null;
  loading: boolean;
  error: string | null;
  itemBeingAdded: boolean;
  itemBeingUpdated: string | null;
  itemBeingRemoved: string | null;
  lastAddedProduct: ProductResponse | null;
  lastAddedQuantity: number;
  stockQuantities: Record<string, number>; // productId-variantId -> quantity available
}

// Initial state
const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  itemBeingAdded: false,
  itemBeingUpdated: null,
  itemBeingRemoved: null,
  lastAddedProduct: null,
  lastAddedQuantity: 0,
  stockQuantities: {},
};

// Helper for creating composite keys for product-variant combinations
const getStockKey = (productId: UUID, variantId?: UUID): string => {
  return `${productId}${variantId ? `-${variantId}` : ''}`;
};

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "FETCH_CART_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_CART_SUCCESS":
      return { ...state, loading: false, cart: action.payload };
    case "FETCH_CART_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "ADD_TO_CART_REQUEST":
      return { ...state, itemBeingAdded: true, error: null };
    case "ADD_TO_CART_SUCCESS":
      return {
        ...state,
        itemBeingAdded: false,
        cart: action.payload,
        lastAddedProduct: action.product || null,
        lastAddedQuantity: action.quantity || 1,
      };
    case "ADD_TO_CART_FAILURE":
      return { ...state, itemBeingAdded: false, error: action.payload };
    case "RESET_LAST_ADDED":
      return { ...state, lastAddedProduct: null, lastAddedQuantity: 0 };

    case "UPDATE_QUANTITY_REQUEST":
      return { ...state, itemBeingUpdated: action.payload, error: null };
    case "UPDATE_QUANTITY_SUCCESS":
      return { ...state, itemBeingUpdated: null, cart: action.payload };
    case "UPDATE_QUANTITY_FAILURE":
      return { ...state, itemBeingUpdated: null, error: action.payload };

    case "REMOVE_ITEM_REQUEST":
      return { ...state, itemBeingRemoved: action.payload, error: null };
    case "REMOVE_ITEM_SUCCESS":
      return { ...state, itemBeingRemoved: null, cart: action.payload };
    case "REMOVE_ITEM_FAILURE":
      return { ...state, itemBeingRemoved: null, error: action.payload };

    case "CLEAR_CART_REQUEST":
      return { ...state, loading: true, error: null };
    case "CLEAR_CART_SUCCESS":
      return { ...state, loading: false, cart: null };
    case "CLEAR_CART_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "MERGE_CART_SUCCESS":
      return { ...state, cart: action.payload };
    
    case "CHECK_STOCK_QUANTITY": {
      const key = getStockKey(action.productId, action.variantId);
      return {
        ...state,
        stockQuantities: {
          ...state.stockQuantities,
          [key]: action.stockQty
        }
      };
    }

    default:
      return state;
  }
};

const CartContext = createContext<CartContextProps | undefined>(undefined);

// Provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { t } = useTranslation("cart");
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch cart on mount and when auth state changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  // Fetch cart
  const fetchCart = async () => {
    dispatch({ type: "FETCH_CART_REQUEST" });
    try {
      const cart = await CartService.getCart();
      dispatch({ type: "FETCH_CART_SUCCESS", payload: cart });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch({ type: "FETCH_CART_FAILURE", payload: "Failed to fetch cart" });
    }
  };

  // Check if more of a product can be added to cart
  const canAddToCart = (productId: UUID, variantId?: UUID, qty = 1): boolean => {
    const key = getStockKey(productId, variantId);
    const stockQty = state.stockQuantities[key] || 0;
    
    // If we don't have stock info, assume we can add
    if (stockQty === 0 && !Object.keys(state.stockQuantities).includes(key)) {
      return true;
    }
    
    // Get current quantity in cart
    const cartQty = getCartItemQuantity(productId, variantId);
    
    // Check if adding qty would exceed stock
    return cartQty + qty <= stockQty;
  };
  
  // Get current quantity of an item in cart
  const getCartItemQuantity = (productId: UUID, variantId?: UUID): number => {
    if (!state.cart || !state.cart.items) return 0;
    
    const cartItem = state.cart.items.find(item => {
      if (variantId) {
        return item.productId === productId && item.variantId === variantId;
      }
      return item.productId === productId && !item.variantId;
    });
    
    return cartItem?.quantity || 0;
  };
  
  // Get remaining stock for a product
  const getItemStockRemaining = (productId: UUID, variantId?: UUID): number => {
    const key = getStockKey(productId, variantId);
    const stockQty = state.stockQuantities[key] || 0;
    const cartQty = getCartItemQuantity(productId, variantId);
    
    return Math.max(0, stockQty - cartQty);
  };

  // Add item to cart
  const addToCart = async (item: CartItemRequest, productDetails?: ProductResponse) => {
    // Check stock quantities before adding
    if (productDetails) {
      // Determine stock quantity from product or variant
      let stockQty = productDetails.stockQuantity || 0;
      if (item.variantId && productDetails.variants) {
        const variant = productDetails.variants.find(v => v.id === item.variantId);
        if (variant) {
          stockQty = variant.stockQuantity;
        }
      }
      
      // Store stock quantity for future reference
      dispatch({
        type: "CHECK_STOCK_QUANTITY",
        productId: item.productId,
        variantId: item.variantId,
        stockQty
      });
      
      // Check if adding would exceed stock
      const currentQty = getCartItemQuantity(item.productId, item.variantId);
      if (currentQty + item.quantity > stockQty) {
        message.warning(t('notifications.quantity_exceeds_stock'));
        return;
      }
    }
    
    dispatch({ type: 'ADD_TO_CART_REQUEST' });
    try {
      const updatedCart = await CartService.addItemToCart(item);
      dispatch({ 
        type: 'ADD_TO_CART_SUCCESS', 
        payload: updatedCart,
        product: productDetails,
        quantity: item.quantity
      });
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch({ type: 'ADD_TO_CART_FAILURE', payload: 'Failed to add item to cart' });
      message.error(t('notifications.error_adding'));
    }
  };
  
  // Reset last added product
  const resetLastAdded = () => {
    dispatch({ type: 'RESET_LAST_ADDED' });
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    // Find the cart item to get product info
    const cartItem = state.cart?.items.find(item => item.id === itemId);
    if (cartItem) {
      // Check against stock quantity
      const key = getStockKey(cartItem.productId, cartItem.variantId);
      const stockQty = state.stockQuantities[key];
      
      if (stockQty !== undefined && quantity > stockQty) {
        message.warning(t('notifications.quantity_exceeds_stock'));
        return;
      }
    }
    
    dispatch({ type: "UPDATE_QUANTITY_REQUEST", payload: itemId });
    try {
      const updatedCart = await CartService.updateCartItemQuantity(
        itemId,
        quantity
      );
      dispatch({ type: "UPDATE_QUANTITY_SUCCESS", payload: updatedCart });
      message.success(t("notifications.cart_updated"));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch({
        type: "UPDATE_QUANTITY_FAILURE",
        payload: "Failed to update quantity",
      });
      message.error("Failed to update quantity");
    }
  };

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM_REQUEST", payload: itemId });
    try {
      const updatedCart = await CartService.removeCartItem(itemId);
      dispatch({ type: "REMOVE_ITEM_SUCCESS", payload: updatedCart });
      message.success(t("notifications.item_removed"));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch({
        type: "REMOVE_ITEM_FAILURE",
        payload: "Failed to remove item",
      });
      message.error("Failed to remove item");
    }
  };

  // Clear cart
  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART_REQUEST" });
    try {
      await CartService.clearCart();
      dispatch({ type: "CLEAR_CART_SUCCESS" });
      message.success(t("notifications.cart_cleared"));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch({ type: "CLEAR_CART_FAILURE", payload: "Failed to clear cart" });
      message.error("Failed to clear cart");
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      mergeGuestCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Merge guest cart with user cart after login
  const mergeGuestCart = async () => {
    if (!isAuthenticated) return;

    const guestId = StorageService.getItem<string>("guest_id");
    if (!guestId) return;

    try {
      const mergedCart = await CartService.mergeGuestCart();
      dispatch({ type: "MERGE_CART_SUCCESS", payload: mergedCart });
      // Clear the guest ID after successful merge
      StorageService.removeItem("guest_id");
    } catch (error) {
      console.error("Error merging carts:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        state,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        mergeGuestCart,
        lastAddedProduct: state.lastAddedProduct,
        lastAddedQuantity: state.lastAddedQuantity,
        resetLastAdded,
        canAddToCart,
        getCartItemQuantity,
        getItemStockRemaining
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};