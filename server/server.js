const express = require("express");

const { google } = require("googleapis");

const app = express();
const port = 3000
const path = require("path");
const id  = '1QQKpU8ix1XdvxP5Wx-0E0a2QUUMWDnolyzOdJ3pnpXs'

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the Vue.js build directory
app.use(express.static(path.join(__dirname, "..", "client/dist")));

// With this, we'll listen for the server on port 8080
app.listen(port, () => console.log(`Listening on port ${port}`));

async function authSheets() {
  //Function for authentication object
  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  //Create client instance for auth
  const authClient = await auth.getClient();

  //Instance of the Sheets API
  const sheets = google.sheets({ version: "v4", auth: authClient });

  return {
    auth,
    authClient,
    sheets,
  };
}

app.get("/api/attendance", async (req, res) => {
  const { sheets } = await authSheets();

  // Read rows from spreadsheet
  const getRows = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: "Sheet1",
  });

  res.send(getRows.data);
});
