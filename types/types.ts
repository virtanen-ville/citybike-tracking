import { ObjectId } from "mongodb";

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
