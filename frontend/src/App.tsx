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
  useReactFlow,
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

        const centerX = 500; // Center X position
        const centerY = 400; // Center Y position
        const radius = 350; // Radius of the circle
        const angleStep = (2 * Math.PI) / 5  // Angle step for each node

        data.forEach((transaction, index) => {
          const angle = index * angleStep;
          const xPos = centerX + radius * Math.cos(angle);
          const yPos = centerY + radius * Math.sin(angle);

          if (!nodesSet.has(transaction.wallet_id)) {
            nodesSet.add(transaction.wallet_id);
            newNodes.push({
              id: transaction.wallet_id,
              data: { label: transaction.wallet_id.length > 10 ? `${transaction.wallet_id.slice(0, 10)}...` : transaction.wallet_id },
              position: { x: xPos, y: yPos },
              style: { backgroundColor: "#ed043a", color: "#000", width: 150, height: 60, fontSize: 16 }, // Increased node size
            });
          }

          if (!nodesSet.has(transaction.destination_id)) {
            nodesSet.add(transaction.destination_id);
            newNodes.push({
              id: transaction.destination_id,
              data: { label: transaction.destination_id.length > 10 ? `${transaction.destination_id.slice(0, 10)}...` : transaction.destination_id },
              position: { x: xPos, y: yPos },
              style: { backgroundColor: "#00af11", color: "#fff", width: 150, height: 60, fontSize: 16 },
            });
          }
          newEdges.push({
            id: `e-${transaction.wallet_id}-${transaction.destination_id}-${index}`,
            source: transaction.wallet_id,
            target: transaction.destination_id,
            label: `${transaction.amount} SOL`,
            animated: true,
            style: { stroke: '#72c2f7' },
            labelStyle: { fontSize: 16, fontWeight: 'bold' }, // Increase font size and make it bold
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
