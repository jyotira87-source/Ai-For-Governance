import { generatePredictions } from "../components/PredictiveAnalytics";

describe("generatePredictions", () => {
  describe("successProbability calculation", () => {
    it("should calculate success probability based on score and friction", () => {
      const result = generatePredictions(80, 30);
      expect(result.successProbability).toBeGreaterThan(0);
      expect(result.successProbability).toBeLessThanOrEqual(95);
    });

    it("should have low success probability for low score and high friction", () => {
      const result = generatePredictions(20, 80);
      expect(result.successProbability).toBeLessThan(50);
    });

    it("should have high success probability for high score and low friction", () => {
      const result = generatePredictions(90, 10);
      expect(result.successProbability).toBeGreaterThan(70);
    });

    it("should cap success probability at 95%", () => {
      const result = generatePredictions(100, 0);
      expect(result.successProbability).toBeLessThanOrEqual(95);
    });

    it("should floor success probability at 20%", () => {
      const result = generatePredictions(10, 100);
      expect(result.successProbability).toBeGreaterThanOrEqual(20);
    });
  });

  describe("adoptionTimeline calculation", () => {
    it("should calculate adoption timeline between 3 and 24+ months", () => {
      const result = generatePredictions(50, 50);
      expect(result.adoptionTimeline).toBeGreaterThanOrEqual(3);
    });

    it("should decrease timeline for higher scores", () => {
      const lowScore = generatePredictions(30, 30);
      const highScore = generatePredictions(90, 30);
      expect(highScore.adoptionTimeline).toBeLessThan(lowScore.adoptionTimeline);
    });

    it("should increase timeline for higher friction", () => {
      const lowFriction = generatePredictions(50, 20);
      const highFriction = generatePredictions(50, 80);
      expect(highFriction.adoptionTimeline).toBeGreaterThan(lowFriction.adoptionTimeline);
    });
  });

  describe("stakeholderSupport calculation", () => {
    it("should be between 30 and 95", () => {
      const result = generatePredictions(50, 50);
      expect(result.stakeholderSupport).toBeGreaterThanOrEqual(30);
      expect(result.stakeholderSupport).toBeLessThanOrEqual(95);
    });

    it("should increase with higher score", () => {
      const lowScore = generatePredictions(20, 30);
      const highScore = generatePredictions(85, 30);
      expect(highScore.stakeholderSupport).toBeGreaterThan(lowScore.stakeholderSupport);
    });

    it("should decrease with higher friction", () => {
      const lowFriction = generatePredictions(60, 20);
      const highFriction = generatePredictions(60, 80);
      expect(highFriction.stakeholderSupport).toBeLessThan(lowFriction.stakeholderSupport);
    });
  });

  describe("riskTrajectory calculation", () => {
    it("should be positive (improving) for high score and low friction", () => {
      const result = generatePredictions(85, 30);
      expect(result.riskTrajectory).toBeGreaterThan(0);
    });

    it("should be negative (declining) for high friction", () => {
      const result = generatePredictions(50, 75);
      expect(result.riskTrajectory).toBeLessThan(0);
    });

    it("should be neutral for medium score and friction", () => {
      const result = generatePredictions(50, 50);
      expect(result.riskTrajectory).toBeGreaterThanOrEqual(0.2);
      expect(result.riskTrajectory).toBeLessThanOrEqual(0.2);
    });
  });

  describe("implementationPhases", () => {
    it("should have exactly 4 phases", () => {
      const result = generatePredictions(60, 40);
      expect(result.implementationPhases).toHaveLength(4);
    });

    it("should have correct phase names", () => {
      const result = generatePredictions(60, 40);
      const phaseNames = result.implementationPhases.map((p) => p.phase);
      expect(phaseNames).toEqual([
        "Planning & Drafting",
        "Stakeholder Alignment",
        "Legislative Review",
        "Implementation & Monitoring",
      ]);
    });

    it("should have valid risk levels", () => {
      const result = generatePredictions(60, 40);
      result.implementationPhases.forEach((phase) => {
        expect(["low", "medium", "high"]).toContain(phase.risk);
      });
    });

    it("should have success rates between 0 and 100", () => {
      const result = generatePredictions(60, 40);
      result.implementationPhases.forEach((phase) => {
        expect(phase.successRate).toBeGreaterThanOrEqual(0);
        expect(phase.successRate).toBeLessThanOrEqual(100);
      });
    });

    it("should have positive durations", () => {
      const result = generatePredictions(60, 40);
      result.implementationPhases.forEach((phase) => {
        expect(phase.duration).toBeGreaterThan(0);
      });
    });

    it("should mark high friction projects with higher risk", () => {
      const highFriction = generatePredictions(50, 85);
      const highFrictionHighRisk = highFriction.implementationPhases.filter((p) => p.risk === "high").length;
      expect(highFrictionHighRisk).toBeGreaterThan(0);
    });
  });

  describe("forecastedOutcomes", () => {
    it("should have optimistic > realistic > pessimistic", () => {
      const result = generatePredictions(70, 40);
      expect(result.forecastedOutcomes.optimistic).toBeGreaterThan(result.forecastedOutcomes.realistic);
      expect(result.forecastedOutcomes.realistic).toBeGreaterThan(result.forecastedOutcomes.pessimistic);
    });

    it("should have outcomes between 10 and 100", () => {
      const result = generatePredictions(60, 40);
      const { optimistic, realistic, pessimistic } = result.forecastedOutcomes;
      expect(optimistic).toBeGreaterThanOrEqual(10);
      expect(optimistic).toBeLessThanOrEqual(100);
      expect(realistic).toBeGreaterThanOrEqual(10);
      expect(realistic).toBeLessThanOrEqual(100);
      expect(pessimistic).toBeGreaterThanOrEqual(10);
      expect(pessimistic).toBeLessThanOrEqual(100);
    });

    it("should have realistic outcome close to successProbability", () => {
      const result = generatePredictions(60, 40);
      expect(Math.abs(result.forecastedOutcomes.realistic - result.successProbability)).toBeLessThan(1);
    });
  });

  describe("edge cases", () => {
    it("should handle zero score and zero friction", () => {
      const result = generatePredictions(0, 0);
      expect(result.successProbability).toBeGreaterThanOrEqual(20);
      expect(result.adoptionTimeline).toBeGreaterThanOrEqual(3);
    });

    it("should handle max values", () => {
      const result = generatePredictions(100, 100);
      expect(result.successProbability).toBeLessThanOrEqual(95);
      expect(result.adoptionTimeline).toBeGreaterThan(0);
    });

    it("should handle negative values gracefully", () => {
      const result = generatePredictions(-50, -50);
      expect(result.successProbability).toBeGreaterThanOrEqual(20);
      expect(result.successProbability).toBeLessThanOrEqual(95);
    });
  });
});
