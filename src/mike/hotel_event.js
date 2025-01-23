// @ts-nocheck

import { HotelDOM } from "./hotel_dom.js";

// -------------- //
// Implémentation //
// -------------- //

class HotelDOMEvent extends HotelDOM
{
	/**
	 * Ajoute l'événement click sur le bouton permettant d'afficher le formulaire
	 * d'ajout d'une chambre.
	 */
	registerAddButtonEvent()
	{
		let buttonElement = document.querySelector("#js-add-room-btn");

		const openAddFormOnClick = (event) => {
			let formElement = document.getElementById(buttonElement.getAttribute("aria-controls"));

			this.createForm(formElement, {
				formType: "add",
				number: "",
				price: "",
				type: "",
				roomTypes: this.reception.getAllRoomTypes(),
			});

			this.show(formElement);
		};

		buttonElement.addEventListener("click", openAddFormOnClick);
	}

	/**
	 * Ajout l'événement submit sur le formulaire lié à l'ajout d'une chambre.
	 */
	registerAddEditFormEvent()
	{
		let sectionElement = document.querySelector("#js-room-form");
		let formElement = sectionElement.querySelector("form");

		const formRoomOnSubmit = (event) => {
			event.preventDefault();

			this.removeAllInputErrors();

			let formType = sectionElement.getAttribute("data-id")
				? "edit"
				: "add";

			let maybeRoom = [];

			if (formType === "add") {
				maybeRoom = this.reception.requestAddRoom({
					number: formElement.elements.number.valueAsNumber,
					type: formElement.elements.type.value,
					price: formElement.elements.price.valueAsNumber,
				});
			} else {
				maybeRoom = this.reception.requestEditRoom({
					number: Number(sectionElement.getAttribute("data-id")),
					type: formElement.elements.type.value,
					price: formElement.elements.price.valueAsNumber,
				});
			}

			// Affichage des erreurs:
			if (Array.isArray(maybeRoom)) {
				for (let error of maybeRoom) {
					this.showInputError(
						formElement.elements[error.pointer],
						error.message
					);
				}
				return;
			}

			// Pas d'erreurs...

			let room = maybeRoom;

			this.successMessage(`La chambre n°${room.getNumber()} a bien été sauvegardé.`);
			this.hide(sectionElement);
			sectionElement.removeAttribute("data-id");

			let listElement = document.querySelector("#js-list-all-rooms");
			this.showListRooms(listElement.querySelector("ul"), { filter: "all" });
			this.show(listElement);
		};

		formElement.addEventListener("submit", formRoomOnSubmit);
	}

	/**
	 * Ajoute l'événement click sur le bouton permettant d'afficher la liste des
	 * chambres de l'hotel.
	 */
	registerListAllRoomsButtonEvent()
	{
		let buttonElement = document.querySelector("#js-list-all-rooms-btn");

		const openListAllRoomsOnClick = (event) => {
			let sectionElement = document.getElementById(buttonElement.getAttribute("aria-controls"));
			let listElement = sectionElement.querySelector("ul");
			this.showListRooms(listElement, { filter: "all" });
			this.show(sectionElement);
		};

		buttonElement.addEventListener("click", openListAllRoomsOnClick);
	}

	/**
	 * Ajoute l'événement click sur le bouton permettant d'afficher la liste des
	 * chambres de l'hotel.
	 */
	registerListAvailableRoomsButtonEvent()
	{
		let buttonElement = document.querySelector("#js-list-available-rooms-btn");

		const openListAllRoomsOnClick = (event) => {
			let sectionElement = document.getElementById(buttonElement.getAttribute("aria-controls"));
			let listElement = sectionElement.querySelector("ul");
			this.showListRooms(listElement, { filter: "available" });
			this.show(sectionElement);
		};

		buttonElement.addEventListener("click", openListAllRoomsOnClick);
	}

	/**
	 * Ajoute l'événement click sur le bouton de recherche des chambres.
	 */
	registerSearchButtonEvent()
	{
		let buttonElement = document.querySelector("#js-search-room-btn");

		const openSearchFormOnClick = (event) => {
			let sectionElement = document.getElementById(buttonElement.getAttribute("aria-controls"));
			let formElement = document.querySelector("#js-search-rooms-form");
			let selectElement = formElement.querySelector("select");

			let defaultTypeOption = document.createElement("option");

			defaultTypeOption.textContent = "Select type";
			defaultTypeOption.value       = "";
			defaultTypeOption.selected    = true;
			defaultTypeOption.disabled    = true;

			selectElement.innerHTML = "";

			selectElement.append(defaultTypeOption);

			for (let roomType of this.reception.getAllRoomTypes()) {
				let option = document.createElement("option");

				option.value       = roomType;
				option.textContent = capitalize(roomType);

				selectElement.appendChild(option);
			}

			this.show(sectionElement);
		};

		buttonElement.addEventListener("click", openSearchFormOnClick);
	}

	/**
	 * Ajoute l'événement click sur l'input de type checkbox.
	 */
	registerSearchCheckboxEvent()
	{
		let checkboxElement = document.querySelector("#js-status1");

		const removeStatusOnAltClick = (event) => {
			// On dégage le filtre du status
			checkboxElement.indeterminate = event.altKey;
		};

		// Lorsqu'on maintient ALT (ou option) et que l'on click sur l'input
		// de type checkbox, la fonction `onClickCheckboxAction` est appelée.
		checkboxElement.addEventListener("click", removeStatusOnAltClick);
	}

	/**
	 * Ajoute l'événement click sur l'input de type checkbox.
	 */
	registerSearchSubmitEvent()
	{
		let sectionElement = document.querySelector("#js-search-rooms-form");
		let formElement = sectionElement.querySelector("form");

		const filterListOnSubmit = (event) => {
			event.preventDefault();

			this.removeAllInputErrors();

			let roomType = formElement.elements.type.value;
			let maxPrice = formElement.elements.max_price.valueAsNumber;
			let roomStatus = formElement.elements.status.checked;
			if (formElement.elements.status.indeterminate) {
				roomStatus = null;
			}

			let maybeFilteredRooms = this.reception.searchRooms({
				type: roomType,
				maxPrice: maxPrice,
				status: roomStatus,
			});

			// Affichage des erreurs:
			if (Array.isArray(maybeFilteredRooms)) {
				for (let error of maybeFilteredRooms) {
					this.showInputError(
						formElement.elements[error.pointer],
						error.message
					);
				}
				return;
			}

			// Pas d'erreurs...

			formElement.elements.type.value      = "";
			formElement.elements.max_price.value = "";
			formElement.elements.status.checked  = false;

			let list = document.getElementById(
				formElement.elements.searchsubmit.getAttribute("aria-controls")
			);

			this.showListRooms(list.querySelector("ul"), {
				filter: "filter",
				list: maybeFilteredRooms.filtered,
			});

			this.show(list);

			if (maybeFilteredRooms.filtered.length === 0) {
				this.errorMessage(
					"No rooms were found according to your filters."
				);
			}
		};

		formElement.addEventListener("submit", filterListOnSubmit);
	}
}

function capitalize(s)
{
	return s[0].toUpperCase() + s.slice(1);
}

export { HotelDOMEvent };
