"use client";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { Journey, Station } from "../../../types/types";
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
import { getAllStationsFromDB } from "../../controllers/stationsController";
import {
	get1000JourneysFromDB,
	getFilteredJourneysFromDB,
} from "../../controllers/journeysController";
import Lottie from "lottie-react";
import bicycleAnimation from "../../lotties/cycling.json";

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

	const rows: GridRowsProp = stations.map((station) => {
		return {
			id: station._id,
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
			//controller.abort();
		};
	}, []);

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
					loading={loading}
					rowCount={stations.length}
					keepNonExistentRowsSelected
					//page={page}
					filterModel={filterModel}
					onFilterModelChange={(newFilterModel) =>
						setFilterModel(newFilterModel)
					}
					pageSize={pageSize}
					onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
					rowsPerPageOptions={[10, 20, 50, 100]}
					pagination
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
