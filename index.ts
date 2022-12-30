import path from "path";
import express from "express";
import apiJourneysRouter from "./routes/apiJourneys";

import { client, seedDb } from "./db";
import cors from "cors";
import apiStationsRouter from "./routes/apiStations";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.static(path.resolve(__dirname, "build")));
app.use("/api/journeys", apiJourneysRouter);
app.use("/api/stations", apiStationsRouter);

app.get("/*", function (req, res) {
	res.sendFile(path.join(__dirname, "index.html"));
	// res.sendFile(path.join(__dirname, ".next/server/app", "index.html"));
});

// Check if the citybike database exists, if not, seed it
(async () => {
	const admin = client.db().admin();
	const dbInfo = await admin.listDatabases();
	const dbNames = dbInfo.databases.map((db) => db.name);
	console.log("🚀 ~ file: index.ts:24 ~ dbNames", dbNames);

	if (!dbNames.includes("citybike")) seedDb();
})();

app.listen(process.env.PORT, () => {
	console.log(`Server started on port ${process.env.PORT}`);
});
