export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  isOpen: boolean;
}

