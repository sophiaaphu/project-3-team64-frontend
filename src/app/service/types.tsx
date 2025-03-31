export interface DrinkCategory {
    drink_category_id: number;
    drink_category_name: string;
}

export interface Drink {
    drink_id: number;
    drink_category_id: DrinkCategory;
    drink_name: string;
    drink_price: number;
    active_months: string | null;
}

export interface ExtraCategory {
    extra_category_id: number;
    extra_category_name: string;
}

export interface Extra {
    extra_id: number;
    extra_category_id: ExtraCategory;
    extra_name: string;
    extra_price: number;
}

export interface OrderSubmission {
    totalPrice: number;
    customerName: string;
    employeeId: number;
    paymentMethod: string;
    drinks: Array<{
      drink_id: number;
      toppings: number[];
    }>;
  }