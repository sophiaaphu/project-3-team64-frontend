import { useState, useCallback, useEffect } from "react";
import { extrasService } from "../service/extrasService";
import { Extra } from "../service/types";

export const useExtras = () => {
    const [extras, setExtras] = useState<Extra[]>([]);
    const [loading, setLoading] = useState(true); // Start with loading true
    const [error, setError] = useState<string | null>(null);

    const fetchExtras = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await extrasService.getExtras();
            setExtras(data);
        }
        catch(err) {
            setError('failed to fetch extras');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }, []);

    // Fetch extras on mount
    useEffect(() => {
        fetchExtras();
    }, [fetchExtras]);

    return {
        extras,
        loading,
        error,
        fetchExtras
    };
};