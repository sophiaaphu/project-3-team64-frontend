import { useState, useCallback } from "react";
import { drinkService } from "../service/drinkService";
import { Drink, DrinkCategory } from "../service/types";

export const useDrinks = () => {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDrinks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await drinkService.getDrinks();
            setDrinks(data);
        }
        catch(err) {
            setError('failed to fetch drinks');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }, []);

    return {
        drinks,
        loading,
        error,
        fetchDrinks
    };
};

export const useDrinkCategories = () => {
    const [drinkCategories, setDrinkCategories] = useState<DrinkCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDrinkCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await drinkService.getDrinkCategories();
            setDrinkCategories(data);
        }
        catch(err) {
            setError('failed to fetch categories');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }, []);

    return {
        drinkCategories,
        loading,
        error,
        fetchDrinkCategories
    };
};