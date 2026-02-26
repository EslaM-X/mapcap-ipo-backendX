import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './data/db'; 
import { calculateSpotPrice } from './logic/pricing';

const app = express();

// Enable CORS for local development and parse JSON payloads
app.use(cors({ origin: 'http://localhost:3000' })); 
app.use(express.json());

/**
 * Endpoint: GET /api/status
 * Provides real-time IPO metrics and historical price points for the dashboard.
 */
app.get('/api/status', (req: Request, res: Response) => {
    const spotPrice = calculateSpotPrice(db.totalPiInvested);
    
    res.json({
        totalInvestors: db.totalInvestors,
        totalPiInvested: db.totalPiInvested,
        userPiBalance: db.userPiBalance,
        history: db.history,
        spotPrice: spotPrice
    });
});

/**
 * Endpoint: POST /api/invest
 * Processes U2A investment, updates supply metrics, and appends a new price point.
 */
app.post('/api/invest', (req: Request, res: Response) => {
    const { amount } = req.body;
    
    if (amount && amount > 0) {
        db.totalPiInvested += amount;
        db.userPiBalance += amount;
        
        // Recalculate price based on new investment total
        const newPrice = calculateSpotPrice(db.totalPiInvested);
        
        // Push a new coordinate for the SVG Line Chart
        db.history.push({ 
            day: db.history.length + 1, 
            price: newPrice 
        });
        
        return res.status(200).json({ success: true, newBalance: db.userPiBalance });
    }
    
    res.status(400).json({ error: "Invalid transaction amount" });
});

/**
 * Endpoint: POST /api/withdraw
 * Handles A2U requests and adjusts capital metrics.
 */
app.post('/api/withdraw', (req: Request, res: Response) => {
    const { amount } = req.body;

    if (amount && amount > 0 && amount <= db.userPiBalance) {
        db.userPiBalance -= amount;
        db.totalPiInvested -= amount; 
        
        return res.status(200).json({ success: true, newBalance: db.userPiBalance });
    }
    
    res.status(400).json({ error: "Insufficient funds or invalid amount" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`MapCap Backend: Listening on port ${PORT}`));
