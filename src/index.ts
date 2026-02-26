import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './data/db'; 
import { calculateSpotPrice } from './logic/pricing';

const app = express();

// Standard middleware for Web3 cross-origin requests
app.use(cors()); 
app.use(express.json());

// Simple Logger for Termux monitoring
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

/**
 * Syncs UI Dashboard with Current Blockchain State
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
 * Processes U2A Investment Flow and Updates Pricing Trajectory
 */
app.post('/api/invest', (req: Request, res: Response) => {
    const { amount } = req.body;
    
    if (amount && amount > 0) {
        // Reflecting on-chain movement in local state
        db.totalPiInvested += amount;
        db.userPiBalance += amount;
        
        const newPrice = calculateSpotPrice(db.totalPiInvested);
        db.history.push({ 
            day: db.history.length + 1, 
            price: newPrice 
        });
        
        console.log(`Success: Investment of ${amount} π processed.`);
        return res.status(200).json({ success: true, newBalance: db.userPiBalance });
    }
    res.status(400).json({ error: "Invalid transaction amount" });
});

/**
 * Executes A2U Withdrawal and Adjusts Liquidity Metrics
 */
app.post('/api/withdraw', (req: Request, res: Response) => {
    const { amount } = req.body;
    
    if (amount && amount > 0 && amount <= db.userPiBalance) {
        db.userPiBalance -= amount;
        db.totalPiInvested -= amount; 
        
        console.log(`Success: Withdrawal of ${amount} π processed.`);
        return res.status(200).json({ success: true, newBalance: db.userPiBalance });
    }
    res.status(400).json({ error: "Insufficient balance or invalid amount" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 MapCap Core Listening on Port ${PORT}`);
    console.log(`📊 Current On-chain History Points: ${db.history.length}`);
});
