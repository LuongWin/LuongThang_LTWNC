import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState } from './types';

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  isOpen: false,
};

// Hàm phụ trợ tính toán lại tổng số lượng và tổng tiền ngay trong reducer
const recalculateTotals = (state: CartState) => {
  let totalQty = 0;
  let totalAmt = 0;
  for (const item of state.items) {
    totalQty += item.quantity;
    totalAmt += item.quantity * item.price;
  }
  state.totalQuantity = totalQty;
  state.totalAmount = totalAmt;
};

export interface AddToCartInput {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    stock: number;
  };
  quantity?: number;
}

export type AddToCartPayload = AddToCartInput | AddToCartInput['product'];

function isWrappedPayload(payload: AddToCartPayload): payload is AddToCartInput {
  return 'product' in payload;
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. Thêm sản phẩm vào giỏ hàng (cộng dồn và clamp theo stock)
    addToCart: (
      state,
      action: PayloadAction<AddToCartPayload>
    ) => {
      let product: AddToCartInput['product'];
      let quantityToAdd = 1;

      if (isWrappedPayload(action.payload)) {
        product = action.payload.product;
        quantityToAdd = action.payload.quantity ?? 1;
      } else {
        product = action.payload;
      }

      // Không thêm nếu hết hàng trong kho
      if (product.stock <= 0) return;

      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // Cộng dồn nhưng bị chặn tối đa bằng stock
        const desiredQuantity = existingItem.quantity + quantityToAdd;
        existingItem.quantity = Math.min(existingItem.stock, desiredQuantity);
      } else {
        // Sản phẩm mới, số lượng ban đầu được clamp giữa 1 và stock
        const initialQuantity = Math.min(product.stock, Math.max(1, quantityToAdd));
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.stock,
          quantity: initialQuantity,
        });
      }

      recalculateTotals(state);
    },

    // 2. Xoá một sản phẩm khỏi giỏ hàng
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      recalculateTotals(state);
    },

    // 3. Cập nhật số lượng sản phẩm trực tiếp (clamp theo stock: 1 <= quantity <= stock, nếu <= 0 thì xoá)
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          // Clamp số lượng không vượt quá số lượng hàng tồn kho
          existingItem.quantity = Math.min(existingItem.stock, Math.max(1, quantity));
        }
        recalculateTotals(state);
      }
    },

    // 4. Tăng 1 đơn vị sản phẩm (không vượt quá stock)
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
        recalculateTotals(state);
      }
    },

    // 5. Giảm 1 đơn vị sản phẩm (nếu về 0 thì tự động xoá khỏi giỏ)
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
        recalculateTotals(state);
      }
    },

    // 6. Xoá toàn bộ giỏ hàng
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },

    // 7. Quản lý trạng thái mở/đóng Drawer giỏ hàng
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
