import { useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import timelineData from "../data/Timeline.json";

function TimelineNode({ data }) {
  return (
    <div className="max-w-xs rounded-xl border-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3"
      style={{ borderColor: data.color }}
    >
      <strong style={{ color: data.color }} className="block">{data.year}</strong>
      <h4 className="font-semibold">{data.title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300">{data.description}</p>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = { timelineNode: TimelineNode };

export default function AiTimeline() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    let tempNodes = [];
    let tempEdges = [];
    let xOffsets = { blue: 0, green: 400, yellow: 800, mix: 1200 };

    timelineData.forEach((category, catIndex) => {
      category.events.forEach((event, i) => {
        const nodeId = `${category.category}-${i}`;
        tempNodes.push({
          id: nodeId,
          type: "timelineNode",
          position: { x: xOffsets[category.color], y: i * 250 },
          data: {
            ...event,
            color:
              category.color === "blue"
                ? "#007bff"
                : category.color === "green"
                ? "#28a745"
                : category.color === "yellow"
                ? "#ffc107"
                : "#6f42c1",
          },
        });

        if (i > 0) {
          const prevId = `${category.category}-${i - 1}`;
          tempEdges.push({ id: `e-${prevId}-${nodeId}`, source: prevId, target: nodeId });
        }
      });
    });

    setNodes(tempNodes);
    setEdges(tempEdges);
  }, []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
