import { ObjectId } from "bson";
import { Station } from "../../types/types";
type GenericObject = Record<string, unknown>;

export const saveStationToDB = async (
	station: Station,
	controller?: AbortController
) => {
	const res = await fetch("/api/stations", {
		method: "POST",
		signal: controller?.signal,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			station: station,
		}),
	});
	const data = await res.json();
	return data;
};

export const updateStationToDB = async (
	station: Station,
	controller?: AbortController
) => {
	const res = await fetch(`/api/stations/${station._id}`, {
		method: "PUT",
		signal: controller?.signal,

		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			station: station,
		}),
	});
	const data = await res.json();
	return data;
};

export const getStationFromDB = async (
	stationId: ObjectId,
	controller?: AbortController
): Promise<Station> => {
	const res = await fetch(`/api/stations/${stationId}`, {
		method: "GET",
		signal: controller?.signal,

		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await res.json();
	return data;
};

export const deleteStationFromDB = async (
	stationId: ObjectId,
	controller?: AbortController
) => {
	const res = await fetch(`/api/stations/${stationId}`, {
		method: "DELETE",
		signal: controller?.signal,
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await res.json();
	return data;
};

export const getAllStationsFromDB = async (
	controller?: AbortController
): Promise<Station[]> => {
	const res = await fetch("/api/stations", {
		method: "GET",
		signal: controller?.signal,

		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await res.json();
	return data;
};

export const getFilteredStationsFromDB = async (
	reqQueryFilters: GenericObject | string,
	controller?: AbortController
): Promise<Station[]> => {
	let query;
	if (typeof reqQueryFilters === "string") {
		query = reqQueryFilters;
	} else {
		// Make a query string from the filters
		query = Object.keys(reqQueryFilters)
			.map((key) => `${key}=${reqQueryFilters[key]}`)
			.join("&");
	}
	const res = await fetch(`/api/stations?${query}`, {
		method: "GET",
		signal: controller?.signal,

		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await res.json();
	return data;
};
