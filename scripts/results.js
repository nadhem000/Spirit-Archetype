// results.js - Result calculation and display logic

// حساب النتيجة
function calculateResult() {
    // Recalculate scores from userAnswers
    scores = { A: 0, B: 0, C: 0, D: 0 };
    userAnswers.forEach(answer => {
        if (answer && scores.hasOwnProperty(answer)) {
            scores[answer] += 1;
        }
    });
    
    // Find dominant pattern (existing logic)
    let dominantPattern = 'A';
    let maxScore = scores.A;
    for (const pattern in scores) {
        if (scores[pattern] > maxScore) {
            maxScore = scores[pattern];
            dominantPattern = pattern;
        }
    }
    return dominantPattern;
}