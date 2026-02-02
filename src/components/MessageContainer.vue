<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Handle, Position } from "@vue-flow/core";

// Importing Store Pinia
import { useStore } from "../stores/main";

// Importing SVG icons
import { MessageCircle } from "lucide-vue-next";

// Local variables and props declaration
let selectedColor = ref(false);
const props = defineProps<{
  id: string;
  selected: boolean;
}>();

// Usage of Store Pinia
const store = useStore();

// Computed Values from Store
const localStates = computed(() => {
  return store.getMessageById(props.id);
});

const messageToEdit = computed(() => {
  return store.layers.messageToEdit;
});

// Watching Selected Manual event
watch(
  () => props.selected,
  (isSelected) => (selectedColor.value = isSelected),
);
////////////////////////////////////////////.
</script>

<template>
  <Handle
    :id="id + 'left'"
    type="target"
    :position="Position.Left"
  />
  <Handle
    :id="id + 'right'"
    type="source"
    :position="Position.Right"
  />
  <Handle
    :id="id + 'bottom'"
    type="source"
    :position="Position.Bottom"
  />

  <div class="flex flex-col items-center">
    <div
      v-if="localStates"
      class="node-drag-handle node-header flex justify-center items-center absolute left-1/2 -translate-x-1/2 -translate-y-full px-4 py-[5px] clear-left w-full border-2 border-b-transparent rounded-t-2xl bg-white p-0 cursor-move shadow-md"
    >
      <input
        v-model="localStates.label"
        type="text"
        class="nodrag w-[calc(100%-1rem)] m-[0.2rem] p-0 outline-transparent border-transparent text-center cursor-text"
      >
    </div>

    <div
      class="max-w-[calc(23rem+6px)] border-black rounded-2xl -mt-px shadow-md hover:border-indigo-500 hover:rounded-b-2xl"
      :class="{ 'border-[3px] border-red-500': messageToEdit == id }"
    >
      <div
        class="node-header border-b border-border-gray bg-white w-[23rem] h-12 text-base text-left pl-2 pt-[0.3rem]"
      >
        <div class="flex items-center">
          <div class="w-8 h-8">
            <MessageCircle class="w-8 h-8 text-indigo-500 fill-current" />
          </div>
          <div class="p-2 flex flex-col">
            <div class="text-xs text-gray-400 h-2">
              Message
            </div>
            <div>Send Message</div>
          </div>
        </div>
      </div>
      <div
        :id="`message-container-${id}`"
        class="bg-gray-50 px-2 py-2 w-full min-h-[100px] rounded-b-2xl flex flex-col gap-2"
      >
        <!-- Messenger items will be teleported here -->
      </div>
    </div>
  </div>
</template>
