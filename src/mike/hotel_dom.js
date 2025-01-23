// @ts-nocheck

import { HotelReception } from "./hotel_reception.js";

// -------------- //
// Implémentation //
// -------------- //

class HotelDOM
{
	constructor()
	{
		this.reception = new HotelReception();
	}

	/**
	 * Initialise les données d'un formulaire avec des données prédéfinies.
	 */
	createForm(element, data)
	{
		if (data.id) {
			element.setAttribute("data-id", data.id);
		} else {
			element.removeAttribute("data-id");
		}

		let errorDanger = document.createElement("span");
		errorDanger.classList.add("text-danger");

		let titleElement = element.querySelector("#js-term");
		titleElement.textContent = data.formType === "add" ? "Add" : `Edit n°${data.number}`;

		let numberInput = element.querySelector("#js-number2");
		numberInput.classList.remove("border", "border-danger");
		numberInput.value = data.number;
		if (
			!numberInput.nextElementSibling ||
			!numberInput.nextElementSibling.classList.contains("text-danger")
		) {
			numberInput.insertAdjacentElement(
				"afterend",
				errorDanger.cloneNode(true)
			);
		}

		if (data.id) {
			numberInput.parentElement.setAttribute("hidden", "hidden");
		} else {
			numberInput.parentElement.removeAttribute("hidden");
		}

		let typeElement = element.querySelector("#js-type2");
		typeElement.classList.remove("border", "border-danger");
		typeElement.textContent = "";
		if (
			!typeElement.nextElementSibling ||
			!typeElement.nextElementSibling.classList.contains("text-danger")
		) {
			typeElement.insertAdjacentElement(
				"afterend",
				errorDanger.cloneNode(true)
			);
		}

		let defaultTypeOption = document.createElement("option");
		defaultTypeOption.textContent = "Select type";
		defaultTypeOption.value = "";
		defaultTypeOption.selected = true;
		defaultTypeOption.disabled = true;

		typeElement.append(defaultTypeOption);

		for (let roomType of data.roomTypes) {
			let option = document.createElement("option");
			option.textContent = capitalize(roomType);
			option.value = roomType;
			typeElement.append(option);
		}

		typeElement.value = data.type;

		let priceElement = element.querySelector("#js-price2");
		priceElement.value = data.price;
		priceElement.classList.remove("border", "border-danger");
		if (
			!priceElement.nextElementSibling ||
			!priceElement.nextElementSibling.classList.contains("text-danger")
		) {
			priceElement.insertAdjacentElement(
				"afterend",
				errorDanger.cloneNode(true)
			);
		}
	}

	/**
	 * Affiche un message d'erreur de manière globale
	 */
	errorMessage(message)
	{
		let element = document.querySelector("#js-error-msg");
		if (message.length === 0) {
			element.setAttribute("hidden", "hidden");
		} else {
			element.removeAttribute("hidden");
		}
		element.textContent = message;
	}

	/**
	 * Cache un élément en lui attribuant un attribut `hidden`
	 */
	hide(element)
	{
		element.setAttribute("hidden", "hidden");
	}

	/**
	 * Supprime toutes les erreurs de la page
	 */
	removeAllInputErrors()
	{
		let errors = document.querySelectorAll(".text-danger");

		for (let error of Array.from(errors)) {
			error.textContent = "";

			error.previousElementSibling.classList.remove("border", "border-danger");
		}
	}

	/**
	 * Affiche un élément en lui retirant l'attribut `hidden`
	 */
	show(element)
	{
		this.removeAllInputErrors();
		this.successMessage("");
		this.errorMessage("");

		let btnSections = document.querySelectorAll("[aria-controls]");

		for (let btnSection of Array.from(btnSections)) {
			let linkedSection = btnSection.getAttribute("aria-controls");
			let section = document.getElementById(linkedSection);

			section.setAttribute("hidden", "hidden");

			if (element.id === linkedSection) {
				btnSection.classList.add("active");
			} else {
				btnSection.classList.remove("active");
			}
		}

		element.removeAttribute("hidden");
	}

