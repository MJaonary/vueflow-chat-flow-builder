<script setup lang="ts">
import { computed, provide } from "vue";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import type { NodeChange, Connection, Edge, Element } from "@vue-flow/core";

import { Background } from "@vue-flow/background";
import { MiniMap } from "@vue-flow/minimap";

import StartingStep from "./StartingStep.vue";
import MessageContainer from "./MessageContainer.vue";
import ImageContainer from "./ImageContainer.vue";
import Tag from "./Tag.vue";
import MarkdownNode from "./MarkdownNode.vue";
import MessengerNode from "./MessengerNode.vue";
import CustomNodeRenderer from "./CustomNodeRenderer.vue";
import NodeContextMenu from "./NodeContextMenu.vue";

// Custom Connection line and Custom Edge
import CustomConnectionLine from "./CustomConnectionLine.vue";
import CustomEdge from "./CustomEdge.vue";

// Externalise node creation process on Drop here
import { createVueNode } from "../utils/createVueNode";

// Importing Store Pinia
import { useStore } from "../stores/main";

const props = defineProps<{
  elements: Element[];
  messageToEdit: string;
}>();

const emit = defineEmits<{
  (e: "update:elements", value: Element[]): void;
  (e: "node-select", id: string): void;
}>();

const store = useStore();

const vueFlowInstance = useVueFlow("main-flow");
const { addEdges, addNodes, onConnect, onPaneReady, project, findNode, onNodeDragStop, onNodeDrag, nodes } =
  vueFlowInstance;

// Provide Vue Flow instance to all child components for performance
provide('vueFlowInstance', vueFlowInstance);

// Methods that helps, centering the vue.
onPaneReady(({ fitView }) => {
  fitView();
});

const onDragOver = (event: DragEvent): void => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
};

const onDrop = (event: DragEvent): void => {
  createVueNode(event, addNodes, project, store);
};

onConnect((params: Connection) => {
  const edgeParams = { ...params, type: "custom", animated: false } as Edge;
  addEdges([edgeParams]);
});

onNodeDrag(({ node }) => {
  if (node.type?.startsWith("messenger-")) {
    const intersections = nodes.value.filter((n) => {
      if (n.type !== "message-container" || n.id === node.id) return false;
      const nodeRect = { x: node.computedPosition.x, y: node.computedPosition.y, w: node.dimensions.width, h: node.dimensions.height };
      const targetRect = { x: n.computedPosition.x, y: n.computedPosition.y, w: n.dimensions.width, h: n.dimensions.height };
      return (nodeRect.x < targetRect.x + targetRect.w && nodeRect.x + nodeRect.w > targetRect.x && nodeRect.y < targetRect.y + targetRect.h && nodeRect.y + targetRect.h > targetRect.y);
    });

    nodes.value.forEach(n => {
      if (n.type === "message-container") {
        if (intersections.some(i => i.id === n.id)) {
          n.class = "border-messenger-blue border-4";
        } else {
          n.class = "";
        }
      }
    });
  }
});

onNodeDragStop(({ node }) => {
  // Clear classes
  nodes.value.forEach(n => { if (n.type === "message-container") n.class = ""; });

  // If we are dragging a messenger item
  if (node.type?.startsWith("messenger-")) {
    // Manual intersection check
    const container = nodes.value.find(
        (n) =>
          n.type === "message-container" &&
          node.position.x >= n.position.x &&
          node.position.x <= n.position.x + 350 &&
          node.position.y >= n.position.y &&
          node.position.y <= n.position.y + (n.dimensions?.height || 500),
      );

    if (container) {
      // Pin to container
      node.parentNode = container.id;
      node.extent = "parent";
      
      // Vertical Stacking Logic
      const children = nodes.value
        .filter(n => n.parentNode === container.id && n.id !== node.id)
        .sort((a, b) => a.position.y - b.position.y);
      
      // Calculate Y: header is approx 100px (48px top bar + 52px send message area)
      // We want them to stack neatly. 
      // Starting offset inside parent
      const headerOffset = 60; 
      let currentY = headerOffset;
      
      children.forEach(child => {
        child.position = { x: 10, y: currentY };
        currentY += (child.dimensions.height || 100) + 10;
      });
      
      node.position = { x: 10, y: currentY };
      
      // Update parent height
      container.dimensions.height = currentY + (node.dimensions.height || 100) + 20;

    } else if (node.parentNode) {
      // Unpin from container if dragged out
      const parentNode = findNode(node.parentNode);
      if (parentNode) {
        node.position = {
          x: node.computedPosition.x,
          y: node.computedPosition.y,
        };
        node.parentNode = undefined;
        node.extent = undefined;
        
        // Recalculate remaining children positions and parent height
        const remainingChildren = nodes.value
          .filter(n => n.parentNode === parentNode.id)
          .sort((a, b) => a.position.y - b.position.y);
        
        let currentY = 60;
        remainingChildren.forEach(child => {
          child.position = { x: 10, y: currentY };
          currentY += (child.dimensions.height || 100) + 10;
        });
        parentNode.dimensions.height = Math.max(150, currentY + 10);
      }
    }
  }
});

