/**
 * Mock Database to track IPO progress in real-time.
 * Data resets on server restart.
 */
export const db = {
    totalInvestors: 125,
    totalPiInvested: 5000,
    userPiBalance: 150,
    // Add transaction history for the graph later
    history: [
        { day: 1, price: 0.40 },
        { day: 2, price: 0.42 },
        { day: 3, price: 0.436 }
    ]
};

