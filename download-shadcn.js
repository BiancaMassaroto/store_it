import { createWriteStream } from "fs";
import { get } from "https";

const baseUrl = "https://githubusercontent.com";
const files = ["form.tsx", "input.tsx", "label.tsx"];

files.forEach((file) => {
  const fileStream = createWriteStream("components/ui/" + file);
  get(baseUrl + file, (response) => {
    response.pipe(fileStream);
    fileStream.on("finish", () => {
      console.log("✔ " + file + " atualizado com sucesso!");
    });
  });
});

// se der merda:
//const fs = require('fs');
//const https = require('https');
