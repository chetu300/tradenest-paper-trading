import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "./formatCurrency.js";

export function downloadStatement({ user, portfolio }) {
  const document = new jsPDF();
  const generatedAt = new Date().toLocaleString("en-IN");

  document.setFontSize(18);
  document.text("TradeNest portfolio statement", 14, 18);
  document.setFontSize(10);
  document.text(`Account: ${user?.name || "Trader"} (${user?.email || ""})`, 14, 26);
  document.text(`Generated: ${generatedAt}`, 14, 32);
  document.text(`Virtual cash: ${formatCurrency(portfolio.walletBalance)}`, 14, 40);
  document.text(`Realized P&L: ${formatCurrency(portfolio.realizedPnl)}`, 14, 46);
  document.text(`Unrealized P&L: ${formatCurrency(portfolio.unrealizedPnl)}`, 14, 52);
  document.setFontSize(11);
  document.text(`Total P&L: ${formatCurrency(portfolio.totalPnl)}`, 14, 61);

  autoTable(document, {
    startY: 68,
    head: [["Date", "Stock", "Side", "Shares", "Price", "Total"]],
    body: (portfolio.trades || []).map((trade) => [
      trade.createdAt ? new Date(trade.createdAt).toLocaleDateString("en-IN") : "—",
      trade.symbol,
      trade.side,
      String(trade.quantity),
      formatCurrency(trade.price),
      formatCurrency(trade.total),
    ]),
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  document.save("tradenest-portfolio-statement.pdf");
}
