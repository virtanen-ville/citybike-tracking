"use client";
import { useRouter } from "next/navigation";
import { Station } from "../../../../types/types";
import { useEffect, useState } from "react";
import {
	DataGrid,
	GridRowsProp,
	GridColDef,
	GridFilterModel,
	GridColumnVisibilityModel,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
	GridToolbar,
	GridEventListener,
} from "@mui/x-data-grid";
import { CircularProgress, Container } from "@mui/material";
import { getStationDataFromDB } from "../../../controllers/stationsController";

interface Params {
	id: number;
}

export default function Page({ params }: { params: Params }) {
	const [stationData, setStationData] = useState<any>(); // TODO: Change this to right data type
	console.log("🚀 ~ file: page.tsx:28 ~ Page ~ stationData", stationData);
	const [loading, setLoading] = useState(true);
	const [startDate, setStartDate] = useState(new Date(0));
	const [endDate, setEndDate] = useState(new Date());
	const router = useRouter();

	// TODO: Fetch the stations specific data from the database
	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchStationData = async () => {
			const data = await getStationDataFromDB(
				params.id,
				startDate,
				endDate,
				controller
			);
			console.log(
				"🚀 ~ file: page.tsx:46 ~ fetchStationData ~ data",
				data
			);
			setStationData(data);
			setLoading(false);
		};
		fetchStationData();
		return () => {
			controller.abort();
		};
	}, [endDate, params.id, startDate]);

	return (
		<Container maxWidth="md">
			{loading ? (
				<CircularProgress />
			) : (
				<div
					style={{
						//display: "flex",
						height: "80vh",
						marginTop: "20px",
					}}
				>
					<p>This is the page for station with id: {params.id}</p>{" "}
					Station name: {stationData.station.name}
					<p>Station address: {stationData.station.osoite}</p>{" "}
					<p>
						Average distance departed from station:{" "}
						{stationData.averageDistanceDeparted}
					</p>{" "}
					Average distance returned to station:{" "}
					{stationData.averageDistanceReturned}
					<p>
						Count of departures: {stationData.countOfDepartures}
					</p>{" "}
					<p>Count of returns: {stationData.countOfReturns}</p>
					<p>Top 5 Departure Stations:</p>{" "}
					{stationData.top5DepartureStations.map(
						(station: any, idx: number) => (
							<div key={idx}>
								Name: {station._id} | Departures:{" "}
								{station.count}
							</div>
						)
					)}
					<p>Top 5 Return Stations:</p>
					{stationData.top5ReturnStations.map(
						(station: any, idx: number) => (
							<div key={idx}>
								Name: {station._id} | Returns: {station.count}
							</div>
						)
					)}
				</div>
			)}
		</Container>
	);
}

// Single station view

// Recommended

// Station name
// Station address
// Total number of journeys starting from the station
// Total number of journeys ending at the station
// Additional

// Station location on the map
// The average distance of a journey starting from the station
// The average distance of a journey ending at the station
// Top 5 most popular return stations for journeys starting from the station
// Top 5 most popular departure stations for journeys ending at the station
// Ability to filter all the calculations per month
