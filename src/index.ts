import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './data/db'; 
import { calculateSpotPrice } from './logic/pricing';

const app = express();

// Middleware: Enable CORS for frontend port 3000 and parse JSON
app.use(cors({ origin: 'http://localhost:3000' })); 
app.use(express.json());

/**
 * Fetch IPO metrics and real-time pricing for the Dashboard.
 */
app.get('/api/status', (req: Request, res: Response) => {
    const spotPrice = calculateSpotPrice(db.totalPiInvested);
    
    res.json({
        totalInvestors: db.totalInvestors || 0,
        totalPiInvested: db.totalPiInvested || 0,
        userPiBalance: db.userPiBalance || 0,
        history: db.history || [],
        spotPrice: spotPrice || 0.35
    });
});

/**
 * Handle U2A investment and update on-chain metrics.
 */
app.post('/api/invest', (req: Request, res: Response) => {
    const { amount } = req.body;
    
    if (amount && amount > 0) {
        db.totalPiInvested += amount;
        db.userPiBalance += amount;
        
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
