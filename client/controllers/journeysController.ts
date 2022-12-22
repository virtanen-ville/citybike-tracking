import { GridFilterModel } from "@mui/x-data-grid";
import { ObjectId } from "bson";
import { Journey } from "../../types/types";
type GenericObject = Record<string, unknown>;

export const saveJourneyToDB = async (
	journey: Journey,
	controller?: AbortController
) => {
	const res = await fetch("/api/journeys", {
		method: "POST",
		signal: controller?.signal,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			journey: journey,
		}),
	});
	const data = await res.json();
	return data;
};

export const updateJourneyToDB = async (
	journey: Journey,
	controller?: AbortController
) => {
	const res = await fetch(`/api/journeys/${journey._id}`, {
		method: "PUT",
		signal: controller?.signal,

		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			journey: journey,
		}),
	});
	const data = await res.json();
	return data;
};

export const getJourneyFromDB = async (
	journeyId: ObjectId,
	controller?: AbortController
): Promise<Journey> => {
	const res = await fetch(`/api/journeys/${journeyId}`, {
		method: "GET",
		signal: controller?.signal,

		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await res.json();
	return data;
};

export const deleteJourneyFromDB = async (
	journeyId: ObjectId,
	controller?: AbortController
) => {
	const res = await fetch(`/api/journeys/${journeyId}`, {
		method: "DELETE",
		signal: controller?.signal,
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await res.json();
	return data;
};

export const get1000JourneysFromDB = async (
	controller?: AbortController
): Promise<Journey[]> => {
	const res = await fetch("/api/journeys", {
		method: "GET",
		signal: controller?.signal,

		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await res.json();
	return data;
};

export const getFilteredJourneysFromDB = async (
	reqQuery: GenericObject | string,
	filterModel: GridFilterModel | undefined,
	controller?: AbortController
): Promise<{ journeys: Journey[]; count: number }> => {
	// Check if there are any filters applied and so make a POST request to the server
	const filters = filterModel?.items;
	if (filters?.some((filter) => filter.value !== undefined)) {
		const res = await fetch("/api/journeys/filter", {
			method: "POST",
			signal: controller?.signal,

			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				filters: filters,
				query: reqQuery,
			}),
		});
		const data = await res.json();
		return data;
	}
	// If there are no filters applied, make a GET request to the server with the query string
	else {
		let query;
		if (typeof reqQuery === "string") {
			query = reqQuery;
		} else {
			// Make a query string from the object
			query = Object.keys(reqQuery)
				.map((key) => `${key}=${reqQuery[key]}`)
				.join("&");
		}
		const res = await fetch(`/api/journeys?${query}`, {
			method: "GET",
			signal: controller?.signal,

			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await res.json();
		return data;
	}
};
