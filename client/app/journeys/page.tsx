"use client";

import { Journey } from "../../types/types";
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
	GridValueFormatterParams,
	getGridNumericOperators,
} from "@mui/x-data-grid";
import { Button, Container, InputAdornment, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { getFilteredJourneysFromDB } from "../../controllers/journeysController";
import AddJourneyDialog from "./AddJourneyDialog";

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
	const [dialogOpen, setDialogOpen] = useState(false);

	const newFilterOperators = getGridNumericOperators().filter(
		(operator) =>
			operator.value === ">=" ||
			operator.value === "<=" ||
			operator.value === "=" ||
			operator.value === "!=" ||
			operator.value === "<" ||
			operator.value === ">"
	);

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
			filterable: false,
		},
		{
			field: "return",
			headerName: "Return Time",
			width: 180,
			align: "left",
			headerAlign: "left",
			type: "dateTime",
			filterable: false,
		},
		{
			field: "departureStationName",
			headerName: "Departure station",
			width: 200,
			align: "left",
			headerAlign: "left",
			type: "string",
			filterable: false,
		},
		{
			field: "returnStationName",
			headerName: "Return station",
			width: 200,
			align: "left",
			headerAlign: "left",
			type: "string",
			filterable: false,
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
			filterOperators: newFilterOperators,
		},
		{
			field: "durationSec",
			headerName: "Duration (min)",
			width: 165,
			align: "right",
			headerAlign: "right",
			type: "number",
			filterOperators: newFilterOperators,
		},
	];

	const handleFilterModelChange = (filterModel: GridFilterModel) => {
		setFilterModel(filterModel);
	};

	const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
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
			try {
				const { journeys, count } = await getFilteredJourneysFromDB(
					queryOptions,
					filterModel,
					controller
				);
				setJourneys(journeys);
				setRowCount(count);
				setLoading(false);
			} catch (error: any) {
				if (error.name === "AbortError") {
					return;
				}
				console.error(error);
			}
		};

		fetchJourneys();
		return () => {
			controller.abort();
		};
	}, [filterModel, page, pageSize, sortModel, search]);

	return (
		<>
			<AddJourneyDialog
				dialogOpen={dialogOpen}
				setDialogOpen={setDialogOpen}
			/>
			<Container
				maxWidth="md"
				sx={{
					marginTop: "1.5rem",
					height: "80vh",
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
					filterModel={filterModel}
					onFilterModelChange={(newFilterModel) =>
						handleFilterModelChange(newFilterModel)
					}
					columnVisibilityModel={columnVisibilityModel}
					onColumnVisibilityModelChange={(newModel) =>
						setColumnVisibilityModel(newModel)
					}
					components={{
						Toolbar: () => (
							<CustomToolbar
								setSearch={setSearch}
								search={search}
								setDialogOpen={setDialogOpen}
							/>
						),
					}}
					rows={rows}
					columns={columns}
				/>
			</Container>
		</>
	);
}

function CustomToolbar({
	setSearch,
	search,
	setDialogOpen,
}: {
	setSearch: React.Dispatch<React.SetStateAction<string>>;
	search: string;
	setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<GridToolbarContainer sx={{ display: "flex" }}>
			<div style={{ flexGrow: 1 }}>
				<GridToolbarColumnsButton />
				<GridToolbarFilterButton />
				<GridToolbarDensitySelector />
				<Button
					onClick={() => setDialogOpen(true)}
					variant="text"
					startIcon={<AddIcon />}
				>
					Add
				</Button>
			</div>

			<TextField
				autoFocus
				id="search"
				label=""
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon fontSize="small" />
						</InputAdornment>
					),
				}}
				variant="standard"
				placeholder="Search..."
				size="small"
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
				}}
			/>
		</GridToolbarContainer>
	);
}
