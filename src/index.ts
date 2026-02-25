import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()); 
app.use(express.json());

/**
 * Core Logic: Spot Price Calculation
 * Formula: Total MapCap Supply (2,181,818) / Current Pi Balance
 */
const calculateSpotPrice = (totalPi: number): number => {
    const TOTAL_MAPCAP = 2181818; 
    return totalPi > 0 ? TOTAL_MAPCAP / totalPi : 0;
};

/**
 * IPO Status API
 * This endpoint now uses dynamic calculations.
 */
app.get('/api/ipo/status', (req, res) => {
    const currentTotalPi = 5000; // This will come from DB/Blockchain later

    const ipoStatus = {
        totalInvestors: 125,
        totalPiInvested: currentTotalPi,
        userPiBalance: 150,
        // Calculate spot price dynamically based on Page 4 of the Use Case
        spotPrice: Number(calculateSpotPrice(currentTotalPi).toFixed(4))
    };
    
    res.json(ipoStatus);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`MapCap Backend running on port ${PORT}`);
});
