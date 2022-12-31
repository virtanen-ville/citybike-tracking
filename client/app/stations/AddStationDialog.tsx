import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Station } from "../../types/types";
import { saveStationToDB } from "../../controllers/stationsController";

export default function AddStationDialog({
	dialogOpen,
	setDialogOpen,
}: {
	dialogOpen: boolean;
	setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [fid, setFid] = useState<number | undefined>();
	const [id, setId] = useState<number | undefined>();
	const [nimi, setNimi] = useState("");
	const [namn, setNamn] = useState("");
	const [name, setName] = useState("");
	const [osoite, setOsoite] = useState("");
	const [adress, setAdress] = useState("");
	const [kaupunki, setKaupunki] = useState("");
	const [stad, setStad] = useState("");
	const [operaattor, setOperaattor] = useState("");
	const [kapasiteet, setKapasiteet] = useState<number | undefined>();
	const [x, setX] = useState<number | undefined>();
	const [y, setY] = useState<number | undefined>();

	const handleClose = () => {
		setDialogOpen(false);
	};

	const handleAdd = async () => {
		const station: Station = {
			fid: fid || 0,
			id: id || 0,
			nimi,
			namn,
			name,
			osoite,
			adress,
			kaupunki,
			stad,
			operaattor,
			kapasiteet: kapasiteet || 0,
			x: x || 0,
			y: y || 0,
		};

		console.log(station);
		const res = await saveStationToDB(station);
		console.log(res);
		setDialogOpen(false);
	};

	return (
		<Dialog
			open={dialogOpen}
			onClose={handleClose}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="form-dialog-title">Add Station</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Enter new station details here:
				</DialogContentText>

				<TextField
					autoFocus
					margin="dense"
					id="fid"
					label="FID"
					type="number"
					value={fid}
					fullWidth
					onChange={(e) => setFid(Number(e.target.value))}
				/>

				<TextField
					margin="dense"
					id="id"
					label="ID"
					type="number"
					value={id}
					fullWidth
					onChange={(e) => setId(Number(e.target.value))}
				/>
				<TextField
					margin="dense"
					id="nimi"
					label="Station Name (Finnish)"
					type="text"
					value={nimi}
					fullWidth
					onChange={(e) => setNimi(e.target.value)}
				/>
				<TextField
					margin="dense"
					id="namn"
					label="Station Name (Swedish)"
					type="text"
					value={namn}
					fullWidth
					onChange={(e) => setNamn(e.target.value)}
				/>
				<TextField
					margin="dense"
					id="name"
					label="Station Name (English)"
					type="text"
					value={name}
					fullWidth
					onChange={(e) => setName(e.target.value)}
				/>
				<TextField
					margin="dense"
					id="osoite"
					label="Station Address (Finnish)"
					type="text"
					value={osoite}
					fullWidth
					onChange={(e) => setOsoite(e.target.value)}
				/>
				<TextField
					margin="dense"
					id="adress"
					label="Station Address (Swedish)"
					type="text"
					value={adress}
					fullWidth
					onChange={(e) => setAdress(e.target.value)}
				/>
				<TextField
					margin="dense"
					id="kaupunki"
					label="Station City (Finnish)"
					type="text"
					value={kaupunki}
					fullWidth
					onChange={(e) => setKaupunki(e.target.value)}
				/>
				<TextField
					margin="dense"
					id="stad"
					label="Station City (Swedish)"
					type="text"
					value={stad}
					fullWidth
					onChange={(e) => setStad(e.target.value)}
				/>
				<TextField
					margin="dense"
					id="operaattor"
					label="Operator"
					type="text"
					value={operaattor}
					fullWidth
					onChange={(e) => setOperaattor(e.target.value)}
				/>
				<TextField
					margin="dense"
					id="kapasiteet"
					label="Bike Capacity"
					type="number"
					value={kapasiteet}
					fullWidth
					onChange={(e) => setKapasiteet(Number(e.target.value))}
				/>
				<TextField
					margin="dense"
					id="x"
					label="Latitude"
					type="number"
					value={x}
					fullWidth
					onChange={(e) => setX(Number(e.target.value))}
				/>
				<TextField
					margin="dense"
					id="y"
					label="Longitude"
					type="number"
					value={y}
					fullWidth
					onChange={(e) => setY(Number(e.target.value))}
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
