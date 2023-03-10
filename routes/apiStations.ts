import express from "express";
import { ObjectId } from "mongodb";
import { journeysCollection, stationsCollection } from "../db";

const apiStationsRouter: express.Router = express.Router();

apiStationsRouter.use(express.json());

apiStationsRouter.post(
	"/",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const stationResponse = await stationsCollection.insertOne(
			req.body.station
		);
		res.send(stationResponse);
	}
);

apiStationsRouter.put(
	"/:stationId",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const stationResponse = await stationsCollection.replaceOne(
			{
				_id: req.params.stationId as unknown as ObjectId,
			},
			req.body.station
		);
		res.send(stationResponse);
	}
);

apiStationsRouter.get(
	"/",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const stations = await stationsCollection.find().toArray();
		res.send(stations);
	}
);

apiStationsRouter.get(
	"/:stationId",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const station = await stationsCollection.findOne({
			id: Number(req.params.stationId),
		});

		res.send(station);
	}
);

apiStationsRouter.get(
	"/data/:stationId",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const endDate = new Date(Number(req.query.endDate)) || new Date();
		const startDate = new Date(Number(req.query.startDate)) || new Date(0);

		const aggAverageDistanceDeparted = [
			{
				$match: {
					departureStationId: Number(req.params.stationId),
					departure: {
						$gte: startDate,
						$lte: endDate,
					},
				},
			},
			{
				$group: {
					_id: null,
					departureDistanceAvg: {
						$avg: "$coveredDistanceM",
					},
				},
			},
		];

		const averageDistanceDepartedArr = await journeysCollection
			.aggregate(aggAverageDistanceDeparted)
			.toArray();
		const averageDistanceDeparted =
			averageDistanceDepartedArr[0].departureDistanceAvg;

		const aggAverageDistanceReturned = [
			{
				$match: {
					returnStationId: Number(req.params.stationId),
					departure: {
						$gte: new Date(startDate),
						$lte: new Date(endDate),
					},
				},
			},
			{
				$group: {
					_id: null,
					returnDistanceAvg: {
						$avg: "$coveredDistanceM",
					},
				},
			},
		];

		const averageDistanceReturnedArr = await journeysCollection
			.aggregate(aggAverageDistanceReturned)
			.toArray();
		const averageDistanceReturned =
			averageDistanceReturnedArr[0].returnDistanceAvg;

		const countOfDepartures = await journeysCollection.countDocuments({
			departureStationId: Number(req.params.stationId),
			departure: {
				$gte: new Date(startDate),
				$lte: new Date(endDate),
			},
		});

		const countOfReturns = await journeysCollection.countDocuments({
			returnStationId: Number(req.params.stationId),
			departure: {
				$gte: new Date(startDate),
				$lte: new Date(endDate),
			},
		});

		const aggTop5ReturnStations = [
			{
				$match: {
					departureStationId: Number(req.params.stationId),
					departure: {
						$gte: new Date(startDate),
						$lte: new Date(endDate),
					},
				},
			},
			{
				$group: {
					_id: "$returnStationName",
					count: {
						$count: {},
					},
				},
			},
			{
				$sort: {
					count: -1,
				},
			},
			{
				$limit: 5,
			},
		];

		const top5ReturnStations = await journeysCollection
			.aggregate(aggTop5ReturnStations)
			.toArray();

		const aggTop5DepartureStations = [
			{
				$match: {
					returnStationId: Number(req.params.stationId),
					departure: {
						$gte: new Date(startDate),
						$lte: new Date(endDate),
					},
				},
			},
			{
				$group: {
					_id: "$departureStationName",
					count: {
						$count: {},
					},
				},
			},
			{
				$sort: {
					count: -1,
				},
			},
			{
				$limit: 5,
			},
		];

		const top5DepartureStations = await journeysCollection
			.aggregate(aggTop5DepartureStations)
			.toArray();

		res.send({
			averageDistanceDeparted,
			averageDistanceReturned,
			countOfDepartures,
			countOfReturns,
			top5ReturnStations,
			top5DepartureStations,
		});
	}
);

apiStationsRouter.delete(
	"/:stationId",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const stationResponse = await stationsCollection.deleteOne({
			_id: req.params.stationId as unknown as ObjectId,
		});
		res.send(stationResponse);
	}
);

export default apiStationsRouter;
