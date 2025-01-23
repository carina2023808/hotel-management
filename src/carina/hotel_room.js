// @ts-nocheck

import { HotelRoomReservation } from "./hotel_room_reservation.js";

// -------------- //
// Implémentation //
// -------------- //

class HotelRoom {
	constructor(number, type, price) {
		this.number = number;
		this.type = type;
		this.price = price;
		/**
		 * true = free
		 * false = booked
		 */
		this.status = true;
		this.reservation = null;
	}
	//setter
	setNumber(number) {
		this.number = number;
	}

	setType(type) {
		this.type = type;
	}

	setPrice(price) {
		this.price = price;
	}

	/**
	 * true = free
	 * false = booked
	 */
	setStatus(status) {
		this.status = status;
	}
	//getter
	getNumber() {
		return this.number;
	}

	getType() {
		return this.type;
	}

	getPrice() {
		return this.price * this.reservation.getNights();
	}
	getUnitPrice() {
		return this.price;
	}
	getStatus() {
		return this.status;
	}

	//methods
	bookNow(personName, nights) {
		this.reservation = new HotelRoomReservation(
			this.number,
			personName,
			nights
		);
		this.setStatus(false);
		return true;
	}
	freeNow() {
		this.reservation = null;
		this.setStatus(true);
	}

	getReservation() {
		return this.reservation;
	}
}

export { HotelRoom };