	/**
	 * Affiche la liste des chambres d'hotel dans un élément de liste,
	 * en fonction d'options.
	 */
	showListRooms(listElement, options)
	{
		const showEditFormOnClick = (room) => {
			let formElement = document.querySelector("#js-room-form");

			this.createForm(formElement, {
				formType: "edit",
				id: room.getNumber(),
				number: room.getNumber(),
				type: room.getType(),
				price: room.getUnitPrice(),
				roomTypes: this.reception.getAllRoomTypes(),
			});

			this.show(formElement);
		};

		const deleteRoomOnClick = (room, rootElement) => {
			let roomNumber = room.getNumber();

			if (this.reception.requestDeleteRoom({ number: roomNumber })) {
				rootElement.remove();
			}
		};

		const bookRoomOnClick = (room) => {
			let dialog = document.querySelector("#js-book-room");
			let dialogForm = dialog.querySelector("form");
			let dialogRoomNumber = dialog.querySelector("#js-book-room-number");
			dialogRoomNumber.textContent = `n°${room.getNumber()}`;
			dialogForm.addEventListener("submit", (event) => bookRoomOnSubmit(event, room));
		};

		const bookRoomOnSubmit = (event, room) => {
			event.preventDefault();

			let personName = event.target.elements.person_name.value;
			let nights = event.target.elements.nights.valueAsNumber;

			let maybeBookedRoom = this.reception.requestBookRoom({
				roomNumber: room.getNumber(),
				personName: personName,
				nights: nights,
			});

			// Affichage des erreurs:
			if (Array.isArray(maybeBookedRoom)) {
				for (let error of maybeBookedRoom) {
					if (error.pointer) {
						this.showInputError(
							event.target.elements[error.pointer],
							error.message
						);
					} else {
						this.errorMessage(error.message);
					}
				}
				return;
			}

			// Pas d'erreurs...

			let reservation = maybeBookedRoom.getReservation();

			this.successMessage(
				`The room has been reserved for ${reservation.getPersonName()} for ${reservation.getNights()} nights. ` +
				`The total amount is ${room.getPrice()}€.`
			);

			let dialog = event.target.parentElement;
			dialog.hidePopover();

			this.showListRooms(listElement, options);
		};

		const freeRoomOnClick = (room) => {
			let dialog = document.querySelector("#js-free-room");
			let dialogRoomNumber = dialog.querySelector("#js-free-room-number");
			let dialogPersonName = dialog.querySelector("#js-free-person-name");
			let dialogForm = dialog.querySelector("form");

			dialogRoomNumber.textContent = `n°${room.getNumber()}`;
			dialogPersonName.textContent = room.getReservation().getPersonName();

			dialogForm.addEventListener("submit", (event) => freeRoomOnSubmit(event, room));
		};

		const freeRoomOnSubmit = (event, room) => {
			event.preventDefault();

			let maybeFreeRoom = this.reception.requestFreeRoom({
				number: room.getNumber(),
			});

			// Affichage des erreurs:
			if (Array.isArray(maybeFreeRoom)) {
				for (let error of maybeFreeRoom) {
					this.errorMessage(error.message);
				}
			}

			let dialog = document.querySelector("#js-free-room");
			dialog.hidePopover();

			this.showListRooms(listElement, options);
		};

		const makeFreeBookButton = (room) => {
			let btn = document.createElement("button");
			btn.classList.add("btn", "btn-light");
			btn.setAttribute("popovertargetaction", "show");

			if (room.getStatus()) {
				btn.textContent = "Book";
				btn.setAttribute("popovertarget", "js-book-room");
				btn.addEventListener("click", () => bookRoomOnClick(room));
				return btn;
			}

			btn.textContent = "Free";
			btn.setAttribute("popovertarget", "js-free-room");
			btn.addEventListener("click", () => freeRoomOnClick(room));

			return btn;
		};

		const makeRoomItem = (room) => {
			let li = document.createElement("li");
			li.classList.add("list-group-item");

			let div = document.createElement("div");
			div.classList.add("row", "align-items-center");

			let divNumber = document.createElement("div");
			divNumber.classList.add("col-md-1");
			divNumber.textContent = `N° ${room.getNumber()}`;

			let divPrice = document.createElement("div");
			divPrice.classList.add("col-md-2");
			divPrice.textContent = `Price: ${room.getUnitPrice()}€`;

			let divType = document.createElement("div");
			divType.classList.add("col-md-2");
			divType.textContent = `Type: ${room.getType()}`;

			let divStatus = document.createElement("div");
			divStatus.classList.add("col", "col--md-4");
			divStatus.textContent = "Status: ";
			if (room.getStatus()) {
				divStatus.textContent = "Free";
			} else {
				let res = room.getReservation();
				divStatus.textContent = `Booked by ${res.getPersonName()} for ${res.getNights()} nights`;
			}

			let divActions = document.createElement("div");
			divActions.classList.add("col-md-3", "d-inline-flex", "gap-1", "justify-content-end");

			{
				let btnModify = document.createElement("button");
				btnModify.classList.add("btn", "btn-secondary");
				btnModify.textContent = "Modify";
				btnModify.addEventListener("click", () => showEditFormOnClick(room));

				let btnDelete = document.createElement("button");
				btnDelete.classList.add("btn", "btn-danger");
				btnDelete.textContent = "Delete";
				btnDelete.addEventListener("click", () => deleteRoomOnClick(room, li));

				let separator = document.createElement("div");
				separator.classList.add("align-self-center");
				separator.textContent = "|";

				let btnFreeBook = makeFreeBookButton(room);

				divActions.append(btnModify, btnDelete, separator, btnFreeBook);
			}

			div.append(divNumber, divPrice, divType, divStatus, divActions);

			li.append(div);

			return li;
		};

		listElement.innerHTML = "";

		let rooms = [];

		switch (options.filter) {
			case "all":
			{
				rooms = this.reception.allRooms();
			} break;

			case "available":
			{
				rooms = this.reception.availableRooms();
			} break;

			case "filter":
			{
				rooms = this.reception.allRooms().filter(
					(room) => options.list.includes(room.getNumber())
				);
			} break;
		}

		for (let room of rooms) {
			listElement.appendChild(makeRoomItem(room));
		}
	}

	showInputError(element, message)
	{
		if (message.length === 0) {
			element.classList.remove("border", "border-danger");
		} else {
			element.classList.add("border", "border-danger");
		}

		if (message.length === 0) {
			element.nextElementSibling.setAttribute("hidden", "hidden");
		} else {
			element.nextElementSibling.removeAttribute("hidden");
		}

		element.nextElementSibling.textContent = message;
	}

	successMessage(
		message,
		element = document.querySelector("#js-success-msg")
	)
	{
		if (message.length === 0) {
			element.setAttribute("hidden", "hidden");
		} else {
			element.removeAttribute("hidden");
		}

		element.textContent = message;
	}
}

function capitalize(s)
{
	return s[0].toUpperCase() + s.slice(1);
}

// ------ //
// Export //
// ------ //

export { HotelDOM };
