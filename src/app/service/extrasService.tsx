import api from './api';
import { Extra } from './types';

export const extrasService = {
    // extras/toppings endpoints
    getExtras: () => {
        return api.get<Extra[]>('/extras').then(res => res.data);
    },
}