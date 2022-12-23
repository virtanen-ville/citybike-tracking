import express from "express";
import { ObjectId } from "mongodb";
import { stationsCollection } from "../controllers/db";

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
		const stationResponse = await stationsCollection.findOne({
			_id: req.params.stationId as unknown as ObjectId,
		});
		res.send(stationResponse);
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
