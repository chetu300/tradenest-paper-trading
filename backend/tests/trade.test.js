process.env.JWT_SECRET = "test-only-secret";

jest.mock("../models/User", () => ({
  findById: jest.fn(),
}));
jest.mock("../models/Trade", () => ({
  create: jest.fn(),
  find: jest.fn(),
}));

const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Trade = require("../models/Trade");

function makeUser(overrides = {}) {
  return {
    _id: "user-1",
    walletBalance: 100000,
    holdings: [],
    save: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function authHeader() {
  const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET);
  return { Authorization: `Bearer ${token}` };
}

describe("trade and wallet APIs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Trade.create.mockResolvedValue({
      _id: "trade-1",
      symbol: "TCS",
      side: "BUY",
      quantity: 1,
      price: 3912.4,
      total: 3912.4,
    });
  });

  test("buying shares deducts the correct amount and creates an order", async () => {
    const user = makeUser();
    User.findById.mockResolvedValue(user);

    const response = await request(app)
      .post("/api/trades")
      .set(authHeader())
      .send({ symbol: "TCS", side: "BUY", quantity: 2 });

    expect(response.status).toBe(201);
    expect(response.body.walletBalance).toBe(92175.2);
    expect(response.body.holdings[0]).toMatchObject({
      symbol: "TCS",
      quantity: 2,
      averagePrice: 3912.4,
    });
    expect(user.save).toHaveBeenCalledTimes(1);
    expect(Trade.create).toHaveBeenCalledWith(
      expect.objectContaining({ side: "BUY", quantity: 2, total: 7824.8 }),
    );
  });

  test("buying with insufficient virtual cash leaves the wallet unchanged", async () => {
    const user = makeUser({ walletBalance: 1 });
    User.findById.mockResolvedValue(user);

    const response = await request(app)
      .post("/api/trades")
      .set(authHeader())
      .send({ symbol: "TCS", side: "BUY", quantity: 1 });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/enough virtual cash/i);
    expect(user.walletBalance).toBe(1);
    expect(user.save).not.toHaveBeenCalled();
    expect(Trade.create).not.toHaveBeenCalled();
  });

  test("selling shares adds the proceeds to the wallet", async () => {
    const user = makeUser({
      walletBalance: 1000,
      holdings: [{ symbol: "TCS", quantity: 2, averagePrice: 3800 }],
    });
    User.findById.mockResolvedValue(user);

    const response = await request(app)
      .post("/api/trades")
      .set(authHeader())
      .send({ symbol: "TCS", side: "SELL", quantity: 1 });

    expect(response.status).toBe(201);
    expect(response.body.walletBalance).toBe(4912.4);
    expect(response.body.holdings[0].quantity).toBe(1);
  });

  test("selling shares that are not owned is rejected", async () => {
    const user = makeUser();
    User.findById.mockResolvedValue(user);

    const response = await request(app)
      .post("/api/trades")
      .set(authHeader())
      .send({ symbol: "TCS", side: "SELL", quantity: 1 });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/do not own enough shares/i);
    expect(user.save).not.toHaveBeenCalled();
    expect(Trade.create).not.toHaveBeenCalled();
  });

  test("portfolio returns holdings, wallet balance, and P&L totals", async () => {
    const user = makeUser({
      walletBalance: 96087.6,
      holdings: [{ symbol: "TCS", quantity: 1, averagePrice: 3912.4 }],
    });
    User.findById.mockResolvedValue(user);
    Trade.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          {
            symbol: "TCS",
            side: "BUY",
            quantity: 1,
            price: 3912.4,
            createdAt: new Date("2026-01-01"),
          },
        ]),
      }),
    });

    const response = await request(app)
      .get("/api/portfolio")
      .set(authHeader());

    expect(response.status).toBe(200);
    expect(response.body.walletBalance).toBe(96087.6);
    expect(response.body.holdings[0]).toMatchObject({
      symbol: "TCS",
      quantity: 1,
      investedValue: 3912.4,
    });
    expect(response.body).toHaveProperty("unrealizedPnl");
    expect(response.body).toHaveProperty("realizedPnl", 0);
  });
});
