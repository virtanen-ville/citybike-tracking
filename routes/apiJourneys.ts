import express from "express";
import { ObjectId } from "mongodb";
import { journeysCollection } from "../controllers/db";

const apiJourneysRouter: express.Router = express.Router();

apiJourneysRouter.use(express.json());

apiJourneysRouter.post(
	"/",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const journeyResponse = await journeysCollection.insertOne(
			req.body.journey
		);
		res.send(journeyResponse);
	}
);

apiJourneysRouter.put(
	"/:journeyId",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const journeyResponse = await journeysCollection.replaceOne(
			{
				_id: req.params.journeyId as unknown as ObjectId,
			},
			req.body.journey
		);
		res.send(journeyResponse);
	}
);

apiJourneysRouter.get(
	"/",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		if (Object.keys(req.query).length === 0) {
			const journeys = await journeysCollection
				.find()
				.limit(100)
				.toArray();
			res.send(journeys);
		} else {
			const journeys = await journeysCollection.findOne({
				_id: req.query.journeyId as unknown as ObjectId,
			});
			res.send(journeys);
		}
	}
);

apiJourneysRouter.get(
	"/:journeyId",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const journey = await journeysCollection.findOne({
			_id: req.params.journeyId as unknown as ObjectId,
		});
		res.send(journey);
	}
);

apiJourneysRouter.delete(
	"/:journeyId",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const journey = await journeysCollection.deleteOne({
			_id: req.params.journeyId as unknown as ObjectId,
		});
		res.send(journey);
	}
);

export default apiJourneysRouter;
