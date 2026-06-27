# Club Inquiry Delivery Setup

The Club page inquiry form can send each submission to:

- an email inbox through Resend
- a Google Sheet through an Apps Script Web App webhook

If neither channel is configured, the form still shows a local success message
for development, but the inquiry is not delivered anywhere.

## Email Inbox

Create a Resend API key and set these environment variables locally and in
Hydrogen/Oxygen production:

```bash
RESEND_API_KEY=your_resend_api_key
CLUB_INQUIRY_EMAIL_TO=quotes@example.com
CLUB_INQUIRY_EMAIL_FROM=BladeCraft <quotes@example.com>
```

You will see submitted inquiries in the inbox set by
`CLUB_INQUIRY_EMAIL_TO`.

## Google Sheets Backup

Create a Google Sheet with these columns:

```text
Submitted At
Organization
Name
Email
Phone
Organization Type
Order Size
Products
Timeline
Shipping Preference
Notes
```

Open **Extensions > Apps Script** and paste this script:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.submittedAt || '',
    data.organization || '',
    data.name || '',
    data.email || '',
    data.phone || '',
    data.organizationType || '',
    data.orderSize || '',
    (data.products || []).join(', '),
    data.timeline || '',
    data.shippingPreference || '',
    data.notes || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ok: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Deploy it with **Deploy > New deployment > Web app**:

- Execute as: `Me`
- Who has access: `Anyone`

Copy the Web App URL and set:

```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/your_deployment_id/exec
```

You will see submitted inquiries as new rows in that Google Sheet.
