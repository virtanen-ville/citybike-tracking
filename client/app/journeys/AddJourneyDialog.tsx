import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { TimePickerToolbar } from "@mui/x-date-pickers/TimePicker/TimePickerToolbar";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { Journey } from "../../types/types";
import { saveJourneyToDB } from "../../controllers/journeysController";

export default function AddJourneyDialog({
	dialogOpen,
	setDialogOpen,
}: {
	dialogOpen: boolean;
	setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [departure, setDeparture] = useState<Dayjs | null>(
		dayjs("2021-07-31T23:50")
	);
	const [returnTime, setReturnTime] = useState<Dayjs | null>(
		dayjs("2021-07-31T23:55")
	);
	const durationSec = returnTime?.diff(departure, "second");
	const [departureStationId, setDepartureStationId] = useState<
		number | undefined
	>();
	const [departureStationName, setDepartureStationName] = useState("");
	const [returnStationId, setReturnStationId] = useState<
		number | undefined
	>();
	const [returnStationName, setReturnStationName] = useState("");
	const [coveredDistanceM, setCoveredDistanceM] = useState<
		number | undefined
	>();

	const handleClose = () => {
		setDialogOpen(false);
	};

	const handleAdd = async () => {
		const journey: Journey = {
			departure: departure?.toDate() || new Date(),
			return: returnTime?.toDate() || new Date(),
			departureStationId: departureStationId || 0,
			departureStationName,
			returnStationId: returnStationId || 0,
			returnStationName,
			coveredDistanceM: coveredDistanceM || 0,
			durationSec: durationSec || 0,
		};
		console.log(journey);
		const res = await saveJourneyToDB(journey);
		console.log(res);
		setDialogOpen(false);
	};

	return (
		<Dialog
			open={dialogOpen}
			onClose={handleClose}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="form-dialog-title">Add Journey</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Enter new journey details here:
				</DialogContentText>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						marginTop: "1rem",
						marginBottom: "1rem",
					}}
				>
					<DateTimePicker
						label="Departure Time"
						ampm={false}
						showToolbar
						ToolbarComponent={TimePickerToolbar}
						openTo="day"
						views={["year", "day", "hours", "minutes", "seconds"]}
						inputFormat="D.M.YYYY [klo] HH.mm.ss"
						disableMaskedInput
						minDate={dayjs("2021-05-01T00:00")}
						maxDate={returnTime || dayjs("2021-07-31T23:59")}
						value={departure}
						onChange={(newValue: Dayjs | null) => {
							setDeparture(newValue);
						}}
						renderInput={(params) => <TextField {...params} />}
					/>
					<DateTimePicker
						label="Return Time"
						ampm={false}
						openTo="day"
						ToolbarComponent={TimePickerToolbar}
						showToolbar
						views={["year", "day", "hours", "minutes", "seconds"]}
						inputFormat="D.M.YYYY [klo] HH.mm.ss"
						disableMaskedInput
						maxDate={dayjs("2021-07-31T23:59")}
						minDate={departure || dayjs("2021-05-31T00:00")}
						value={returnTime}
						onChange={(newValue: Dayjs | null) => {
							setReturnTime(newValue);
						}}
						renderInput={(params) => <TextField {...params} />}
					/>
				</Box>
				<TextField
					autoFocus
					margin="dense"
					id="departureStationId"
					label="Departure Station Id"
					type="number"
					value={departureStationId}
					fullWidth
					onChange={(e) =>
						setDepartureStationId(Number(e.target.value))
					}
				/>
				<TextField
					margin="dense"
					id="departureStationName"
					label="Departure Station Name"
					type="text"
					value={departureStationName}
					fullWidth
					onChange={(e) => setDepartureStationName(e.target.value)}
				/>
				<TextField
					margin="dense"
					id="returnStationId"
					label="Return Station Id"
					type="number"
					value={returnStationId}
					fullWidth
					onChange={(e) => setReturnStationId(Number(e.target.value))}
				/>
				<TextField
					margin="dense"
					id="returnStationName"
					label="Return Station Name"
					type="text"
					value={returnStationName}
					fullWidth
					onChange={(e) => setReturnStationName(e.target.value)}
				/>
				<TextField
					margin="dense"
					id="coveredDistanceM"
					label="Covered Distance (m)"
					type="number"
					value={coveredDistanceM}
					fullWidth
					onChange={(e) =>
						setCoveredDistanceM(Number(e.target.value))
					}
				/>
				<TextField
					margin="dense"
					id="durationSec"
					label="Duration (sec)"
					type="number"
					value={durationSec}
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" onClick={handleClose} color="error">
					Cancel
				</Button>
				<Button variant="contained" onClick={handleAdd} color="primary">
					Add
				</Button>
			</DialogActions>
		</Dialog>
	);
}
