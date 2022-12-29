import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
require("ajv-keywords")(ajv, "uniqueItemProperties");
addFormats(ajv);

const journeySchema = {
	type: "array",
	description:
		"A list of objects, each one representing a journey made with a bike",
	items: {
		type: "object",
		required: [
			"departure",
			"return",
			"departureStationId",
			"departureStationName",
			"returnStationId",
			"returnStationName",
			"coveredDistanceM",
			"durationSec",
		],
		properties: {
			departure: {
				type: "object",
			},
			return: {
				type: "object",
			},
			departureStationId: {
				type: "integer",
				minimum: 1,
			},
			departureStationName: {
				type: "string",
			},
			returnStationId: {
				type: "integer",
				minimum: 1,
			},
			returnStationName: {
				type: "string",
			},
			coveredDistanceM: {
				type: "number",
				minimum: 10,
			},
			durationSec: {
				type: "number",
				minimum: 10,
			},
		},
		additionalProperties: false,
	},
};

const stationSchema = {
	type: "array",
	uniqueItemProperties: ["fid", "id"],
	description:
		"A list of objects, each one representing a station where a bike can be rented",
	items: {
		type: "object",
		required: ["fid", "id", "nimi"],
		properties: {
			fid: {
				type: "integer",
				minimum: 1,
			},
			id: {
				type: "integer",
				minimum: 1,
			},
			nimi: {
				type: "string",
			},
			namn: {
				type: "string",
			},
			name: {
				type: "string",
			},
			osoite: {
				type: "string",
			},
			adress: {
				type: "string",
			},
			kaupunki: {
				type: "string",
			},
			stad: {
				type: "string",
			},
			operaattor: {
				type: "string",
			},
			kapasiteet: {
				type: "integer",
				minimum: 1,
			},
			x: {
				type: "number",
			},
			y: {
				type: "number",
			},
		},
		additionalProperties: false,
	},
};

const validateJourneys = ajv.compile(journeySchema);
const validateStations = ajv.compile(stationSchema);

export { validateJourneys, validateStations };