const onPaneClick = (): void => {
  emit("node-select", "");
};

const onChange = (event: NodeChange[]): void => {
  event.forEach((element) => {
    if (element.type === "remove") {
      if (store.layers?.messages) {
        store.layers.messages = store.layers.messages.filter((item) => {
          return item.id !== element.id;
        });
      }
    }

    if (element.type === "select") {
      if (element.selected) {
        emit("node-select", element.id);
      } else if (props.messageToEdit === element.id) {
        // Clear editor if the currently edited node is deselected
        emit("node-select", "");
      }
    }
  });
};

const customNodes = computed(() => {
  if (!store || !Array.isArray(store.getCustomNodes)) return [];
  return store.getCustomNodes;
});

const modelElements = computed({
  get: () => props.elements,
  set: (val: Element[]) => emit("update:elements", val),
});
</script>

<template>
  <div
    v-if="store.layers"
    id="vue_flow"
    class="relative w-full h-full"
    oncontextmenu="return false;"
  >
    <VueFlow
      id="main-flow"
      v-model="modelElements"
      class="customnodeflow"
      :snap-to-grid="true"
      :select-nodes-on-drag="true"
      :only-render-visible-elements="true"
      :max-zoom="50"
      :min-zoom="0.05"
      @dragover="onDragOver"
      @drop="onDrop"
      @nodes-change="onChange"
      @pane-click="onPaneClick"
    >
      <Background
        pattern-color="grey"
        :gap="16"
        :size="1.2"
      />

      <template #connection-line="{ sourceX, sourceY, targetX, targetY }">
        <CustomConnectionLine
          :source-x="sourceX"
          :source-y="sourceY"
          :target-x="targetX"
          :target-y="targetY"
        />
      </template>

      <template #edge-custom="edgeProps">
        <CustomEdge
          v-bind="{
            ...edgeProps,
            style: edgeProps.style
              ? (edgeProps.style as Record<string, unknown>)
              : undefined,
          }"
        />
      </template>

      <template #node-starting-step="nodeProps">
        <StartingStep
          :id="nodeProps.id"
          :selected="nodeProps.selected"
        />
      </template>
      <template #node-message-container="nodeProps">
        <MessageContainer
          :id="nodeProps.id"
          :selected="nodeProps.selected"
        />
      </template>
      <template #node-image="nodeProps">
        <ImageContainer
          :id="nodeProps.id"
          :selected="nodeProps.selected"
        />
      </template>
      <template #node-tag="nodeProps">
        <Tag
          :id="nodeProps.id"
          :selected="nodeProps.selected"
        />
      </template>
      <template #node-markdown="nodeProps">
        <MarkdownNode
          :id="nodeProps.id"
          :selected="nodeProps.selected"
        />
      </template>
      <template #node-messenger-text="nodeProps">
        <MessengerNode
          v-bind="nodeProps"
          type="messenger-text"
        />
      </template>
      <template #node-messenger-image="nodeProps">
        <MessengerNode
          v-bind="nodeProps"
          type="messenger-image"
        />
      </template>
      <template #node-messenger-card="nodeProps">
        <MessengerNode
          v-bind="nodeProps"
          type="messenger-card"
        />
      </template>
      <template #node-messenger-audio="nodeProps">
        <MessengerNode
          v-bind="nodeProps"
          type="messenger-audio"
        />
      </template>
      <template #node-messenger-video="nodeProps">
        <MessengerNode
          v-bind="nodeProps"
          type="messenger-video"
        />
      </template>
      <template #node-messenger-file="nodeProps">
        <MessengerNode
          v-bind="nodeProps"
          type="messenger-file"
        />
      </template>
      <template #node-messenger-delay="nodeProps">
        <MessengerNode
          v-bind="nodeProps"
          type="messenger-delay"
        />
      </template>
      <template #node-messenger-user-input="nodeProps">
        <MessengerNode
          v-bind="nodeProps"
          type="messenger-user-input"
        />
      </template>
      <template #node-messenger-dynamic="nodeProps">
        <MessengerNode
          v-bind="nodeProps"
          type="messenger-dynamic"
        />
      </template>

      <template
        v-for="node in customNodes"
        :key="node.id"
        #[`node-${node.type}`]="nodeProps"
      >
        <CustomNodeRenderer
          :id="nodeProps.id"
          :selected="nodeProps.selected"
        />
      </template>

      <MiniMap v-show="messageToEdit === ''" />
    </VueFlow>
    <NodeContextMenu />
  </div>
</template>
