import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  updateQuantity,
} from './cartSlice';
import { CartItem } from './types';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const dispatch = useAppDispatch();

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const isMaxStock = item.quantity >= item.stock;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      dispatch(updateQuantity({ id: item.id, quantity: val }));
    }
  };

  return (
    <div className="cart-item-row">
      <img
        src={item.image}
        alt={item.name}
        className="cart-item-image"
        loading="lazy"
      />

      <div className="cart-item-info">
        <div className="cart-item-top">
          <span className="cart-item-category">{item.category}</span>
          <button
            type="button"
            className="cart-item-delete-btn"
            onClick={() => dispatch(removeFromCart(item.id))}
            title={`Xoá ${item.name} khỏi giỏ hàng`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <h4 className="cart-item-title" title={item.name}>
          {item.name}
        </h4>

        <div className="cart-item-price-row">
          <span className="cart-item-unit-price">{formatVND(item.price)}</span>
        </div>

        <div className="cart-item-actions">
          {/* Bộ điều khiển tăng / giảm số lượng */}
          <div className="cart-qty-controller">
            <button
              type="button"
              className="cart-qty-btn"
              onClick={() => dispatch(decrementQuantity(item.id))}
              title="Giảm số lượng"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min={1}
              max={item.stock}
              value={item.quantity}
              onChange={handleInputChange}
              className="cart-qty-input"
              aria-label="Số lượng sản phẩm"
            />
            <button
              type="button"
              className="cart-qty-btn"
              onClick={() => dispatch(incrementQuantity(item.id))}
              disabled={isMaxStock}
              title={isMaxStock ? `Đã đạt giới hạn tồn kho (${item.stock})` : 'Tăng số lượng'}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Thành tiền của món này */}
          <div className="cart-item-subtotal">
            {formatVND(item.price * item.quantity)}
          </div>
        </div>

        {isMaxStock && (
          <div className="cart-stock-warning">
            ⚠️ Đã đạt giới hạn tồn kho ({item.stock} sản phẩm)
          </div>
        )}
      </div>
    </div>
  );
};

