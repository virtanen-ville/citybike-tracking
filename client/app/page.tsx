"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "@fontsource/m-plus-rounded-1c/400.css";
import "@fontsource/m-plus-rounded-1c/900.css";
import "@fontsource/m-plus-rounded-1c/700.css";

import { Container, Typography } from "@mui/material";
import Lottie from "lottie-react";
import Link from "next/link";
import bicycleAnimation from "../lotties/cycling.json";
import { green } from "@mui/material/colors";

export default function Page() {
	const fontTheme = createTheme({
		typography: {
			fontFamily: [
				'"M PLUS Rounded 1c"',
				"Roboto",
				'"Helvetica Neue"',
				"Arial",
				"sans-serif",
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"',
			].join(","),
		},
	});
	return (
		<ThemeProvider theme={fontTheme}>
			<Container maxWidth="lg">
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<div
						style={{
							flexGrow: 1,
							textAlign: "center",
						}}
					>
						<Typography
							variant="h2"
							color={green["A700"]}
							sx={{
								fontWeight: 900,
								fontSize: "5rem",
							}}
						>
							Helsinki Citybikes
						</Typography>
						<Typography
							variant="h4"
							sx={{
								fontWeight: 700,
							}}
						>
							Here you can check out all the
						</Typography>
						<Typography
							variant="h4"
							sx={{
								fontWeight: 700,
							}}
						>
							<Link
								style={{ textDecoration: "none" }}
								href={"/journeys"}
								passHref
							>
								<Typography
									variant="h3"
									color={green["A700"]}
									sx={{
										fontWeight: 900,
										fontStyle: "italic",
										display: "inline",
										marginX: 2,
									}}
								>
									JOURNEYS
								</Typography>
							</Link>
							or
							<Link
								href={"/stations"}
								passHref
								style={{ textDecoration: "none" }}
							>
								<Typography
									variant="h3"
									color={green["A700"]}
									sx={{
										fontWeight: 900,
										fontStyle: "italic",
										display: "inline",
										marginX: 2,
									}}
								>
									STATIONS
								</Typography>
							</Link>
						</Typography>
						<Typography
							variant="h4"
							sx={{
								fontWeight: 700,
							}}
						>
							of Helsinki Citybikes
						</Typography>
					</div>
					<div style={{ flexGrow: 1 }}>
						<Lottie animationData={bicycleAnimation} loop={true} />
					</div>
				</div>
			</Container>
		</ThemeProvider>
	);
}
