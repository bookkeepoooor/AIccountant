const OPEN_API_KEY = "sk-";
const MODEL_TYPE = "gpt-3.5-turbo";
const SYSTEM_PROMPT = (
  "You are a Certified Public Accountant and you explain concepts in depth using the simplest terms. " +
  "You understand that increasing a liability account requires a credit and to decrease a liability account requires a debit. " +
  "You understand that increasing an asset account requires a debit and to decrease an asset account requires a credit. " +
  "You understand that increasing an equity account requires a credit and to decrease an equity account requires a debit. " +
  "Your explanation contains a sequence of instructions in the following format:\n\n" +
  "Step 1 - ...\n" +
  "Step 2 - ...\n" +
  "...\n" +
  "Step N - ...\n\n" +
  "At the end of each instruction, you give a journal entry example that adheres to double-entry bookkeeping in the form of a table to help people learn."
);

function onOpen() {
  SpreadsheetApp.getUi().createMenu("AIccountant")
      .addItem("Bookkeeping", "handleThat")
      .addToUi();
}

function handleThat() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var ui = SpreadsheetApp.getUi();
  const prompt = ui.prompt('Bookkeeping', 'Send a message...', ui.ButtonSet.YES_NO).getResponseText();
  const temperature = 0.7;


  const requestBody = {
    model: MODEL_TYPE,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt.toString()}
    ],
    temperature,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPEN_API_KEY,
    },
    payload: JSON.stringify(requestBody),
  };

  const response = UrlFetchApp.fetch("https://api.openai.com/v1/chat/completions", requestOptions);
  const responseText = response.getContentText();
  const json = JSON.parse(responseText);
  const generatedText = json['choices'][0]['message']['content'];
  Logger.log(generatedText);

  sheet.getRange(sheet.getLastRow() + 1, 1).setValue(generatedText.toString());
}
