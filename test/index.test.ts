import fs from "fs";
import path from "path";

import Steganography from "../src/steganography.class";

const inputMessage = "Hello";
const key = "abcdefghabcdefghabcdefghabcdefgh";

const samplePDFFile = path.join(__dirname, "example", "sample.pdf");
const samplePDFFileOutput = path.join(
  __dirname,
  "example",
  "sample_output.pdf"
);

const samplePNGFile = path.join(__dirname, "example", "sample.png");
const samplePNGFileOutput = path.join(
  __dirname,
  "example",
  "sample_output.png"
);

afterEach(() => {
  if (fs.existsSync(samplePDFFileOutput)) fs.unlinkSync(samplePDFFileOutput);
  if (fs.existsSync(samplePNGFileOutput)) fs.unlinkSync(samplePNGFileOutput);
});

describe("Module unit test", () => {
  it("It should be write exact message without encryption (PDF)", () => {
    const buffer = Steganography.write(samplePDFFile, inputMessage);
    fs.writeFileSync(samplePDFFileOutput, buffer);

    const message = Steganography.decode(samplePDFFileOutput, "pdf");
    expect(message).toStrictEqual(inputMessage);
  });

  it("It should be write exact message with encryption (PDF)", () => {
    const buffer = Steganography.write(samplePDFFile, inputMessage, key);
    fs.writeFileSync(samplePDFFileOutput, buffer);

    const message = Steganography.decode(samplePDFFileOutput, "pdf", key);
    expect(message).toStrictEqual(message);
  });

  it("It should be write exact message without encryption (PNG)", () => {
    const buffer = Steganography.write(samplePNGFile, inputMessage);
    fs.writeFileSync(samplePNGFileOutput, buffer);

    const message = Steganography.decode(samplePNGFileOutput, "png");
    expect(message).toStrictEqual(inputMessage);
  });

  it("It should be write exact message with encryption (PNG)", () => {
    const buffer = Steganography.write(samplePNGFile, inputMessage, key);
    fs.writeFileSync(samplePNGFileOutput, buffer);

    const message = Steganography.decode(samplePNGFileOutput, "png", key);
    expect(message).toStrictEqual(message);
  });
});
