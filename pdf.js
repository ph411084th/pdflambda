const chromium = require("chrome-aws-lambda");
const fs = require("fs");

exports.handler = async (event, context) => {
  const url = "https://google.com";
  const outputPath = "/tmp/Pobjeda.pdf"; // Save the PDF to the /tmp directory within the Lambda function

  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4" });

    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`PDF saved at ${outputPath}`);

    return {
      statusCode: 200,
      body: "PDF saved successfully",
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: "Error saving PDF",
    };
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
