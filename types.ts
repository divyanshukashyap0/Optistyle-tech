
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: 'Men' | 'Women' | 'Kids' | 'Luxury';
  image: string;
  description: string;
  colors: string[];
  materials: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Paid' | 'Shipped';
  customerEmail: string;
}

export interface User {
  email: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
