// @ts-nocheck

import { HotelRoom } from "./hotel_room.js";

// -------------- //
// Implémentation //
// -------------- //

class Hotel {
	/**
	 * @type {Array<HotelRoom>}
	 */
	#rooms = [];

	constructor() {
		this.#rooms = [];
	}

	// push is a native function  and used to add an element to an array number,
	// type, price inside the constructor is not reference to the object itself
	// but is just to show the parameters
	addRoom(number, type, price) {
		let newRoom = new HotelRoom(number, type, price);
		this.#rooms.push(newRoom);
		return newRoom;
	}
	listAllRooms() {
		return this.#rooms;
	}
	listAvailableRooms() {
		return this.#rooms.filter(
			// Avec filter, la fonction anonyme doit retourner une valeur de type bool
			(room) => room.getStatus()
		);
	}
	deleteRoom(number) {
		this.#rooms = this.#rooms.filter((room) => room.getNumber() !== number);

		// version sans filter
		/*
		let rooms = [];
		for (let room of this.#rooms) {
			if (room.getNumber() !== number) {
				rooms.push(room);
			}
		}
		this.#rooms = rooms;
		*/

		return true;
	}
	modifyRoom(number, type, price) {
		// la méthode find parcours tous les éléments d'un tableau et s'attend à
		// recevoir une fonction anonyme qui renvoie un boolean. Si le boolean
		// est true, le premier élément trouvé sera retourné.
		//
		// EX: rooms     = ["a", "b", "c", "d"];
		//     rooms.find(nom => true); le retour sera le premier "a"
		//     rooms.find(nom => false); le retour sera null
		//     rooms.find(nom => nom == "b"); le retour sera "b"
		let room = this.#rooms.find((room) => {
			// Donc ici, on retourne la première chambre dont le numéro de
			// chambre correspond à celui passé en paramètre.
			return room.getNumber() === number;
		});

		room.setNumber(number);
		room.setType(type);
		room.setPrice(price);

		return room;
	}

	freeRoom(number) {
		let room = this.#rooms.find((room) => {
			return room.getNumber() === number;
		});

		room.setStatus(true);
		room.freeNow();

		return true;
	}

	bookRoom(number, personName, nights) {
		let room = this.#rooms.find((room) => {
			return room.getNumber() === number;
		});

		let booked = room.bookNow(personName, nights);
		if (!booked) {
			return false;
		}

		return room;
	}
	searchRooms(type, maxPrice, status) {
		return this.#rooms.filter((room) => {
			// Carina qui a fait
			let defaultReturn =
				room.getType() === type && room.getUnitPrice() <= maxPrice;

			// Mike qui a fait
			if (status !== null) {
				return defaultReturn && room.getStatus() === status;
			}

			return defaultReturn;
		});

		//version avec le boucle for
		// let rooms = []
		// for (let room of this.#rooms) {
		// let defaultReturn = room.getType() === type && room.getUnitPrice() <= maxPrice;
		// if (status !== null) {
		// 	defaultReturn &&= room.getStatus() === status;
		// }
		//   if (defaultReturn) {
		//     rooms.push(room);
		//   }
		// }
		// return rooms;
	}
}

export { Hotel };
