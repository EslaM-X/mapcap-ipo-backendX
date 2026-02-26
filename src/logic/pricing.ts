/**
 * Core pricing logic based on Use Case Page 4.
 * Constant supply: 2,181,818 MapCap tokens.
 */
export const calculateSpotPrice = (totalPi: number): number => {
    const TOTAL_MAPCAP = 2181818; 
    if (totalPi <= 0) return 0;
    
    // Formula: Supply / Investment Balance
    const price = TOTAL_MAPCAP / totalPi;

    // Return price rounded to 4 decimal places for clean UI display
    return Number(price.toFixed(4));
};
