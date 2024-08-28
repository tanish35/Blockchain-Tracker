import { useEffect, useState, useRef } from "react";
//@ts-ignore
import Dracula from "graphdracula"; // Assuming this is correctly installed and imported
import axios from "axios";
import "./App.css";

// Define the type for a transaction
interface Transaction {
  wallet_id: string;
  destination_id: string;
  amount: number;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const paperRef = useRef(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await axios.post<Transaction[]>(
          "/api/wallet/transactions",
          {
            walletId: "9gCSnoGWPfsrsmxKAwEPBzavpEaTdq2f7TJgtoHQGU9j",
          }
        );
        setTransactions(data);

        const Graph = Dracula.Graph;
        const Renderer = Dracula.Renderer.Raphael;
        const Layout = Dracula.Layout.Spring;

        const graph = new Graph();

        data.forEach((transaction) => {
          graph.addEdge(transaction.wallet_id, transaction.destination_id, {
            directed: true,
            label: `${transaction.amount} SOL`,
          });
        });

        const layout = new Layout(graph);

        // Render the graph
        if (paperRef.current) {
          const renderer = new Renderer(paperRef.current, graph, 400, 300);
          renderer.draw();
        }
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div>
      <h1>Transactions</h1>
      {/* <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            {transaction.wallet_id} sent {transaction.amount} SOL to{" "}
            {transaction.destination_id}
          </li>
        ))}
      </ul> */}
      <div ref={paperRef} style={{ width: "400px", height: "300px" }}></div>
    </div>
  );
}

export default App;
