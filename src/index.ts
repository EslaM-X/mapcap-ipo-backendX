import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()); // Allows your mobile frontend to communicate with the server
app.use(express.json());

/**
 * IPO Status API - Endpoint for Frontend sync.
 * Returns mock data for the initial MVP demo.
 */
app.get('/api/ipo/status', (req, res) => {
    // These values will be linked to the database/blockchain in the next phase
    const ipoStatus = {
        totalInvestors: 125,        // Based on current active pioneers
        totalPiInvested: 5000,      // Total Pi in the Escrow wallet
        userPiBalance: 150,         // Mock data for the logged-in user
        spotPrice: 0.436            // Calculated as: 2,181,818 / Total Pi
    };
    
    res.json(ipoStatus);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`MapCap Backend running on port ${PORT}`);
});

