# forensics.py
import numpy as np
import math
from collections import Counter
from scipy.fft import fft
from scipy.stats import chisquare
from textblob import TextBlob

class ForensicLab:
    """
    A collection of static methods to perform forensic analysis on social media data.
    """

    @staticmethod
    def check_benford_compliance(numbers: list[int]) -> float:
        """
        LAYER 1: Benford's Law
        Returns a score (0.0 to 1.0) representing compliance.
        1.0 = Perfect Natural Distribution, 0.0 = Artificial.
        """
        if not numbers: return 0.0
        
        # Extract leading digits (1-9)
        leading_digits = [int(str(n)[0]) for n in numbers if n > 0]
        total = len(leading_digits)
        if total < 10: return 0.5 # Not enough data implies neutrality
        
        counts = Counter(leading_digits)
        observed = [counts[d] for d in range(1, 10)]
        
        # Benford's Law Expected Probabilities
        expected_probs = [math.log10(1 + 1/d) for d in range(1, 10)]
        expected = [p * total for p in expected_probs]
        
        # Chi-Square Test
        chi2, p_value = chisquare(f_obs=observed, f_exp=expected)
        
        # If p > 0.05, we cannot reject null hypothesis (It follows Benford)
        # We map p-value directly to a trust score curve
        return 1.0 if p_value > 0.05 else max(0.0, p_value * 10)

    @staticmethod
    def detect_robotic_periodicity(timestamps: list[float]) -> float:
        """
        LAYER 2: FFT Analysis
        Returns a score (0.0 to 1.0). 
        1.0 = Human (Noisy), 0.0 = Robot (Periodic).
        """
        if len(timestamps) < 10: return 0.5
        
        # Sort and convert to binary signal (bins of 1 hour)
        timestamps.sort()
        start = min(timestamps)
        end = max(timestamps)
        duration = end - start
        if duration == 0: return 0.0
        
        bins = np.arange(start, end + 3600, 3600)
        counts, _ = np.histogram(timestamps, bins)
        signal = (counts > 0).astype(float)
        
        # FFT
        magnitudes = np.abs(fft(signal))
        # Ignore DC component (index 0)
        mags = magnitudes[1:len(magnitudes)//2]
        
        if len(mags) == 0: return 1.0

        mean_noise = np.mean(mags)
        max_peak = np.max(mags)
        
        # Z-Score of the highest peak
        std_dev = np.std(mags)
        if std_dev == 0: return 0.0 # Perfectly flat signal = Artificial
        
        z_score = (max_peak - mean_noise) / std_dev
        
        # If Z > 4, it's a strong periodic signal (Robot)
        # We invert this: High Z = Low Score
        if z_score > 4:
            return max(0.0, 1.0 - ((z_score - 4) / 6)) # Scale 4->10 to 1.0->0.0
        return 1.0

    @staticmethod
    def analyze_content_entropy(texts: list[str]) -> float:
        """
        LAYER 3: Semantic Entropy
        Returns score 0.0 (Spam) to 1.0 (Rich Content).
        """
        if not texts: return 0.5
        
        # Polarity Variance
        polarities = [TextBlob(t).sentiment.polarity for t in texts]
        variance = np.var(polarities) if len(polarities) > 1 else 0
        
        # Uniqueness Ratio
        unique_ratio = len(set(texts)) / len(texts)
        
        # Weighted mix: Uniqueness matters more than sentiment variance
        score = (unique_ratio * 0.7) + (min(1.0, variance * 10) * 0.3)
        return round(score, 2)