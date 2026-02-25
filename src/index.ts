import express from 'express';
import cors from 'cors';
import { db } from './data/db'; // Import our mock DB

const app = express();
app.use(cors()); 
app.use(express.json());

const TOTAL_MAPCAP = 2181818;

/**
 * Get current IPO status
 */
app.get('/api/ipo/status', (req, res) => {
    const spotPrice = TOTAL_MAPCAP / db.totalPiInvested;
    
    res.json({
        ...db,
        spotPrice: Number(spotPrice.toFixed(4))
    });
});

/**
 * Handle new investment (On-chain simulation)
 */
app.post('/api/ipo/invest', (req, res) => {
    const { amount } = req.body;
    
    if (amount > 0) {
        db.totalPiInvested += amount;
        db.userPiBalance += amount;
        // Optionally increment investors if it's a new wallet
        
        console.log(`New Investment: ${amount} Pi. New Total: ${db.totalPiInvested}`);
        return res.status(200).json({ success: true, newBalance: db.userPiBalance });
    }
    
    res.status(400).json({ error: "Invalid amount" });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`MapCap Backend running on port ${PORT}`));
