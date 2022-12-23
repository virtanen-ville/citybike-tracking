import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { Journey, Station } from "../../types/types";
import { useCallback, useEffect, useState } from "react";
import {
	DataGrid,
	GridRowsProp,
	GridColDef,
	GridSortModel,
	GridSortItem,
	GridFilterModel,
	GridToolbar,
	GridColumnVisibilityModel,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarExport,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Container } from "@mui/material";
import { getAllStationsFromDB } from "../controllers/stationsController";
import {
	get1000JourneysFromDB,
	getFilteredJourneysFromDB,
} from "../controllers/journeysController";
import Lottie from "lottie-react";
import bicycleAnimation from "../lotties/cycling.json";

// For each journey show departure and return stations, covered distance in kilometers and duration in minutes

export default function Home() {
	const [journeys, setJourneys] = useState<Journey[]>([]);
	const [rowCount, setRowCount] = useState(0);
	const [stations, setStations] = useState<Station[]>([]);
	const [sortModel, setSortModel] = useState<GridSortItem>({
		field: "_id",
		sort: "asc",
	});
	const [columnVisibilityModel, setColumnVisibilityModel] =
		useState<GridColumnVisibilityModel>({
			departure: false,
			return: false,
		});
	const [filterModel, setFilterModel] = useState<GridFilterModel>();
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState<number>(100);
	const [rowCountState, setRowCountState] = useState(rowCount);

	useEffect(() => {
		setRowCountState((prevRowCountState) =>
			rowCount !== undefined ? rowCount : prevRowCountState
		);
	}, [rowCount, setRowCountState]);

	const rows: GridRowsProp = journeys.map((journey) => {
		return {
			id: journey._id,
			departure: new Date(journey.departure),
			return: new Date(journey.return),
			departureStationName: journey.departureStationName,
			returnStationName: journey.returnStationName,
			coveredDistanceM: journey.coveredDistanceM / 1000,
			durationSec: Math.floor(journey.durationSec / 60),
		};
	});

	const columns: GridColDef[] = [
		{
			field: "departure",
			headerName: "Departure Time",
			width: 180,
			align: "left",
			headerAlign: "left",
			type: "dateTime",
		},
		{
			field: "return",
			headerName: "Return Time",
			width: 180,
			align: "left",
			headerAlign: "left",
			type: "dateTime",
		},
		{
			field: "departureStationName",
			headerName: "Departure station",
			width: 200,
			align: "left",
			headerAlign: "left",
			type: "string",
		},
		{
			field: "returnStationName",
			headerName: "Return station",
			width: 200,
			align: "left",
			headerAlign: "left",
			type: "string",
		},
		{
			field: "coveredDistanceM",
			headerName: "Distance (km)",
			width: 180,
			align: "right",
			headerAlign: "right",
			type: "number",
		},
		{
			field: "durationSec",
			headerName: "Duration (min)",
			width: 180,
			align: "right",
			headerAlign: "right",
			type: "number",
		},
	];

	const handleFilterModelChange = useCallback(
		(filterModel: GridFilterModel) => {
			console.log(
				"🚀 ~ file: index.tsx:84 ~ onFilterChange ~ filterModel",
				filterModel
			);
			//  Array of objects: {columnField: 'return', id: 52105, operatorValue: 'before', value: '2021-06-01T05:15'}
			setFilterModel(filterModel);
		},
		[]
	);

	const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
		console.log(
			"🚀 ~ file: index.tsx:70 ~ handleSortModelChange ~ sortModel",
			sortModel
		);
		// array of one object { field: "durationSec", sort: "asc" }
		setSortModel(sortModel[0]);
	}, []);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	useEffect(() => {
		setLoading(true);
		const queryOptions = {
			page,
			pageSize,
			...sortModel,
		};

		const fetchJourneys = async () => {
			const { journeys, count } = await getFilteredJourneysFromDB(
				queryOptions,
				filterModel
			);
			setJourneys(journeys);
			setRowCount(count);
			setLoading(false);
		};
		fetchJourneys();
	}, [filterModel, page, pageSize, sortModel]);

	// useEffect(() => {
	// 	const controller = new AbortController();

	// 	const fetchStations = async () => {
	// 		const stations = await getAllStationsFromDB(controller);
	// 		setStations(stations);
	// 	};
	// 	fetchStations();

	// 	const fetchJourneys = async () => {
	// 		const journeys = await get1000JourneysFromDB(controller);
	// 		setJourneys(journeys);
	// 		setLoading(false);
	// 	};
	// 	fetchJourneys();

	// 	return () => {
	// 		controller.abort();
	// 	};
	// }, []);

	return (
		<Container maxWidth="md">
			<div style={{ display: "flex", height: "100vh" }}>
				<div style={{ flexGrow: 1 }}>
					<Lottie animationData={bicycleAnimation} loop={true} />{" "}
					<DataGrid
						sortingMode="server"
						onSortModelChange={handleSortModelChange}
						loading={loading}
						rowCount={rowCountState}
						keepNonExistentRowsSelected
						paginationMode="server"
						page={page}
						onPageChange={handlePageChange}
						pageSize={pageSize}
						onPageSizeChange={(newPageSize) =>
							setPageSize(newPageSize)
						}
						rowsPerPageOptions={[10, 50, 100]}
						pagination
						//filterMode="server"
						onFilterModelChange={handleFilterModelChange}
						columnVisibilityModel={columnVisibilityModel}
						onColumnVisibilityModelChange={(newModel) =>
							setColumnVisibilityModel(newModel)
						}
						components={{
							Toolbar: CustomToolbar,
						}}
						rows={rows}
						columns={columns}
					/>
				</div>
			</div>
		</Container>
	);
}

function CustomToolbar() {
	return (
		<GridToolbarContainer>
			<GridToolbarColumnsButton />
			<GridToolbarFilterButton />
			<GridToolbarDensitySelector />
			<GridToolbarQuickFilter />
		</GridToolbarContainer>
	);
}
