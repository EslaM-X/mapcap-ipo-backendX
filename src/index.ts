import express from 'express';
import cors from 'cors';
import { db } from './data/db'; 
import { calculateSpotPrice } from './logic/pricing';

const app = express();
app.use(cors()); 
app.use(express.json());

/**
 * Syncs Dashboard with current IPO metrics and real-time spot price.
 */
app.get('/api/ipo/status', (req, res) => {
    const spotPrice = calculateSpotPrice(db.totalPiInvested);
    
    res.json({
        ...db,
        spotPrice
    });
});

/**
 * Handles U2A investment flow. 
 * Simulates on-chain confirmation before updating local state.
 */
app.post('/api/ipo/invest', (req, res) => {
    const { amount } = req.body;
    
    if (amount && amount > 0) {
        // Update pool metrics
        db.totalPiInvested += amount;
        db.userPiBalance += amount;
        
        // Push new price point to historical data for chart rendering
        const newPrice = calculateSpotPrice(db.totalPiInvested);
        db.history.push({ 
            day: db.history.length + 1, 
            price: newPrice 
        });
        
        return res.status(200).json({ success: true, newBalance: db.userPiBalance });
    }
    
    res.status(400).json({ error: "Invalid transaction amount" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`MapCap Service active on port ${PORT}`));
