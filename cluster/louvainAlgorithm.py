import networkx as nx
import pandas as pd
import matplotlib.pyplot as plt
from community import community_louvain

df = pd.read_csv('transaction.csv')

G = nx.DiGraph()

for index, row in df.iterrows():
    G.add_edge(row['wallet_id'], row['destination_id'], 
               transaction_id=row['transaction_id'],
               transaction_value=row['amount'])


partition = community_louvain.best_partition(G.to_undirected())

communities = {}
for node, comm in partition.items():
    if comm not in communities:
        communities[comm] = []
    communities[comm].append(node)

def plot_communities(G, communities):
    plt.figure(figsize=(15, 12))
    pos = nx.spring_layout(G, k=0.5, iterations=50)  # Adjust k and iterations for better spacing
    colors = [plt.cm.rainbow(i / len(communities)) for i in range(len(communities))]

    for i, (comm_id, comm_nodes) in enumerate(communities.items()):
        nx.draw_networkx_nodes(G, pos, nodelist=comm_nodes, node_color=[colors[i]], node_size=500)
    
    nx.draw_networkx_edges(G, pos, alpha=0.3)
    nx.draw_networkx_labels(G, pos, font_size=12, font_color='black')
    plt.title('Communities Visualization')
    plt.show()

plot_communities(G, communities)

def find_most_connected_community(G, communities):
    max_connections = 0
    most_connected_community = None
    
    for comm_id, comm_nodes in communities.items():
        subgraph = G.subgraph(comm_nodes)
        connected_communities = set()
        
        for node in comm_nodes:
            neighbors = set(G.neighbors(node)) | set(G.predecessors(node))
            for neighbor in neighbors:
                neighbor_comm = partition.get(neighbor)
                if neighbor_comm != comm_id:
                    connected_communities.add(neighbor_comm)
        
        connection_score = sum(len(communities[comm]) for comm in connected_communities)
        
        if connection_score > max_connections:
            max_connections = connection_score
            most_connected_community = comm_nodes
    
    return most_connected_community

most_connected_community = find_most_connected_community(G, communities)

plt.figure(figsize=(15, 12))
pos = nx.spring_layout(G, k=0.5, iterations=50) 
nx.draw_networkx_nodes(G, pos, nodelist=most_connected_community, node_color='lightblue', node_size=500)
nx.draw_networkx_edges(G, pos, alpha=0.3)
nx.draw_networkx_labels(G, pos, font_size=12, font_color='black')
plt.title('Most Connected Community')
plt.show()