// src/types/pdf2json.d.ts
declare module "pdf2json" {
    import { EventEmitter } from "events";
  
    export default class PDFParser extends EventEmitter {
      constructor();
  
      parseBuffer(buffer: Buffer): void;
  
      on(
        event: "pdfParser_dataReady",
        callback: (pdfData: {
          formImage: {
            Pages: {
              Texts: {
                R: { T: string }[];
              }[];
            }[];
          };
        }) => void
      ): this;
  
      on(
        event: "pdfParser_dataError",
        callback: (error: { parserError: string }) => void
      ): this;
    }
  }