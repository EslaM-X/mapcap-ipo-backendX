/**
 * Data structure for IPO metrics and history.
 * Maintainable and simple to extend for database integration.
 */
interface IpoDatabase {
    totalInvestors: number;
    totalPiInvested: number;
    userPiBalance: number;
    history: { day: number; price: number }[];
}

export const db: IpoDatabase = {
    totalInvestors: 125,
    totalPiInvested: 5000,
    userPiBalance: 150,
    // Historical price points based on Page 4 calculations
    history: [
        { day: 1, price: 0.350 },
        { day: 2, price: 0.410 },
        { day: 3, price: 0.436 }
    ]
};
