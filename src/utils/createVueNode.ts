import type { Node } from "@vue-flow/core";
import getId from "./randomId";
import { nodeRegistry, getCustomNodeDefinition } from "./nodeRegistry";
import type { NodeDefinition } from "./nodeRegistry";

interface StoreMessage {
  id: string;
  type: string;
  editor?: string;
  label?: string;
  color?: string;
  items?: Array<{ id: string; [key: string]: unknown }>;
  content?: string;
  width?: string;
  height?: string;
  src?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  [key: string]: unknown;
}

interface StoreState {
  layers: {
    messages: StoreMessage[];
    customNodes?: Array<{
      id: string;
      name: string;
      type: string;
      code: string;
      logoColor?: string;
    }>;
  };
}

interface Store {
  $patch: (fn: (state: StoreState) => void) => void;
  layers?: StoreState["layers"];
}

const createVueNode = (
  event: DragEvent,
  addNodes: (nodes: Node[]) => void,
  project: (position: { x: number; y: number }) => { x: number; y: number },
  store: Store,
): void => {
  const id = getId();

  const type = event.dataTransfer?.getData("application/vueflow");
  if (!type) {
    console.warn("No node type found in dataTransfer");
    return;
  }
  const target = event.target as HTMLElement;
  const vueFlowContainer = target.closest(".vue-flow");

  let x = event.clientX;
  let y = event.clientY;

  if (vueFlowContainer) {
    const rect = vueFlowContainer.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;
  } else {
    // Fallback to old behavior if container not found, but log it
    console.warn("Vue Flow container not found in drop event target hierarchy");
    x -= 450;
    y -= 20;
  }

  const position = project({ x, y });
  let nodeDef: NodeDefinition | undefined = nodeRegistry[type];

  // If not in registry, check if it's a custom node
  if (!nodeDef && type.startsWith("custom-")) {
    const customNode = store.layers?.customNodes?.find(
      (node) => node.type === type,
    );
    if (customNode) {
      nodeDef = getCustomNodeDefinition(
        type,
        customNode.name,
        customNode.code,
        customNode.logoColor,
      );
    }
  }

  const newNode: Node = {
    id: type + id,
    type,
    position,
    data: { label: `${type} node` },
    draggable: nodeDef?.draggable,
  };

  if (nodeDef) {
    store.$patch((state) => {
      state.layers.messages.push({
        ...nodeDef!.getDefaultData(newNode.id),
        editor: nodeDef!.editor,
      } as StoreMessage);
    });
  } else {
    console.warn(`No definition found for node type: ${type}`);
  }

  addNodes([newNode]);
};

export { createVueNode };
