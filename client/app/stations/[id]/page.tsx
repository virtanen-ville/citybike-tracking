"use client";
import { useRouter } from "next/navigation";
import { Station, StationData } from "../../../../types/types";
import { useEffect, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

import {
	Alert,
	AlertTitle,
	CircularProgress,
	Container,
	LinearProgress,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Paper,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import {
	getStationDataFromDB,
	getStationFromDB,
} from "../../../controllers/stationsController";
import { Box } from "@mui/system";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import GoogleMap from "./GoogleMap";
import MapMarker from "./MapMarker";

interface Params {
	id: number;
}

export default function Page({ params }: { params: Params }) {
	const [stationData, setStationData] = useState<StationData>();
	const [station, setStation] = useState<Station>();
	const stationLocation: google.maps.LatLngLiteral = {
		lat: station?.y || 0,
		lng: station?.x || 0,
	};
	const [stationLoading, setStationLoading] = useState(true);
	const [stationDataLoading, setStationDataLoading] = useState(true);
	const [startDate, setStartDate] = useState<Dayjs | null>(
		dayjs("2021-05-01")
	);

	const [endDate, setEndDate] = useState<Dayjs | null>(
		dayjs("2021-07-31T23:59:59")
	);

	const handleChangeStart = (newValue: Dayjs | null) => {
		setStartDate(newValue);
	};

	const handleChangeEnd = (newValue: Dayjs | null) => {
		setEndDate(newValue);
	};

	const render = (status: Status) => {
		switch (status) {
			case Status.LOADING:
				return <CircularProgress />;
			case Status.FAILURE:
				return (
					<Alert severity="error">
						<AlertTitle>Error</AlertTitle>
						Error loading Google Maps
					</Alert>
				);
			case Status.SUCCESS:
				return (
					<GoogleMap
						center={stationLocation}
						zoom={13}
						style={{
							height: "400px",
							width: "100%",
							marginBottom: "2rem",
						}}
					>
						<MapMarker position={stationLocation} />
					</GoogleMap>
				);
		}
	};

	useEffect(() => {
		const controller = new AbortController();
		setStationDataLoading(true);
		const fetchStationData = async () => {
			const data = await getStationDataFromDB(
				params.id,
				startDate?.toDate() || new Date(0),
				endDate?.toDate() || new Date(),
				controller
			);

			setStationData(data);
			setStationDataLoading(false);
		};
		fetchStationData();
		return () => {
			controller.abort();
		};
	}, [endDate, params.id, startDate]);

	useEffect(() => {
		const controller = new AbortController();
		setStationLoading(true);
		const fetchStation = async () => {
			const data = await getStationFromDB(params.id, controller);
			setStation(data);
			setStationLoading(false);
		};
		fetchStation();
		return () => {
			controller.abort();
		};
	}, [params.id]);

	return (
		<Container
			maxWidth="md"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				marginTop: "1.5rem",
			}}
		>
			{stationLoading ? (
				<Box
					sx={{
						width: "100%",
						marginBottom: "2rem",
					}}
				>
					<LinearProgress />
				</Box>
			) : (
				<div style={{ width: "100%", textAlign: "center" }}>
					<Typography variant="h4">{station?.name}</Typography>
					<Typography gutterBottom variant="h6">
						{station?.osoite}
					</Typography>
					<Wrapper
						apiKey={
							process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
						}
						render={render}
					/>
					<Typography variant="h6" gutterBottom color={"primary"}>
						Pick the date range you want to see the data for
					</Typography>

					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							marginTop: "1rem",
							marginBottom: "1rem",
						}}
					>
						<DatePicker
							label="Start Date"
							inputFormat="DD/MM/YYYY"
							minDate={dayjs("2021-05-01")}
							maxDate={endDate || dayjs("2021-07-31")}
							value={startDate}
							onChange={handleChangeStart}
							renderInput={(params) => (
								<TextField
									{...params}
									sx={{
										marginX: "1rem",
									}}
								/>
							)}
						/>
						<DatePicker
							label="End Date"
							inputFormat="DD/MM/YYYY"
							maxDate={dayjs("2021-07-31")}
							minDate={startDate || dayjs("2021-05-31")}
							value={endDate}
							onChange={handleChangeEnd}
							renderInput={(params) => (
								<TextField
									{...params}
									sx={{
										marginX: "1rem",
									}}
								/>
							)}
						/>
					</Box>
				</div>
			)}

			{stationDataLoading ? (
				<Box sx={{ marginBottom: "2rem", textAlign: "center" }}>
					<Typography variant="h6" gutterBottom>
						Loading the station data...
					</Typography>
					<CircularProgress />
				</Box>
			) : (
				<div>
					<Paper sx={{ marginBottom: "2rem" }}>
						<List
							sx={{
								width: "100%",
							}}
						>
							<ListItem>
								<ListItemText
									primary="						Average distance of journeys departed from station:
											"
									secondary={
										stationData?.averageDistanceDeparted.toFixed(
											2
										) + " m"
									}
								/>
							</ListItem>

							<ListItem>
								<ListItemText
									primary="						Average distance of journeys returned to station:
											"
									secondary={
										stationData?.averageDistanceReturned.toFixed(
											2
										) + " m"
									}
								/>
							</ListItem>

							<ListItem>
								<ListItemText
									primary="						Number of departures:
											"
									secondary={stationData?.countOfDepartures}
								/>
							</ListItem>
							<ListItem>
								<ListItemText
									primary="						Number of returns:
											"
									secondary={stationData?.countOfReturns}
								/>
							</ListItem>
						</List>
					</Paper>

					<Paper sx={{ marginBottom: "2rem" }}>
						<List
							sx={{
								width: "100%",
							}}
							subheader={
								<ListSubheader inset disableGutters>
									Top 5 Departure Stations:
								</ListSubheader>
							}
						>
							{stationData?.top5DepartureStations.map(
								(station: any, idx: number) => (
									<ListItem key={idx}>
										<ListItemText
											primary={
												idx + 1 + " : " + station._id
											}
											secondary={
												"Departures: " + station.count
											}
										/>
									</ListItem>
								)
							)}
						</List>
					</Paper>

					<Paper sx={{ marginBottom: "2rem" }}>
						<List
							sx={{
								width: "100%",
							}}
							subheader={
								<ListSubheader inset disableGutters>
									Top 5 Return Stations:
								</ListSubheader>
							}
						>
							{stationData?.top5ReturnStations.map(
								(station: any, idx: number) => (
									<ListItem key={idx}>
										<ListItemText
											primary={
												idx + 1 + " : " + station._id
											}
											secondary={
												"Returns: " + station.count
											}
										/>
									</ListItem>
								)
							)}
						</List>
					</Paper>
				</div>
			)}
		</Container>
	);
}
