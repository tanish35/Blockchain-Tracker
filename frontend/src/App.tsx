import { useEffect, useState } from "react";
import axios from "axios";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";

interface Transaction {
  wallet_id: string;
  destination_id: string;
  amount: number;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await axios.post<Transaction[]>(
          "/api/wallet/transactions",
          {
            walletId: "F9WFjLnXr4jrM4TfEmkKCdvvcT3iMxqvumHV9nPp74T2",
          }
        );
        setTransactions(data);
        const nodesSet = new Set<string>();
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        data.forEach((transaction, index) => {
          if (!nodesSet.has(transaction.wallet_id)) {
            nodesSet.add(transaction.wallet_id);
            newNodes.push({
              id: transaction.wallet_id,
              data: { label: transaction.wallet_id },
              position: {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              },
            });
          }
          if (!nodesSet.has(transaction.destination_id)) {
            nodesSet.add(transaction.destination_id);
            newNodes.push({
              id: transaction.destination_id,
              data: { label: transaction.destination_id },
              position: {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              },
            });
          }
          newEdges.push({
            id: `e-${transaction.wallet_id}-${transaction.destination_id}-${index}`,
            source: transaction.wallet_id,
            target: transaction.destination_id,
            label: `${transaction.amount} SOL`,
            animated: true,
          });
        });

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };
    fetchTransactions();
  }, []);

  const handleNodeChange = (changes: any) => {
    setNodes((nodes) => applyNodeChanges(changes, nodes));
  };

  const handleEdgeChange = (changes: any) => {
    setEdges((edges) => applyEdgeChanges(changes, edges));
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodeChange}
        onEdgesChange={handleEdgeChange}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default App;
