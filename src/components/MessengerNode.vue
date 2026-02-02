<script setup lang="ts">
import { computed, inject, type Component } from "vue";
import { useStore } from "../stores/main";
import { useVueFlow } from "@vue-flow/core";
import { GripVertical } from "lucide-vue-next";

import MessengerText from "./messengerItems/MessengerText.vue";
import MessengerCard from "./messengerItems/MessengerCard.vue";
import MessengerImage from "./messengerItems/MessengerImage.vue";
import MessengerAudio from "./messengerItems/MessengerAudio.vue";
import MessengerVideo from "./messengerItems/MessengerVideo.vue";
import MessengerFile from "./messengerItems/MessengerFile.vue";
import MessengerDelay from "./messengerItems/MessengerDelay.vue";
import MessengerUserInput from "./messengerItems/MessengerUserInput.vue";
import MessengerDynamic from "./messengerItems/MessengerDynamic.vue";

const props = defineProps<{
  id: string;
  type: string;
  selected: boolean;
}>();

const store = useStore();

// Performance optimization: use inject to share Vue Flow instance
// Falls back to useVueFlow if not provided (for backwards compatibility)
const vueFlowInstance = inject('vueFlowInstance', null);
const { findNode } = vueFlowInstance ?? useVueFlow("main-flow");

const localItems = computed(() => {
  // In the new architecture, each node IS a message entry in the store
  return store.getMessageById(props.id);
});

// Memoized parent lookup - only recomputes when props.id changes
const currentNode = computed(() => findNode(props.id));
const parentNodeId = computed(() => currentNode.value?.parentNode);

const componentsMap: Record<string, Component> = {
  "messenger-text": MessengerText,
  "messenger-card": MessengerCard,
  "messenger-image": MessengerImage,
  "messenger-audio": MessengerAudio,
  "messenger-video": MessengerVideo,
  "messenger-file": MessengerFile,
  "messenger-delay": MessengerDelay,
  "messenger-user-input": MessengerUserInput,
  "messenger-dynamic": MessengerDynamic,
};

const activeComponent = computed(() => componentsMap[props.type]);
</script>

<template>
  <Teleport
    v-if="parentNodeId"
    :to="`#message-container-${parentNodeId}`"
    :disabled="!parentNodeId"
  >
    <div
      class="messenger-node relative group"
      :class="{ 'selected': selected }"
    >
      <!-- Drag handle for reordering -->
      <div class="drag-handle absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10">
        <GripVertical class="w-5 h-5 text-gray-400" />
      </div>
      <component
        :is="activeComponent"
        v-if="localItems"
        :id="id"
        :mid="id"
        :editor="false"
      />
    </div>
  </Teleport>
  <div
    v-else
    class="messenger-node"
    :class="{ 'selected': selected }"
  >
    <component
      :is="activeComponent"
      v-if="localItems"
      :id="id"
      :mid="id"
      :editor="false"
    />
  </div>
</template>

<style scoped>
.messenger-node {
  width: 350px;
  background: transparent;
}

.messenger-node.selected {
  outline: 2px solid #0084ff;
  border-radius: 1rem;
}
</style>
