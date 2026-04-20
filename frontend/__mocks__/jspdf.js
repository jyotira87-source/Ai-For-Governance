const mockJsPDF = jest.fn().mockImplementation(() => ({
  setFontSize: jest.fn(),
  text: jest.fn(),
  save: jest.fn(),
}));

module.exports = { __esModule: true, jsPDF: mockJsPDF };
