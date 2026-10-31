# Vidhya Overseas — Complete static website

A responsive multi-page overseas education consultancy website built with HTML5, CSS3 and vanilla JavaScript.

## Included pages
- `index.html` — homepage
- `destinations.html` — searchable and filterable destinations
- `services.html` — consultancy services
- `about.html` — company introduction and counselling approach
- `contact.html` — custom enquiry form
- `countries/` — individual country pages for the 25 countries in the requested brief, plus Australia, Canada and United States as homepage destinations

## Run locally
Open the project folder in a code editor and run it with a local static server (recommended), such as VS Code Live Server. You can also use Python:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Google Sheets integration setup
1. Create a Google Sheet in the Google account that should receive enquiries.
2. Open the Sheet, choose **Extensions → Apps Script**.
3. Paste the contents of `google-apps-script/Code.gs` into the editor and save.
4. Select `setupSheet` and click **Run** once. Approve spreadsheet permissions. It creates the `Enquiries` tab and headings.
5. Choose **Deploy → New deployment → Web app**.
6. Set **Execute as** to **Me**. Choose **Anyone** only if public access is appropriate and permitted by your Google Workspace administrator and your privacy requirements.
7. Deploy and copy the URL ending in `/exec`.
8. Open `js/config.js` and replace `PASTE_YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL.
9. Publish the website over HTTPS. Submit a test enquiry and check that a row appears in the `Enquiries` tab.

## Important: browser confirmation
The static-site integration uses `fetch` with `mode: "no-cors"` because a normal Apps Script cross-origin response is not readable by browser JavaScript. The page can report that the request was dispatched, but it cannot verify that the row was saved. It intentionally does not claim a confirmed save.

If you require definitive success/error feedback, add a same-origin server-side proxy (for example, a serverless function you control) that validates and forwards the enquiry, then returns a readable response. Keep credentials and private API secrets on the server, never in frontend JavaScript.

## Before publishing
- Replace `info@example.com`, phone and address placeholders in the shared footer and contact page.
- Update contact information in `js/config.js`.
- Add your verified WhatsApp number (digits only, international format) in `js/config.js`.
- Add your privacy policy and explain purpose, access, retention and deletion of submitted student data.
- Confirm that public Apps Script deployment is acceptable. A public endpoint can be spammed; the included honeypot and validation are basic deterrents, not robust rate limiting.
- Keep the spreadsheet private and share it only with authorised staff.
- Replace the map placeholder with a verified Google Maps embed if required.
- Country pages for the 25 destinations covered in `details.docx` now use the supplied country descriptions and indicative tuition figures. Australia, Canada and the United States remain general placeholder pages because the document does not contain their details. The supplied document contains numbering gaps and marketing claims that require verification; check all country, visa, Schengen, programme and fee information against official sources before publishing.
- Use properly licensed destination photographs and optimise them before deployment. The homepage and country hero use remote Unsplash image URLs as temporary visual assets.

## Navigation
Each main navigation page is a separate HTML file. Country links live in the `countries/` folder. Shared styling and scripts are in `css/` and `js/`.
