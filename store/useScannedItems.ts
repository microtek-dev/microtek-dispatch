import { create } from 'zustand';

interface ScannedItemsState {
	scannedItems: string[];
	addScannedItems: (item: string) => void;
}

interface ScannedItem {
	[key: string]: string[];
}

export interface NewScannedItemsState {
	scannedItems: ScannedItem;
	addScannedItems: (item: string, partcode: string) => void;
}

export const useNewScannedItems = create<NewScannedItemsState>((set) => ({
	scannedItems: {},
	addScannedItems: (item: string, partcode: string) =>
		set((state: NewScannedItemsState) => {
			if (!Object.keys(state.scannedItems).find((itemPartcode) => itemPartcode === partcode)) {
				return {
					...state,
					scannedItems: {
						...state.scannedItems,
						[partcode]: [item],
					},
				};
			} else {
				if (!state.scannedItems[partcode].find((scannedItem) => scannedItem === item)) {
					return {
						...state,
						scannedItems: {
							...state.scannedItems,
							[partcode]: [...state.scannedItems[partcode], item],
						},
					};
				} else {
					return state;
				}
			}
		}),
}));

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
