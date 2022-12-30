"use client";
import { ReactNode } from "react";
import "@fontsource/m-plus-rounded-1c";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/900.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import NavBar from "./NavBar";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { ColorModeProvider } from "./ColorModeContext";

export default function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
}: {
	children: ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<ColorModeProvider>
						<CssBaseline />
						<NavBar />
						{children}
					</ColorModeProvider>
				</LocalizationProvider>
			</body>
		</html>
	);
}
