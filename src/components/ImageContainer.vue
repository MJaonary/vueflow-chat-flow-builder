<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Handle, Position } from "@vue-flow/core";
import { useStore } from "../stores/main";

const props = defineProps<{
  id: string;
  selected: boolean;
}>();

// Local State
const selectedColor = ref(false);

// Store
const store = useStore();

// Computed
const localStates = computed(() => store.getMessageById(props.id));
const default_image_src_value = computed(() => store.getDefaultValues.image);

// Watcher for selection styling
watch(
  () => props.selected,
  (isSelected) => (selectedColor.value = isSelected),
);
</script>

<template>
  <div
    v-if="localStates"
    :id="id"
    class="group flex flex-col rounded-xl bg-white transition-all duration-300 ease-in-out"
    :class="[
      selectedColor
        ? 'ring-2 ring-indigo-500 shadow-xl'
        : 'ring-1 ring-gray-200 shadow-md hover:shadow-lg hover:ring-gray-300',
    ]"
    :style="{
      width: localStates.width || '240px',
      // Allow height to be auto so it fits content, or use fixed if strictly required
      minHeight: localStates.height || 'auto',
    }"
  >
    <!-- Header / Label Section -->
    <div
      class="flex items-center justify-center border-b border-gray-100 bg-gray-50 px-4 py-2 rounded-t-xl"
    >
      <input
        v-model="localStates.label"
        type="text"
        class="nodrag w-full bg-transparent text-xs font-semibold text-gray-700 outline-none placeholder:text-gray-400 focus:text-foreground"
        placeholder="Node Label"
      >
    </div>

    <!-- Body / Image Section -->
    <div class="relative flex flex-1 overflow-hidden p-1">
      <div
        class="relative w-full h-full overflow-hidden rounded-lg bg-gray-100"
      >
        <img
          :src="localStates.src || default_image_src_value"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          :alt="String(localStates.label || 'Image')"
          :style="{
            height: localStates.height
              ? `calc(${localStates.height} - 50px)`
              : '200px',
          }"
        >
      </div>
    </div>

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
  </div>
</template>
