"use client";
import { useRouter } from "next/navigation";
import { Station } from "../../../types/types";
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
	GridEventListener,
} from "@mui/x-data-grid";
import { Button, Container } from "@mui/material";
import { getAllStationsFromDB } from "../../controllers/stationsController";
import AddStationDialog from "./AddStationDialog";
import AddIcon from "@mui/icons-material/Add";

export default function Page() {
	const [stations, setStations] = useState<Station[]>([]);
	const [columnVisibilityModel, setColumnVisibilityModel] =
		useState<GridColumnVisibilityModel>({
			x: false,
			y: false,
		});
	const [loading, setLoading] = useState(true);
	const [pageSize, setPageSize] = useState<number>(100);
	const [filterModel, setFilterModel] = useState<GridFilterModel>();
	const [dialogOpen, setDialogOpen] = useState(false);

	const router = useRouter();

	const rows: GridRowsProp = stations.map((station) => {
		return {
			id: station.id,
			nimi: station.nimi,
			osoite: station.osoite,
			kaupunki: station.kaupunki,
			kapasiteet: station.kapasiteet,
			x: station.x,
			y: station.y,
		};
	});

	const columns: GridColDef[] = [
		{
			field: "nimi",
			headerName: "Aseman nimi",
			width: 200,
			align: "left",
			headerAlign: "left",
			type: "string",
		},
		{
			field: "osoite",
			headerName: "Osoite",
			width: 200,
			align: "left",
			headerAlign: "left",
			type: "string",
		},
		{
			field: "kaupunki",
			headerName: "Kaupunki",
			width: 150,
			align: "left",
			headerAlign: "left",
			type: "string",
		},
		{
			field: "kapasiteet",
			headerName: "Kapasiteetti",
			width: 150,
			align: "right",
			headerAlign: "right",
			type: "number",
		},
		{
			field: "x",
			headerName: "Pituuspiiri",
			width: 150,
			align: "right",
			headerAlign: "right",
			type: "number",
		},
		{
			field: "y",
			headerName: "Leveyspiiri",
			width: 150,
			align: "right",
			headerAlign: "right",
			type: "number",
		},
	];

	const handleRowClick: GridEventListener<"rowClick"> = (
		params, // GridRowParams
		event, // MuiEvent<React.MouseEvent<HTMLElement>>
		details // GridCallbackDetails
	) => {
		router.push(`/stations/${params.row.id}`);
	};

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchStations = async () => {
			const stations = await getAllStationsFromDB(controller);
			setStations(stations);
			setLoading(false);
		};
		fetchStations();
		return () => {
			controller.abort();
		};
	}, []);

	return (
		<>
			<AddStationDialog
				dialogOpen={dialogOpen}
				setDialogOpen={setDialogOpen}
			/>

			<Container maxWidth="md">
				<div
					style={{
						height: "80vh",
						marginTop: "20px",
					}}
				>
					<DataGrid
						loading={loading}
						rowCount={stations.length}
						keepNonExistentRowsSelected
						disableSelectionOnClick
						filterModel={filterModel}
						onFilterModelChange={(newFilterModel) =>
							setFilterModel(newFilterModel)
						}
						pageSize={pageSize}
						onPageSizeChange={(newPageSize) =>
							setPageSize(newPageSize)
						}
						rowsPerPageOptions={[10, 20, 50, 100]}
						pagination
						columnVisibilityModel={columnVisibilityModel}
						onColumnVisibilityModelChange={(newModel) =>
							setColumnVisibilityModel(newModel)
						}
						components={{
							Toolbar: () => (
								<CustomToolbar setDialogOpen={setDialogOpen} />
							),
						}}
						onRowClick={handleRowClick}
						rows={rows}
						columns={columns}
					/>
				</div>
			</Container>
		</>
	);
}

function CustomToolbar({
	setDialogOpen,
}: {
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
			<GridToolbarQuickFilter />
		</GridToolbarContainer>
	);
}
