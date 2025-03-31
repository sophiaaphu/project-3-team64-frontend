import { OrderSubmission } from "../service/types";
import { orderService } from "../service/orderService";
import { useState } from "react";

export const useOrders = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitOrder = async (order: OrderSubmission) => {
        setLoading(true);
        setError(null);
        try {
            await orderService.submitOrder(order);
        } catch (err) {
            setError('Failed to submit order');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        submitOrder
    };
}