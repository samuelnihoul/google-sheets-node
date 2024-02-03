const express = require("express");
const { google } = require("googleapis");
const bodyparse = require("body-parser")
const app = express();
app.set("view engine", "ejs");
app.use(bodyparse.json())
app.use(bodyparse.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(getData)
});

app.post("/", async (req, res) => {
  const { sheet, data } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = sheet;

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!A:A",
  });
  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:Z",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [data],
    },
  });

  res.send("Successfully submitted! Thank you!");
});

app.listen(1337, (req, res) => console.log("running on 1337"));
