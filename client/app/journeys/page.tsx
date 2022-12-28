"use client";

import { Journey } from "../../../types/types";
import { useCallback, useEffect, useState } from "react";
import {
	DataGrid,
	GridRowsProp,
	GridColDef,
	GridSortModel,
	GridSortItem,
	GridFilterModel,
	GridColumnVisibilityModel,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
	GridValueFormatterParams,
} from "@mui/x-data-grid";
import {
	Container,
	IconButton,
	InputAdornment,
	TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getFilteredJourneysFromDB } from "../../controllers/journeysController";

// For each journey show departure and return stations, covered distance in kilometers and duration in minutes

export default function Page() {
	const [journeys, setJourneys] = useState<Journey[]>([]);
	const [rowCount, setRowCount] = useState(0);
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
	const [search, setSearch] = useState("");

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
			width: 165,
			align: "right",
			headerAlign: "right",
			type: "number",
			valueFormatter: (params: GridValueFormatterParams<number>) => {
				if (params.value == null) {
					return "";
				}
				return params.value.toFixed(2);
			},
		},
		{
			field: "durationSec",
			headerName: "Duration (min)",
			width: 165,
			align: "right",
			headerAlign: "right",
			type: "number",
		},
	];

	const handleFilterModelChange = (filterModel: GridFilterModel) => {
		console.log(
			"🚀 ~ file: index.tsx:84 ~ onFilterChange ~ filterModel",
			filterModel
		);
		//  Array of objects: {columnField: 'return', id: 52105, operatorValue: 'before', value: '2021-06-01T05:15'}
		setFilterModel(filterModel);
	};

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
		const controller = new AbortController();

		setLoading(true);
		const queryOptions = {
			page,
			pageSize,
			...sortModel,
			search,
		};

		const fetchJourneys = async () => {
			const { journeys, count } = await getFilteredJourneysFromDB(
				queryOptions,
				filterModel,
				controller
			);
			setJourneys(journeys);
			setRowCount(count);
			setLoading(false);
		};
		fetchJourneys();
		return () => {
			controller.abort();
		};
	}, [filterModel, page, pageSize, sortModel, search]);

	return (
		<Container maxWidth="md">
			<div
				style={{
					//display: "flex",
					height: "80vh",
					marginTop: "20px",
				}}
			>
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
					onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
					rowsPerPageOptions={[10, 50, 100]}
					pagination
					disableSelectionOnClick
					filterMode="server"
					//disableColumnFilter
					filterModel={filterModel}
					onFilterModelChange={(newFilterModel) =>
						handleFilterModelChange(newFilterModel)
					}
					columnVisibilityModel={columnVisibilityModel}
					onColumnVisibilityModelChange={(newModel) =>
						setColumnVisibilityModel(newModel)
					}
					components={{
						Toolbar: () => CustomToolbar({ setSearch, search }),
					}}
					rows={rows}
					columns={columns}
				/>
			</div>
		</Container>
	);
}

function CustomToolbar({
	setSearch,
	search,
}: {
	setSearch: React.Dispatch<React.SetStateAction<string>>;
	search: string;
}) {
	const [searchField, setSearchField] = useState(search);
	const handleSearch = () => {
		setSearch(searchField);
	};
	return (
		<GridToolbarContainer sx={{ display: "flex" }}>
			<div style={{ flexGrow: 1 }}>
				<GridToolbarColumnsButton />
				{/* <GridToolbarFilterButton /> */}
				<GridToolbarDensitySelector />
			</div>
			<TextField
				id="search"
				label=""
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<IconButton
								size="small"
								onClick={() => handleSearch()}
							>
								<SearchIcon fontSize="inherit" />
							</IconButton>
						</InputAdornment>
					),
				}}
				variant="standard"
				placeholder="Search..."
				size="small"
				value={searchField}
				onKeyPress={(event) => {
					if (event.key === "Enter") {
						handleSearch();
					}
				}}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					if (event.target.value === "") {
					}
					setSearchField(event.target.value);
				}}
			/>
		</GridToolbarContainer>
	);
}
