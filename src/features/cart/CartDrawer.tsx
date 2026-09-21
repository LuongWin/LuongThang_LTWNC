import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  CheckCircle2,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setCartOpen, clearCart } from './cartSlice';
import { CartItemRow } from './CartItemRow';
import './CartDrawer.css';

export const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, totalQuantity, totalAmount, isOpen } = useAppSelector(
    (state) => state.cart
  );

  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);

  // Phí vận chuyển: Miễn phí cho đơn hàng từ 5.000.000đ trở lên, còn lại 30.000đ
  const shippingFee = totalAmount === 0 ? 0 : totalAmount >= 5000000 ? 0 : 30000;
  const finalTotal = totalAmount + shippingFee;

  // Format tiền tệ VND
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Đóng drawer khi nhấn ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(setCartOpen(false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dispatch]);

  // Ngăn cuộn body khi mở drawer
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setCheckoutSuccess(false);
      setIsCheckingOut(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      dispatch(clearCart());
    }, 1000);
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xoá tất cả sản phẩm khỏi giỏ hàng?')) {
      dispatch(clearCart());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-backdrop" onClick={() => dispatch(setCartOpen(false))}>
      <div
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title-group">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <h3 id="cart-title" className="cart-drawer-title">
              Giỏ Hàng Của Bạn
            </h3>
            <span className="cart-count-badge">
              {totalQuantity} {totalQuantity === 1 ? 'món' : 'món'}
            </span>
          </div>

          <button
            type="button"
            className="cart-close-btn"
            onClick={() => dispatch(setCartOpen(false))}
            aria-label="Đóng giỏ hàng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="cart-drawer-body">
          {checkoutSuccess ? (
            /* Thông báo thanh toán thành công */
            <div className="cart-success-state">
              <div className="cart-success-icon-wrapper">
                <CheckCircle2 className="w-16 h-16 text-emerald" />
              </div>
              <h3>Đặt Hàng Thành Công!</h3>
              <p>
                Cảm ơn bạn đã mua hàng tại hệ thống. Đơn hàng của bạn đang được xử lý và sẽ
                được giao trong thời gian sớm nhất.
              </p>
              <div className="cart-success-features">
                <div className="feature-pill">
                  <Truck className="w-4 h-4" /> Giao hàng hỏa tốc
                </div>
                <div className="feature-pill">
                  <ShieldCheck className="w-4 h-4" /> Bảo hành chính hãng
                </div>
              </div>
              <button
                type="button"
                className="cart-btn-primary"
                onClick={() => {
                  setCheckoutSuccess(false);
                  dispatch(setCartOpen(false));
                }}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : items.length === 0 ? (
            /* Trạng thái giỏ hàng trống */
            <div className="cart-empty-state">
              <div className="cart-empty-icon-circle">
                <ShoppingBag className="w-12 h-12" />
              </div>
              <h4 className="empty-title">Giỏ hàng của bạn đang trống</h4>
              <p className="empty-desc">
                Chưa có sản phẩm nào được chọn. Hãy khám phá danh sách sản phẩm công nghệ tuyệt vời và thêm vào giỏ nhé!
              </p>
              <button
                type="button"
                className="cart-btn-secondary"
                onClick={() => dispatch(setCartOpen(false))}
              >
                Khám phá sản phẩm ngay
              </button>
            </div>
          ) : (
            /* Danh sách các mặt hàng trong giỏ */
            <div className="cart-items-list">
              <div className="cart-items-header-bar">
                <span>Danh sách ({items.length} loại sản phẩm)</span>
                <button
                  type="button"
                  className="cart-clear-all-btn"
                  onClick={handleClearAll}
                  title="Dọn sạch giỏ hàng"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Xoá tất cả
                </button>
              </div>

              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer (chỉ hiển thị khi có sản phẩm và chưa thanh toán thành công) */}
        {!checkoutSuccess && items.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Thanh tiến trình Free Shipping */}
            <div className="cart-shipping-incentive">
              {totalAmount >= 5000000 ? (
                <div className="shipping-badge free">
                  🎉 Bạn được <strong>Miễn phí vận chuyển</strong> cho đơn hàng này!
                </div>
              ) : (
                <div className="shipping-badge standard">
                  Mua thêm <strong>{formatVND(5000000 - totalAmount)}</strong> để được <strong>Freeship</strong>!
                </div>
              )}
            </div>

            {/* Bảng tính tổng */}
            <div className="cart-summary-rows">
              <div className="summary-row">
                <span className="summary-label">Tạm tính ({totalQuantity} món):</span>
                <span className="summary-val">{formatVND(totalAmount)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Phí vận chuyển:</span>
                <span className="summary-val">
                  {shippingFee === 0 ? (
                    <span className="text-free">Miễn phí</span>
                  ) : (
                    formatVND(shippingFee)
                  )}
                </span>
              </div>
              <div className="summary-row summary-total-row">
                <span className="summary-label">Tổng thanh toán:</span>
                <span className="summary-total-val">{formatVND(finalTotal)}</span>
              </div>
            </div>

            {/* Nút thanh toán */}
            <button
              type="button"
              className="cart-checkout-btn"
              disabled={isCheckingOut}
              onClick={handleCheckout}
            >
              {isCheckingOut ? (
                <>
                  <div className="cart-spinner" />
                  <span>Đang xử lý đơn hàng...</span>
                </>
              ) : (
                <>
                  <span>Tiến hành thanh toán</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

