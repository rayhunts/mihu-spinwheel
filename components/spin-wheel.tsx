// Updated animation algorithm to spin to the fake prize before landing on the real prize with proper easing.

const spinWheel = (winningPrizeIndex) => {
    const fakePrizeIndex = (winningPrizeIndex + 1) % totalPrizes;
    const totalSpinDuration = 3000; // total spin time in milliseconds

    // Calculate easing
    const ease = (t) => t * (2 - t);

    let startTime = null;
    const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / totalSpinDuration, 1);
        const easedProgress = ease(progress);

        // Rotate based on the eased progress
        const rotation = 360 * easedProgress;
        wheelElement.style.transform = `rotate(${rotation}deg)`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Once finished spinning, transition to the winning prize
            setTimeout(() => {
                wheelElement.style.transition = 'transform 1s ease-out';
                const finalRotation = (totalSpinDuration * winningPrizeIndex) % 360;
                wheelElement.style.transform = `rotate(${finalRotation}deg)`;
            }, 500);
        }
    };

    requestAnimationFrame(animate);
};

// Example usage: spin to the winning prize index
spinWheel(winningPrizeIndex);