"use client";
import * as React from "react";

import {
	Typography,
	Toolbar,
	Box,
	AppBar,
	Button,
	IconButton,
	useTheme,
} from "@mui/material";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "./layout";
import Link from "next/link";

export default function NavBar() {
	const theme = useTheme();
	const toggleColorMode = React.useContext(ColorModeContext);

	return (
		<AppBar position="sticky">
			<Toolbar>
				<Link href={"/"} passHref style={{ textDecoration: "none" }}>
					<IconButton
						size="large"
						edge="start"
						color="secondary"
						aria-label="home"
						sx={{ mr: 2 }}
					>
						<PedalBikeIcon fontSize="large" />
					</IconButton>
				</Link>
				<Link
					href={"/"}
					passHref
					style={{ textDecoration: "none", flexGrow: 1 }}
				>
					<Typography
						variant="h4"
						component="div"
						color={"secondary"}
						sx={{
							fontWeight: "bold",
						}}
					>
						CITYBIKES
					</Typography>
				</Link>
				<Link
					href={"/journeys"}
					passHref
					style={{ textDecoration: "none" }}
				>
					<Button
						variant="outlined"
						color="secondary"
						size="large"
						sx={{ my: 2, mx: 1, display: "block" }}
					>
						Journeys
					</Button>
				</Link>
				<Link
					href={"/stations"}
					passHref
					style={{ textDecoration: "none" }}
				>
					<Button
						variant="outlined"
						color="secondary"
						size="large"
						sx={{ my: 2, mx: 1, display: "block" }}
					>
						Stations
					</Button>
				</Link>
				<IconButton
					sx={{ ml: 1 }}
					onClick={toggleColorMode}
					color="inherit"
				>
					{theme.palette.mode === "dark" ? (
						<Brightness7Icon />
					) : (
						<Brightness4Icon />
					)}
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}
