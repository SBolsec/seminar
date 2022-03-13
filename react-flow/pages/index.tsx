import * as React from "react";

import { PlusCircleIcon } from "@heroicons/react/outline";

import ReactFlow, {
  Background,
  Controls,
  Elements,
  MiniMap,
  Node,
  OnLoadParams,
  removeElements,
  useStoreState,
} from "react-flow-renderer";

import BackgroundVariantSwitcher from "../components/BackgroundVariantSwitcher";
import Button from "../components/Button";
import DiagramProvider, {
  useDiagramContext,
} from "../components/DiagramProvider/DiagramProvider";
import DraggableElement from "../components/DraggableElement";
import RedoButton from "../components/RedoButton";
import SnapToGridButton from "../components/SnapToGridButton";
import Toolbar from "../components/Toolbar";
import UndoButton from "../components/UndoButton";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <DiagramProvider>
        <ToolBar />
        <Diagram />
      </DiagramProvider>
    </div>
  );
}

function ToolBar() {
  const { addNode } = useDiagramContext();

  const onAddNode = () => {
    addNode({
      id: "id",
      type: "input",
      position: { x: 250, y: 5 },
      data: {
        label: "Node",
      },
    });
  };

  return (
    <Toolbar title="React Flow Demo">
      <Toolbar.Segment>
        <UndoButton />
        <RedoButton />
      </Toolbar.Segment>
      <Button onClick={onAddNode}>
        <PlusCircleIcon className="h-6 w-6" />
      </Button>
      <Toolbar.Segment>
        <SnapToGridButton />
      </Toolbar.Segment>
      <Toolbar.Segment>
        <BackgroundVariantSwitcher />
      </Toolbar.Segment>
      <Toolbar.Segment>
        <DraggableElement
          label="Input node"
          type="input"
          className="border border-blue-500"
        />
        <DraggableElement
          label="Default node"
          type="default"
          className="border border-black"
        />
        <DraggableElement
          label="Output node"
          type="output"
          className="border border-red-300"
        />
      </Toolbar.Segment>
    </Toolbar>
  );
}

function Diagram() {
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<OnLoadParams>();

  const {
    elements,
    snapGrid,
    backgroundVariant,
    addNode,
    save,
    onNodeDragStop,
  } = useDiagramContext();
  const snapToGrid = useStoreState((store) => store.snapToGrid);

  const onLoad = (_reactFlowInstance: OnLoadParams) => {
    setReactFlowInstance(_reactFlowInstance);
  };

  const onElementsRemove = (elementsToRemove: Elements) => {
    save(removeElements(elementsToRemove, elements));
  };

  const onDragOver = (event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current!.getBoundingClientRect();
    const newNode: Node = {
      id: "id",
      type: event.dataTransfer.getData("application/reactflow"),
      position: reactFlowInstance!.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }),
    };

    addNode(newNode);
  };

  return (
    <div className="flex flex-grow" ref={reactFlowWrapper}>
      <ReactFlow
        elements={elements}
        deleteKeyCode={46}
        snapGrid={snapGrid}
        snapToGrid={snapToGrid}
        onlyRenderVisibleElements={true}
        onElementsRemove={onElementsRemove}
        onLoad={onLoad}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeDragStop={onNodeDragStop}
      >
        <Background variant={backgroundVariant} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
