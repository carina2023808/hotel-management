// @ts-nocheck

import { HotelDOMEvent } from "./hotel_event.js";

// -------------- //
// Implémentation //
// -------------- //

class HotelView extends HotelDOMEvent
{
	/**
	 * Enregistre les événements liés à la fonctionnalité de l'ajout de chambre.
	 */
	registerAddFeature()
	{
		this.registerAddButtonEvent();
	}

	/**
	 * Enregistre les événements liés à la fonctionnalité de l'ajout et
	 * l'édition de chambre (formulaire).
	 */
	registerFormFeature()
	{
		this.registerAddEditFormEvent();
	}

	/**
	 * Enregistre les événements liés à la fonctionnalité de listage des
	 * chambres.
	 */
	registerListRoomsFeature()
	{
		this.registerListAllRoomsButtonEvent();
		this.registerListAvailableRoomsButtonEvent();
	}

	/**
	 * Enregistre les événements liés à la fonctionnalité de recherche des
	 * chambres.
	 */
	registerSearchRoomsFeature()
	{
		this.registerSearchButtonEvent();
		this.registerSearchCheckboxEvent();
		this.registerSearchSubmitEvent();
	}
}

export { HotelView };
