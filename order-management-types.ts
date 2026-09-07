// Enum cho trạng thái đơn hàng
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

// Interface cơ bản cho Product
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface cơ bản cho Customer
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: Date;
}

// Dùng Pick để lấy những thông tin cần thiết của Product khi đưa vào OrderItem
// Tránh việc lưu lại toàn bộ properties không cần thiết của Product trong lịch sử đơn hàng
export type OrderProductSnapshot = Pick<Product, 'id' | 'name' | 'price'>;

export interface OrderItem {
  id: string;
  product: OrderProductSnapshot;
  quantity: number;
  totalPrice: number; // = product.price * quantity
}

export interface Order {
  id: string;
  // Dùng Omit để lấy thông tin Customer nhưng bỏ qua thông tin nhạy cảm/không cần thiết (như registrationDate)
  customer: Omit<Customer, 'registrationDate'>;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- UTILIZING UTILITY TYPES CHO CÁC DTO (Data Transfer Objects) ---

// Sử dụng Omit để tạo type cho thao tác Tạo Đơn Hàng mới.
// Khi tạo mới, hệ thống tự sinh id, createdAt, updatedAt, và status mặc định nên không cần người dùng gửi lên.
export type CreateOrderDTO = Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>;

// Sử dụng Partial kết hợp để tạo type cho thao tác Cập nhật Đơn Hàng.
// Mọi trường đều có thể tùy chọn cập nhật (Partial)
export type UpdateOrderDTO = Partial<CreateOrderDTO> & { status?: OrderStatus };


// --- UTILIZING GENERICS CHO CẤU TRÚC DỮ LIỆU DÙNG CHUNG ---

// Generic Type cho các Response API tiêu chuẩn (Tái sử dụng cho Product, Customer, Order...)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: Date;
}

// Generic Type cho cấu trúc dữ liệu phân trang
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Generic Interface định nghĩa các phương thức CRUD cơ bản cho Service
export interface BaseService<T, CreateDTO, UpdateDTO> {
  getById(id: string): Promise<ApiResponse<T>>;
  getAll(page: number, pageSize: number): Promise<ApiResponse<PaginatedData<T>>>;
  create(data: CreateDTO): Promise<ApiResponse<T>>;
  update(id: string, data: UpdateDTO): Promise<ApiResponse<T>>;
  delete(id: string): Promise<ApiResponse<boolean>>;
}

// Áp dụng Generic Interface cho OrderService một cách rất gọn gàng
export type OrderService = BaseService<Order, CreateOrderDTO, UpdateOrderDTO>;
