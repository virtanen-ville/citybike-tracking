import { ObjectId } from "bson";
export interface Journey {
	_id?: ObjectId;
	departure: Date;
	return: Date;
	departureStationId: number;
	departureStationName: string;
	returnStationId: number;
	returnStationName: string;
	coveredDistanceM: number;
	durationSec: number;
}

export interface Station {
	_id?: ObjectId;
	fid: number;
	id: number;
	nimi: string;
	namn: string;
	name: string;
	osoite: string;
	adress: string;
	kaupunki: string;
	stad: string;
	operaattor: string;
	kapasiteet: number;
	x: number;
	y: number;
}

export interface Top5StationData {
	_id: string;
	count: number;
}

export interface StationData {
	top5ReturnStations: Top5StationData[];
	top5DepartureStations: Top5StationData[];
	averageDistanceDeparted: number;
	averageDistanceReturned: number;
	countOfDepartures: number;
	countOfReturns: number;
}
