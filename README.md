# Helsinki Citybike tracking app

This is an app (UI and a backend service) for displaying data from journeys made with city bikes in the Helsinki Capital area.

**A live version of the app can be found here: <https://citybike-tracking.vercel.app>**

The example site is hosted in Vercel and the backend service is hosted in Heroku. The database is hosted in MongoDB Atlas. Only 2021-05, 2021-06 and station data is imported to the example site (because of free Atlas restrictions).

## The app

This is a web application that uses a backend service to fetch the data.
Backend is made with NodeJS and frontend uses React and NextJS. Language used is TypeScript.

Backend uses a MongoDB database, which is hosted in whatever MongoDB instance you wish to use (use environment variable MONGO_URI to provide a MongoDB URI address).

If you use the provided Dockerfile and docker-compose the MongoDB instance will run in Docker container and the backend will connect to that instance. The database is populated with the data from the CSV files at startup.

## Data sources

To run the app download three datasets of journey data. The data is owned by City Bike Finland.

-   <https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv>
-   <https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv>
-   <https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv>

Also, there is a dataset that has information about Helsinki Region Transport’s (HSL) city bicycle stations. **RENAME THIS STATIONS FILE TO stations.csv**

-   Dataset: <https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv>
-   License and information: <https://www.avoindata.fi/data/en/dataset/hsl-n-kaupunkipyoraasemat/resource/a23eef3a-cc40-4608-8aa2-c730d17e8902>

Here is a backup link to download the datasets, if you have trouble downloading them:
<https://drive.google.com/drive/folders/10UgDUP9AQb-Nt5bMklZwixQ368t7Dfku?usp=share_link>

## Functionality

### Data import

-   Data is imported from the CSV files to a database
-   Data is validate before importing (with JSON-Schema and PapaParse)
-   Journeys that lasted for less than ten seconds are not imported
-   Journeys that covered distances shorter than 10 meters are not imported

### Journey list view

-   Journeys are listed in a table with pagination and sorting per column
-   Journeys can be filtered by distance or duration and searched by station name (departure or return)
-   Journeys are fetched from the database one page at a time
-   For each journey departure and return stations, covered distance in kilometers and duration in minutes are shown

### Station list

-   List all the stations in a table with pagination and sorting per column
-   Pagination is done by fetching all stations (since there are not too many) and showing one page at a time
-   Searching by what ever you want
-   Clicking on a station opens a single station view

### Single station view

-   Shows station name, address, location on the map and number of journeys starting and ending at the station
-   Shows also the average distance of a journey starting/ending from the station
-   Shows Top 5 most popular return/departure stations for journeys starting/ending from the station
-   Ability to filter all the calculations per date range (start and end date of the journey) - this is using local time of the client browser

## Extra functionality

-   There are endpoints to store new journeys data or new bicycle stations
-   Backend and MongoDB database can be run in Docker (run `docker-compose up` in the root folder)
-   There is UI for adding journeys or bicycle stations (click on the "Add" button in the table header bars of the journey or station list views)

## Instructions for running the app

### Backend

-   Add .env file with environment variables (see .env.example) to the root folder
    -   MONGO_URI is the MongoDB URI address, so you need to provide a MongoDB instance
    -   PORT is the port where the backend will run (suggested port is 3100 as that is used in next.config.js)
-   Make a new folder `static` in the root folder and put the downloaded CSV files there
    -   Remember to rename the stations file to stations.csv
-   Install NodeJS and NPM
-   Install dependencies with `npm install`
-   Run the backend with `npm start`
    -   Backend will be running at <http://localhost:3100> (or whatever port you have set in the environment variable PORT)
-   If you want to run the backend in Docker, run `docker-compose up` in the root folder (this will also run MongoDB in a Docker container) - remember to add the CSV files to the `static` folder before running the Docker containers

### Frontend

-   Add .env.local file with environment variables (see .env.example) to the client folder
    -   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is the Google Developers Maps API Key from your own Google account. This is needed to show the station location on a map. You can get a key from <https://developers.google.com/maps/documentation/javascript/get-api-key>
    -   SERVER_URL is the URL where the backend is running (suggested URL is <http://localhost:3100> as that is used by default when running the backend locally or in Docker).
-   Install NodeJS and NPM
-   Install dependencies with `npm install`
-   Run the frontend with `npm run dev`
    -   Frontend will be running at <http://localhost:3000>
