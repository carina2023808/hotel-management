// @ts-nocheck

class HotelRoomReservation {
	constructor(roomNumber, personName, nights) {
		this.roomNumber = roomNumber;
		this.personName = personName;
		this.nights = nights;
	}

	getPersonName() {
		return this.personName;
	}

	getNights() {
		return this.nights;
	}
}

export { HotelRoomReservation };
