import { createContext, useContext, useState } from "react";

type FavoriteItem = {
    id: number;
    title: string;
    brand: string;
    price: number;
    thumbnail: string;
    discountPercentage: number;
    rating: number;
    category: string;
};

type FavoritesContextType = {
    favorites: FavoriteItem[];
    addFavorite: (item: FavoriteItem) => void;
    removeFavorite: (id: number) => void;
    clearFavorites: () => void;
    isFavorite: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType>({
    favorites: [],
    addFavorite: () => {},
    removeFavorite: () => {},
    clearFavorites: () => {},
    isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    const addFavorite = (item: FavoriteItem) => {
        setFavorites((prev) => {
            if (prev.find((f) => f.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const removeFavorite = (id: number) => {
        setFavorites((prev) => prev.filter((f) => f.id !== id));
    };

    const clearFavorites = () => setFavorites([]);

    const isFavorite = (id: number) => favorites.some((f) => f.id === id);

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, clearFavorites, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => useContext(FavoritesContext);
