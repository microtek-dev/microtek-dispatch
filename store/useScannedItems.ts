import { create } from 'zustand';

interface ScannedItemsState {
	scannedItems: string[];
	addScannedItems: (item: string) => void;
}

export const useScannedItems = create<ScannedItemsState>((set) => ({
	scannedItems: [],
	addScannedItems: (item: string) =>
		set((state: ScannedItemsState) => {
			if (!state.scannedItems.find((scannedItem) => scannedItem === item)) {
				return {
					...state,
					scannedItems: [...state.scannedItems, item],
				};
			} else {
				return state;
			}
		}),
}));
