import cron from "node-cron";
import axios from "axios";
import http from "http";

// Function to run the task
async function runTask() {
    try {
        // Make a request to your PHP script
        const response = await axios.get('http://mrvdatabase.rf.gd/bdayreminder.php', {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.5',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Cookie': '__test=ac5ea580ed94528a64cd1a45c684f6c0; PHPSESSID=cd898b0d10111ae47560fc16c4992d91', // Extracted from the request
                'Host': 'mrvdatabase.rf.gd',
                'Sec-Gpc': '1',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36' // Extracted from the request
            }
        });

        console.log('script executed: ', response.data);

    } catch (error) {
        console.error('Error executing the script or logging status:', error);
    }
}

console.log('sheduling cron...');
// Schedule the task to run at midnight every day
cron.schedule('0 0 * * *', async () => {
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
});
