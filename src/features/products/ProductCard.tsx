import React from 'react';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addToCart } from '../cart/cartSlice';
import { ProductItem } from './types';

interface ProductCardProps {
  product: ProductItem;
  onAddedSuccess?: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddedSuccess,
}) => {
  const dispatch = useAppDispatch();

  // Đọc số lượng hiện có của sản phẩm này trong giỏ hàng từ Redux
  const cartItem = useAppSelector((state) =>
    state.cart.items.find((item) => item.id === product.id)
  );
  const currentInCart = cartItem ? cartItem.quantity : 0;
  const isOut = product.stock <= 0;
  const isMaxInCart = currentInCart >= product.stock;

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (isOut || isMaxInCart) return;

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
      })
    );

    if (onAddedSuccess) {
      onAddedSuccess(product);
    }
  };

  return (
    <div className="product-card">
      {/* Badge Tag sản phẩm */}
      {product.tag && (
        <span
          className={`product-badge-tag ${
            product.tag === 'Hot'
              ? 'tag-hot'
              : product.tag === 'Best Seller'
              ? 'tag-bestseller'
              : product.tag === 'Giảm giá'
              ? 'tag-sale'
              : 'tag-new'
          }`}
        >
          {product.tag}
        </span>
      )}

      {/* Ảnh sản phẩm */}
      <div className="product-card-media">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />
        <span className="product-category-chip">{product.category}</span>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="product-card-content">
        <div className="product-meta-row">
          <div className="product-rating">
            <Star className="w-3.5 h-3.5 fill-amber text-amber" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span className="product-sold">Đã bán {product.soldCount}</span>
        </div>

        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <p className="product-desc" title={product.description}>
          {product.description}
        </p>

        <div className="product-footer-row">
          <div className="product-pricing">
            <span className="product-price">{formatVND(product.price)}</span>
            <span className="product-stock-status">
              {isOut ? (
                <span className="text-danger">Hết hàng</span>
              ) : (
                <span>
                  Kho: <strong>{product.stock}</strong>
                  {currentInCart > 0 && (
                    <span className="in-cart-indicator">
                      {' '}(trong giỏ: {currentInCart})
                    </span>
                  )}
                </span>
              )}
            </span>
          </div>

          <button
            type="button"
            className={`add-to-cart-btn ${currentInCart > 0 ? 'in-cart' : ''}`}
            disabled={isOut || isMaxInCart}
            onClick={handleAddToCart}
            title={
              isOut
                ? 'Sản phẩm đã hết hàng'
                : isMaxInCart
                ? `Đã thêm tối đa số lượng tồn kho (${product.stock})`
                : 'Thêm vào giỏ hàng'
            }
          >
            {isOut ? (
              <span>Hết hàng</span>
            ) : isMaxInCart ? (
              <span>Đạt giới hạn</span>
            ) : currentInCart > 0 ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                <span>Thêm tiếp</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-1" />
                <span>Thêm giỏ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

