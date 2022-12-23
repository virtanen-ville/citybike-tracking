"use client";
import React from "react";
import "@fontsource/m-plus-rounded-1c";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/900.css";
import "@fontsource/roboto/700.css";
import { CssBaseline, PaletteMode } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { grey, green } from "@mui/material/colors";

import NavBar from "./NavBar";

const getDesignTokens = (mode: PaletteMode) => ({
	palette: {
		mode,
		...(mode === "light"
			? {
					// palette values for light mode
					primary: {
						main: green["A700"],
						// light: green[400],
						// dark: green[900],
					},
					secondary: {
						main: grey[800],
						// light: grey[400],
						// dark: grey[900],
					},
					text: {
						primary: grey[900],
						secondary: grey[800],
					},
			  }
			: {
					// palette values for dark mode
					primary: {
						main: grey[800],
						// light: grey[400],
						// dark: grey[900],
					},
					secondary: {
						main: green[800],
						// light: green[400],
						// dark: green[900],
					},
					text: {
						primary: "#fff",
						secondary: grey[500],
					},
			  }),
	},
});
export const ColorModeContext = React.createContext(() => {});

export default function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
}: {
	children: React.ReactNode;
}) {
	const [mode, setMode] = React.useState<"light" | "dark">("light");
	const toggleColorMode = () => {
		// Save mode to local storage so the preference persists
		localStorage.setItem("mode", mode === "light" ? "dark" : "light");
		setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
	};

	const theme = createTheme(getDesignTokens(mode));

	return (
		<html lang="en">
			<body>
				<ColorModeContext.Provider value={toggleColorMode}>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<NavBar />
						{children}
					</ThemeProvider>
				</ColorModeContext.Provider>
			</body>
		</html>
	);
}
