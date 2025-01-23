// @ts-nocheck

import { Hotel } from "../carina/hotel.js";

// -------------- //
// Implémentation //
// -------------- //

class HotelReception
{
	#database;
	#allRoomTypes = ["single", "double"];

	constructor()
	{
		this.#database = new Hotel();
	}

	allRooms()
	{
		return this.#database.listAllRooms();
	}

	availableRooms()
	{
		return this.#database.listAvailableRooms();
	}

	getAllRoomTypes()
	{
		return this.#allRoomTypes;
	}

	requestBookRoom(data)
	{
		console.debug("> FORM BOOK ROOM", data);

		let roomNumber = data.roomNumber;
		let personName = data.personName.trim();
		let nights = data.nights;

		let errors = [];

		if (personName.length === 0) {
			errors.push({
				type: "error",
				message: "The name MUST NOT be empty.",
				pointer: "person_name",
			});
		}

		if (Number.isNaN(nights) || nights <= 0) {
			errors.push({
				type: "error",
				message: "The number of nights MUST be a positive number",
				pointer: "nights",
			});
		}

		if (nights > 30) {
			errors.push({
				type: "error",
				message: "The number of nights MUST NOT exceed 30",
				pointer: "nights",
			});
		}

		if (errors.length > 0) {
			console.debug("< RETURN BOOK ROOM", errors);
			return errors;
		}

		let maybeBookedRoom = this.#database.bookRoom(
			roomNumber,
			personName,
			nights
		);

		console.debug("< RETURN BOOK ROOM", maybeBookedRoom);
		return maybeBookedRoom;
	}

	requestFreeRoom(data)
	{
		console.debug("> FORM FREE ROOM", data);

		let errors = [];

		if (!this.#database.freeRoom(data.number)) {
			errors.push({
				type: "error",
				message: "The room is not currently booked",
			});
		}

		if (errors.length > 0) {
			console.debug("< RETURN FREE ROOM", errors);
			return errors;
		}

		console.debug("< RETURN FREE ROOM", true);
		return true;
	}

	requestAddRoom(data)
	{
		console.debug("> FORM ADD ROOM", data);

		let number = data.number;
		let type = data.type;
		let price = data.price;

		let errors = [];

		if (Number.isNaN(number) || number <= 0) {
			errors.push({
				type: "error",
				message: "The room number MUST be a positive number",
				pointer: "number",
			});
		}

		if (!this.getAllRoomTypes().includes(type)) {
			errors.push({
				type: "error",
				message: `The room type must be in the following list: ${this.getAllRoomTypes()}`,
				pointer: "type",
			});
		}

		if (Number.isNaN(price) || price <= 0) {
			errors.push({
				type: "error",
				message: "The price number MUST be a positive number",
				pointer: "price",
			});
		}

		let roomsNumbers = this.#database
			.listAllRooms()
			.map((room) => room.getNumber());

		if (roomsNumbers.includes(number)) {
			errors.push({
				type: "error",
				message: `The room number (${number}) is already stored in our database: ${roomsNumbers}`,
				pointer: "number",
			});
		}

		if (errors.length > 0) {
			console.debug("< RETURN ADD ROOM", errors);
			return errors;
		}

		let addedRoom = this.#database.addRoom(number, type, price);

		console.debug("< RETURN ADD ROOM", addedRoom);

		return addedRoom;
	}

	requestEditRoom(data)
	{
		console.debug("> FORM EDIT ROOM", data);

		let number = data.number;
		let type = data.type;
		let price = data.price;

		let errors = [];

		if (Number.isNaN(number) || number <= 0) {
			errors.push({
				type: "error",
				message: "The room number MUST be a positive number",
				pointer: "number",
			});
		}

		if (!this.getAllRoomTypes().includes(type)) {
			errors.push({
				type: "error",
				message: `The room type must be in the following list: ${this.getAllRoomTypes()}`,
				pointer: "type",
			});
		}

		if (Number.isNaN(price) || price <= 0) {
			errors.push({
				type: "error",
				message: "The price number MUST be a positive number",
				pointer: "price",
			});
		}

		if (!this.#database.listAllRooms().some((room) => room.getNumber() === number)) {
			errors.push({
				type: "error",
				message: `The room number (${number}) is not included in our database`,
				pointer: "number",
			});
		}

		if (errors.length > 0) {
			console.debug("< RETURN EDIT ROOM", errors);
			return errors;
		}

		let modifiedRoom = this.#database.modifyRoom(number, type, price);

		console.debug("< RETURN EDIT ROOM", modifiedRoom);

		return modifiedRoom;
	}

	requestDeleteRoom(data)
	{
		console.debug("> FORM DELETE ROOM", data);
		let deletedRoom = this.#database.deleteRoom(data.number);
		console.debug("< RETURN DELETE ROOM", deletedRoom);
		return deletedRoom;
	}

	searchRooms(data)
	{
		let type = data.type;
		let maxPrice = data.maxPrice;
		let status = data.status;

		let errors = [];

		if (!this.getAllRoomTypes().includes(type)) {
			errors.push({
				type: "error",
				message: `The room type must be in the following list: ${this.getAllRoomTypes()}`,
				pointer: "type",
			});
		}

		if (Number.isNaN(maxPrice) || maxPrice <= 0) {
			errors.push({
				type: "error",
				message: "The max price number MUST be a positive number",
				pointer: "max_price",
			});
		}

		if (errors.length > 0) {
			return errors;
		}

		return {
			filtered: this.#database
				.searchRooms(type, maxPrice, status)
				.map((room) => room.getNumber()),
		};
	}
}

export { HotelReception };
