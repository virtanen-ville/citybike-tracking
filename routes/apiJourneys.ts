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
				.limit(1000)
				.toArray();
			res.send(journeys);
		} else {
			console.log("🚀 ~ file: apiJourneys.ts:48 ~ req.query", req.query);

			const journeys = await journeysCollection
				.find()
				.sort({
					[String(req.query.field)]:
						req.query.sort === "asc" ? 1 : -1,
				})
				.skip(
					req.query.page && req.query.pageSize
						? Number(req.query.page) * Number(req.query.pageSize)
						: 0
				)
				.limit(Number(req.query.pageSize))
				.toArray();
			const count = await journeysCollection.countDocuments();
			res.send({ journeys, count });
		}
	}
);

apiJourneysRouter.post(
	"/filter",
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const filters = req.body.filters;
		console.log("🚀 ~ file: apiJourneys.ts:85 ~ filters", filters);
		const query = req.body.query;

		const journeys = await journeysCollection
			.find
			// Use the $and operator to combine multiple filters
			// Use the filters object to create the filter object
			()
			.sort({
				[String(req.query.field)]: query.sort === "asc" ? 1 : -1,
			})
			.skip(
				query.page && query.pageSize
					? Number(query.page) * Number(query.pageSize)
					: 0
			)
			.limit(Number(query.pageSize))
			.toArray();
		const count = await journeysCollection.countDocuments();
		res.send({ journeys, count });
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
