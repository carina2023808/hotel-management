// @ts-nocheck

import { HotelView } from "./mike/hotel_view.js";

// -------------- //
// Implémentation //
// -------------- //

class HotelMikarina
{
	#view;

	constructor() {
		this.#view = new HotelView();

		/**
		 * Des exemples
		 */

		let room1 = this.#view.reception.requestAddRoom({
			number: 11,
			price: 23.0,
			type: "single",
		});
		room1.freeNow();

		let room2 = this.#view.reception.requestAddRoom({
			number: 12,
			price: 120.0,
			type: "double",
		});
		room2.bookNow("Mike", 4);

		let room3 = this.#view.reception.requestAddRoom({
			number: 13,
			price: 123.0,
			type: "double",
		});
		room3.bookNow("Carina", 2);

		let room4 = this.#view.reception.requestAddRoom({
			number: 14,
			price: 125.0,
			type: "double",
		});
		room4.bookNow("Saïf", 7);
	}

	/**
	 * Démarre le programme de l'hotel.
	 */
	launch()
	{
		this.#view.registerAddFeature();
		this.#view.registerFormFeature();
		this.#view.registerListRoomsFeature();
		this.#view.registerSearchRoomsFeature();
	}
}

export { HotelMikarina };
