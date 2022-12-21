import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { Journey, Station } from "../../types/types";
import { useEffect, useState } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { Container } from "@mui/material";

// For each journey show departure and return stations, covered distance in kilometers and duration in minutes

export default function Home() {
	const [journeys, setJourneys] = useState<Journey[]>([]);
	const [stations, setStations] = useState<Station[]>([]);
	const [pageSize, setPageSize] = useState<number>(10);

	const rows: GridRowsProp = journeys.map((journey) => {
		return {
			id: journey._id,
			departure: journey.departureStationName,
			return: journey.returnStationName,
			distance: journey.coveredDistanceM / 1000,
			duration: Math.floor(journey.durationSec / 60),
		};
	});

	const columns: GridColDef[] = [
		{ field: "departure", headerName: "Departure station", width: 200 },
		{ field: "return", headerName: "Return station", width: 200 },
		{ field: "distance", headerName: "Distance (km)", width: 180 },
		{ field: "duration", headerName: "Duration (min)", width: 180 },
	];

	useEffect(() => {
		const controller = new AbortController();
		const fetchStations = async () => {
			const data = await fetch("http://localhost:3100/api/stations", {
				method: "GET",
				signal: controller.signal,
				headers: {
					"Content-Type": "application/json",
				},
			});
			const json = await data.json();
			console.log(json);
			setStations(json);
		};
		fetchStations();

		const fetchJourneys = async () => {
			const data = await fetch("http://localhost:3100/api/journeys", {
				signal: controller.signal,
			});
			const json = await data.json();
			console.log(json);
			setJourneys(json);
		};
		fetchJourneys();

		return () => {
			controller.abort();
		};
	}, []);

	return (
		<Container maxWidth="md">
			<div style={{ display: "flex", height: "100vh" }}>
				<div style={{ flexGrow: 1 }}>
					<DataGrid
						pageSize={pageSize}
						onPageSizeChange={(newPageSize) =>
							setPageSize(newPageSize)
						}
						rowsPerPageOptions={[10, 50, 100]}
						pagination
						rows={rows}
						columns={columns}
					/>
				</div>
			</div>
		</Container>
	);
}
