import path = require("node:path");
import { ComponentModel } from "../models/models";
const pdf = require('html-pdf');
const os = require('os');
const fs = require('node:fs');

export const createPdf = async (htmlContent: string, title: string) => {
   // Save the HTML content to a temporary file
   const tmpFile = path.join('ngbox_scan.html');
   await fs.writeFile(tmpFile, htmlContent, (err: any) => {
      if (err) {
         console.error(err);
      } else {
         console.log('HTML content written to file successfully');
      }
   });

   // Generate a PDF file from the HTML content
   const pdfFile = path.join(os.tmpdir(), 'ngbox_scan.pdf');
   await new Promise((resolve, reject) => {
      pdf.create(fs.createReadStream(tmpFile), {}).toFile(pdfFile, (err: any, res: unknown) => {
         if (err) {
            reject(err);
         } else {
            resolve(res);
         }
      });
   });
};

export const saveInJson = (unusedComponents: ComponentModel[] | null, title: string) => {
   const date = new Date();
   const jsonName = `${title}-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.json`;
   const jsonPath = `${process.cwd()}/${jsonName}`;
   const jsonContent = JSON.stringify(unusedComponents);
   fs.writeFileSync(jsonPath, jsonContent);

};
