import cron from "node-cron";
import puppeteer from "puppeteer";
import cheerio from "cheerio";
import http from "http";

// Function to extract the message from HTML content
function extractMessage(html) {
    const $ = cheerio.load(html);
    return $('body').text().trim();
}

// Function to run the task
async function runTask() {
    try {
        // Launch Puppeteer browser
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set user agent (optional)
        // await page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36');

        // Navigate to the page
        await page.goto('http://mrvdatabase.rf.gd/bdayreminder.php');

        // Wait for some time to ensure the page has loaded completely
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Get the content of the page
        const content = await page.content();
        const message = extractMessage(content);

        // Close the browser
        await browser.close();
        
        console.log('script executed:', message);

    } catch (error) {
        console.error('Error executing the script or logging status:', error);
    }
}

console.log('sheduling cron...');
// Schedule the task to run at midnight every day
cron.schedule('40 1 * * *', async () => {
    await runTask();
}, {
    timezone: "Asia/Colombo" // Set the timezone to Sri Lanka
});

// Function to test if the task works
async function testTask() {
    console.log('Testing task...');
    await runTask();
}

// Test the task immediately
// testTask();

// You can also test the task periodically if needed
// setInterval(testTask, 24 * 60 * 60 * 1000); // Uncomment this line to test the task periodically

// Create an HTTP server to serve the running status
const server = http.createServer((req, res) => {
    const runningStatus = cron.validate('0 0 * * *') ? 'true' : 'false';
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(runningStatus);
});

// Define the port to listen on
const PORT = 8000; // Change this to your desired port

// Listen on the defined port
server.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
    console.log('ready to go')
});
