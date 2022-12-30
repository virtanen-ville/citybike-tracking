"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { PaletteMode } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { grey, green } from "@mui/material/colors";

import type {} from "@mui/x-date-pickers/themeAugmentation";

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
						main: grey[500],
						// light: grey[400],
						// dark: grey[900],
					},
					secondary: {
						main: green["A700"],
						// light: green[400],
						// dark: green[900],
					},
					text: {
						primary: "#fff",
						secondary: grey[400],
					},
			  }),
	},
});

const ColorModeContext = createContext(() => {});

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
	const [mode, setMode] = useState<"light" | "dark">("light");

	const toggleColorMode = () => {
		// Save mode to local storage so the preference persists
		localStorage.setItem("mode", mode === "light" ? "dark" : "light");
		setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
	};

	const theme = createTheme(getDesignTokens(mode));

	useEffect(() => {
		const localMode = localStorage.getItem("mode");
		if (localMode) {
			setMode(localMode as "light" | "dark");
		}
	}, []);

	return (
		<ColorModeContext.Provider value={toggleColorMode}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</ColorModeContext.Provider>
	);
};

export function useColorMode() {
	return useContext(ColorModeContext);
}
