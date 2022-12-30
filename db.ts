import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { Journey, Station } from "./types/types";
import getDataFromCSVFile from "./csv/readFile";
import { readdir } from "node:fs/promises";
import path from "path";
import { validateJourneys, validateStations } from "./csv/validateJSON";

dotenv.config();

const uri: string = String(process.env.MONGO_URI);
export const client = new MongoClient(uri);
export const db = client.db("citybike");
export const stationsCollection = db.collection<Station>("stations");
export const journeysCollection = db.collection<Journey>("journeys");

export const seedDb = async (): Promise<void> => {
	await db.createCollection<Journey>("journeys");
	const journeysCollection = db.collection<Journey>("journeys");
	await db.createCollection<Station>("stations");
	const stationsCollection = db.collection<Station>("stations");

	const filesDirectory = path.join(__dirname, "./static");
	try {
		const files = await readdir(filesDirectory);
		const filteredFiles = files.filter(
			(filename) => path.extname(filename) === ".csv"
		);
		for (const file of filteredFiles) {
			const filePath = path.join(filesDirectory, file);
			const validate = filePath.includes("stations")
				? validateStations
				: validateJourneys;

			const data = await getDataFromCSVFile(filePath);

			const filteredData = filePath.includes("stations")
				? data.filter((item) => item.id > 0)
				: data.filter(
						(item) =>
							item.coveredDistanceM >= 10 &&
							item.durationSec >= 10
				  );

			const valid = validate(filteredData);
			if (!valid) {
				console.log(validate.errors);
				throw new Error("Invalid data");
			}

			if (filePath.includes("stations")) {
				const res = await stationsCollection.insertMany(filteredData);
				console.log(
					"🚀 ~ file: DB.ts:59 ~ seedDb ~ res",
					res.acknowledged,
					res.insertedCount
				);
			} else {
				const res = await journeysCollection.insertMany(filteredData);
				console.log(
					"🚀 ~ file: DB.ts:61 ~ seedDb ~ res",
					res.acknowledged,
					res.insertedCount
				);
			}
		}
	} catch (err) {
		console.error(err);
	}
};
