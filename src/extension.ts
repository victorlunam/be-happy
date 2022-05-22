// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import fetch from "node-fetch";
import translate from "./services/GoogleTranslate";

const baseURL =
  "https://api.quotable.io/random?tags=happiness|inspirational|success|technology";
// path with fs ./../credentials.json
const pathCredentials = path.join(__dirname, "../credentials.json");

process.env.GOOGLE_APPLICATION_CREDENTIALS = pathCredentials;

async function translateText(text: string) {
  let [translations]: any = await translate.translate(text, "es");
  translations = Array.isArray(translations) ? translations : [translations];
  console.log("Translations:");
  console.log(translations);
  translations.forEach((translation: any, i: number) => {
    console.log(`${text[i]} => ('es') ${translation}`);
  });
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "be-happy" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  const resQod = await fetch(baseURL).then((res) => res.json());
  const translateQod = await translateText(resQod.content);

  const message = {
    content: (resQod as { [key: string]: any }).content,
    author: (resQod as { [key: string]: any }).author,
  };

  let disposable = vscode.commands.registerCommand(
    "be-happy.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user

      vscode.window.showInformationMessage(`${message.content}
      Author: ${message.author}`);
    }
  );

  context.subscriptions.push(disposable);
  vscode.commands.executeCommand("be-happy.helloWorld");
}

// this method is called when your extension is deactivated
export function deactivate() {}
