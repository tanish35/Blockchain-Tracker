import React from "react";
import { Handle, Position } from "reactflow";

// Define the type for node data
interface CustomNodeData {
  label: string;
}

// Define the type for node props
interface CustomNodeProps {
  data: CustomNodeData;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid black",
        borderRadius: "5px",
      }}
    >
      <div>{data.label}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div
        style={{ backgroundColor: "gray", height: "10px", cursor: "move" }}
        className="drag-handle"
      >
        {/* This area is designated as the drag handle */}
      </div>
    </div>
  );
};

export default CustomNode;
