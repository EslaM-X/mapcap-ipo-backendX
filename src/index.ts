import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './data/db'; 
import { calculateSpotPrice } from './logic/pricing';

const app = express();

// Middleware: Enable cross-origin resource sharing and JSON parsing
app.use(cors()); 
app.use(express.json());

// Logger: Track API interactions in the Termux terminal
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

/**
 * GET /api/status
 * Synchronizes dashboard with current supply and price history.
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
 * POST /api/invest
 * Handles U2A investment flow and updates on-chain price trajectory.
 */
app.post('/api/invest', (req: Request, res: Response) => {
    const { amount } = req.body;
    console.log(`Processing U2A Investment: ${amount} Pi`);

    if (amount && amount > 0) {
        db.totalPiInvested += amount;
        db.userPiBalance += amount;
        
        // Push a new price point to reflect supply changes in the chart
        const newPrice = calculateSpotPrice(db.totalPiInvested);
        db.history.push({ 
            day: db.history.length + 1, 
            price: newPrice 
        });
        
        return res.status(200).json({ success: true, newBalance: db.userPiBalance });
    }
    res.status(400).json({ error: "Invalid transaction amount" });
});

/**
 * POST /api/withdraw
 * Executes A2U withdrawal and adjusts internal liquidity metrics.
 */
app.post('/api/withdraw', (req: Request, res: Response) => {
    const { amount } = req.body;
    if (amount && amount > 0 && amount <= db.userPiBalance) {
        db.userPiBalance -= amount;
        db.totalPiInvested -= amount; 
        return res.status(200).json({ success: true, newBalance: db.userPiBalance });
    }
    res.status(400).json({ error: "Insufficient balance for withdrawal" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 MapCap Core listening on port ${PORT}`);
    console.log(`📊 Active history points: ${db.history.length}`);
});
