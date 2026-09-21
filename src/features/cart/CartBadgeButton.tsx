import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setCartOpen } from './cartSlice';

export const CartBadgeButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);

  return (
    <button
      type="button"
      className="cart-badge-button"
      onClick={() => dispatch(setCartOpen(true))}
      aria-label={`Giỏ hàng: ${totalQuantity} sản phẩm`}
      title="Xem giỏ hàng của bạn"
    >
      <div className="cart-icon-wrapper">
        <ShoppingCart className="w-5 h-5 cart-icon" />
        {totalQuantity > 0 && (
          <span className="cart-badge-count animate-bounce-short">
            {totalQuantity > 99 ? '99+' : totalQuantity}
          </span>
        )}
      </div>
      <span className="cart-badge-text">Giỏ hàng</span>
    </button>
  );
};

