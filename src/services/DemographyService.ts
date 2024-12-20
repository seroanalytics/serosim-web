export function generatePopDemography(N: number, times: number[], birthTimes: number[], removalMin = Math.min(...times), removalMax = Math.max(...times), probRemoval: number) {

    // Simulate removal times
    const removalTimes = simulateRemovalTimes(N, times, birthTimes, removalMin, removalMax, probRemoval);

    // Create the demographic data
    let demog = Array.from({ length: N }, (_, i) => ({
        i: i + 1,
        birth: birthTimes[i],
        removal: removalTimes[i]
    }));

    // Expand grid and join with times
    demog = demog.flatMap(individual =>
        times.map(time => ({
            ...individual,
            times: time
        }))
    );


    return demog;
}

// Helper function to simulate removal times (to be implemented as per your logic)
function simulateRemovalTimes(N: number, times: any[], birthTimes: any[], removalMin = 0, removalMax = Math.max(...times), probRemoval = 0) {
    // Validate removalMin and removalMax
    if (removalMin < Math.min(...times)) {
        console.warn("removalMin is less than the first time step. Setting to min(times).");
        removalMin = Math.min(...times);
    }
    if (removalMax > Math.max(...times)) {
        console.warn("removalMax is greater than the final time step. Setting to max(times).");
        removalMax = Math.max(...times);
    }

    // Generate removal times for each individual
    const removalTimes = birthTimes.map(birthTime => {
        if (removalMin === removalMax) {
            return Math.random() < probRemoval
                ? Math.max(birthTime, removalMin)
                : Math.max(...times) + 1;
        } else {
            return Math.random() < probRemoval
                ? sampleRange(Math.max(birthTime, removalMin), removalMax)
                : Math.max(...times) + 1;
        }
    });

    return removalTimes;
}

// Helper function to sample a random integer from a range
function sampleRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
