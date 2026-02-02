<script lang="ts">
// Importing vueflow specific stylesheet
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import "@vue-flow/minimap/dist/style.css";
import "@vue-flow/node-resizer/dist/style.css";
</script>

<script setup lang="ts">
import { ref, provide } from "vue";
import type { Element } from "@vue-flow/core";
import { useStore } from "./stores/main";
import { useKeyboardShortcuts } from "./utils/useKeyboardShortcuts";

// Layout components
import TopMenuBar from "./components/TopMenuBar.vue";
import FlowControls from "./components/FlowControls.vue";
import LeftSidebar from "./components/leftSidebar/LeftSidebar.vue";
import RightSidebar from "./components/rightSidebar/RightSidebar.vue";
import BottomBar from "./components/BottomBar.vue";
import FlowCanvas from "./components/FlowCanvas.vue";
import EditCustomNodeModal from "./components/EditCustomNodeModal.vue";
import EditMarkdownModal from "./components/EditMarkdownModal.vue";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./components/ui/resizable";

const store = useStore();
const elements = ref<Element[]>([]);
const messageToEdit = ref("");
const editingCustomNodeId = ref<string | null>(null);
const isEditCustomNodeModalOpen = ref(false);
const editingMarkdownNodeId = ref<string | null>(null);
const isEditMarkdownModalOpen = ref(false);

// Setup keyboard shortcuts
useKeyboardShortcuts();

// When a node is selected in the canvas, open its editor in the right sidebar.
// Also sync selection into the store so nodes can render selected/highlight state consistently.
const handleEditNode = (id: string) => {
  messageToEdit.value = id;
  if (store.layers) {
    store.layers.messageToEdit = messageToEdit.value;
  }
};

// Opens the fullscreen code editor modal for editing a custom node's Vue component code.
// This is provided to child components (e.g. CustomNodeInfo) via provide/inject.
const openCustomNodeModal = (id: string) => {
  editingCustomNodeId.value = id;
  isEditCustomNodeModalOpen.value = true;
};

// Used by the right sidebar editor (e.g. CustomNodeInfo) to open the fullscreen code editor.
provide("openCustomNodeModal", openCustomNodeModal);

// Opens the fullscreen markdown editor modal for editing a markdown node's content.
const openMarkdownModal = (id: string) => {
  editingMarkdownNodeId.value = id;
  isEditMarkdownModalOpen.value = true;
};

// Used by the right sidebar editor (MarkdownEditor) to open the fullscreen markdown editor.
provide("openMarkdownModal", openMarkdownModal);
</script>

<template>
  <div
    class="flex flex-col h-screen overflow-hidden bg-white font-sans text-base-content"
  >
    <!-- Top Area: Menu + Toolbar -->
    <div class="flex flex-col flex-none z-50">
      <TopMenuBar />
      <FlowControls />
    </div>

    <!-- Main Content Area: Left Sidebar + Canvas + Right Sidebar -->
    <div class="flex flex-1 flex-row overflow-hidden relative">
      <ResizablePanelGroup
        direction="horizontal"
        class="w-full"
      >
        <ResizablePanel
          :default-size="16"
          :min-size="15"
          :max-size="30"
        >
          <LeftSidebar class="h-full w-full" />
        </ResizablePanel>
        <ResizableHandle
          class="w-1 bg-gray-200 hover:bg-blue-300 transition-colors"
        />
        <ResizablePanel
          :default-size="60"
          :min-size="40"
        >
          <FlowCanvas
            v-model:elements="elements"
            class="flex-1 bg-gray-50 h-full relative"
            :message-to-edit="messageToEdit"
            @node-select="handleEditNode"
          />
        </ResizablePanel>
        <ResizableHandle
          class="w-1 bg-gray-200 hover:bg-blue-300 transition-colors"
        />
        <ResizablePanel
          :default-size="16"
          :min-size="15"
          :max-size="30"
        >
          <RightSidebar
            :id="messageToEdit"
            class="h-full w-full"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>

    <!-- Bottom Area: Tabs -->
    <div class="flex-none z-50">
      <BottomBar />
    </div>

    <!-- Edit Custom Node Modal -->
    <EditCustomNodeModal
      v-model:open="isEditCustomNodeModalOpen"
      :node-id="editingCustomNodeId"
    />

    <!-- Edit Markdown Modal -->
    <EditMarkdownModal
      v-model:open="isEditMarkdownModalOpen"
      :node-id="editingMarkdownNodeId"
    />
  </div>
</template>

<style>
/* Global styles override if necessary for clean layout */
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
