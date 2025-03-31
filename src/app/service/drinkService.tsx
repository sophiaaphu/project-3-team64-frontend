import api from './api';
import { Drink, DrinkCategory } from './types';

export const drinkService = {

    // drinks endpoints
    getDrinks: () => {
        return api.get<Drink[]>('/drinks').then(res => res.data);
    },

    //drinkcategories endpoints
    
    getDrinkCategories : () => {
        return api.get<DrinkCategory[]>('/drink-categories').then(res => res.data);
    }


}