const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('../FIFA2026.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('pdf_text.txt', data.text);
    console.log("Extracted " + data.numpages + " pages");
}).catch(console.error);
