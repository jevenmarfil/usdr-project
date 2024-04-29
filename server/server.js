const express = require('express')
const { google } = require("googleapis");

const app = express()
const port = 3000
const path = require("path");

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Google Sheets ID
const id  = '1QQKpU8ix1XdvxP5Wx-0E0a2QUUMWDnolyzOdJ3pnpXs'


// Serve static files from the Vue.js build directory
app.use(express.static(path.join(__dirname, "..", "client/dist")));

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
// Define API routes

app.get("/api/attendance", async (req, res) => {
  try {
    const sheets = await authSheets(); // Get sheets instance
    // Read rows from spreadsheet
    const getRows = await sheets.spreadsheets.values.get({
      spreadsheetId: id,
      range: "Sheet1",
    });
    res.send(getRows.data);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).send("Error fetching attendance data");
  }
});

app.post("/api/attendance", async (req, res) => {
  try {
    const sheets = await authSheets(); // Get sheets instance
    // Write rows to spreadsheet
    const writeRows = await sheets.spreadsheets.values.append({
      spreadsheetId: id,
      range: "Sheet1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [["Gabriella", "Silang", "gabriela.silang@mail.com"]],
      },
    });
    res.send(writeRows.data);
  } catch (error) {
    console.error("Error adding attendance data:", error);
    res.status(500).send("Error adding attendance data");
  }
});

app.post('/api', (req, res) => {
  console.log(req.body)
  res.status(200).json({ result: req.body.text });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})