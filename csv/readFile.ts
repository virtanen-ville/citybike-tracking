import fs from "fs";
import Papa from "papaparse";
var camelCase = require("lodash.camelcase");

const getDataFromCSVFile = async (filePath: string): Promise<any[]> => {
	return new Promise((resolve: any, reject) => {
		const file = fs.createReadStream(filePath);
		Papa.parse(file, {
			header: true,
			skipEmptyLines: "greedy",
			transform: (value, header) => {
				if (header === "departure" || header === "return") {
					return new Date(value);
				}
				return value;
			},
			dynamicTyping: true,
			transformHeader: (header) => camelCase(header),
			complete: (results) => {
				resolve(results.data);
			},
			error: (err: any) => {
				reject(err);
			},
		});
	});
};

export default getDataFromCSVFile;
