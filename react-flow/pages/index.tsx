import * as React from "react";

import { PlusCircleIcon } from "@heroicons/react/outline";

import ReactFlow, {
  Background,
  Controls,
  Elements,
  MiniMap,
  removeElements,
  useStoreState,
} from "react-flow-renderer";

import BackgroundVariantSwitcher from "../components/BackgroundVariantSwitcher";
import Button from "../components/Button";
import DiagramProvider, {
  useDiagramContext,
} from "../components/DiagramProvider/DiagramProvider";
import RedoButton from "../components/RedoButton";
import SnapToGridButton from "../components/SnapToGridButton";
import Toolbar from "../components/Toolbar";
import UndoButton from "../components/UndoButton";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <DiagramProvider>
        <ToolBar />
        <div className="flex flex-grow">
          <Diagram />
        </div>
      </DiagramProvider>
    </div>
  );
}

function ToolBar() {
  const { addNode } = useDiagramContext();

  return (
    <Toolbar title="React Flow Demo">
      <Toolbar.Segment>
        <UndoButton />
        <RedoButton />
      </Toolbar.Segment>
      <Button onClick={() => addNode()}>
        <PlusCircleIcon className="h-6 w-6" />
      </Button>
      <Toolbar.Segment>
        <SnapToGridButton />
      </Toolbar.Segment>
      <Toolbar.Segment>
        <BackgroundVariantSwitcher />
      </Toolbar.Segment>
    </Toolbar>
  );
}

function Diagram() {
  const { elements, snapGrid, backgroundVariant, save, onNodeDragStop } =
    useDiagramContext();
  const snapToGrid = useStoreState((store) => store.snapToGrid);

  const onLoad = (reactFlowInstance: { fitView: () => void }) => {
    reactFlowInstance.fitView();
  };

  const onElementsRemove = (elementsToRemove: Elements) => {
    save(removeElements(elementsToRemove, elements));
  };

  return (
    <ReactFlow
      elements={elements}
      deleteKeyCode={46}
      snapGrid={snapGrid}
      snapToGrid={snapToGrid}
      onElementsRemove={onElementsRemove}
      onLoad={onLoad}
      onNodeDragStop={onNodeDragStop}
    >
      <Background variant={backgroundVariant} />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}
