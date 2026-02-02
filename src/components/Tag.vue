<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Handle, Position } from "@vue-flow/core";
import { NodeResizer } from "@vue-flow/node-resizer";
import { Textarea } from "@/components/ui/textarea";

// Importing Store Pinia
import { useStore } from "../stores/main.js";

// Define component name to satisfy vue/multi-word-component-names rule
defineOptions({
  name: "TagNode",
});

// Local variables and props declaration
const selectedColor = ref(false);
const props = defineProps<{
  id: string;
  selected: boolean;
}>();

// Usage of Store Pinia
const store = useStore();

// Computed Values from Store.
const localStates = computed(() => {
  return store.getMessageById(props.id);
});

// Watching Selected Manual event
watch(
  () => props.selected,
  (isSelected) => (selectedColor.value = isSelected),
);
</script>

<template>
  <NodeResizer
    v-if="selected"
    :min-width="100"
    :min-height="30"
  />

  <!-- Handle for different utilities -->
  <Handle
    id="right"
    type="source"
    :position="Position.Right"
  />
  <Handle
    id="left"
    type="target"
    :position="Position.Left"
  />
  <Handle
    id="bottom"
    type="source"
    :position="Position.Bottom"
  />
  <!-- Handle for different utilities -->

  <div
    v-if="localStates"
    class="w-full h-full flex flex-col"
  >
    <div
      class="w-full h-full bg-card text-card-foreground rounded-xl border border-border shadow-sm flex flex-col overflow-hidden transition-all duration-200"
      :class="{
        'ring-2 ring-primary ring-offset-1': selectedColor,
        'hover:shadow-md': !selectedColor,
      }"
    >
      <!-- Header / Label -->
      <div
        class="px-4 py-2 border-b border-border/50 bg-muted/20 flex items-center"
      >
        <input
          v-model="localStates.label"
          class="w-full bg-transparent text-xs font-semibold tracking-wide text-muted-foreground focus:outline-none transition-colors hover:text-foreground focus:text-foreground"
          placeholder="LABEL"
        >
      </div>

      <!-- Body -->
      <div class="flex flex-col flex-1 p-3 gap-2 min-h-0 bg-card">
        <!-- Title -->
        <input
          v-model="localStates.title"
          class="w-full bg-transparent text-base font-bold text-foreground focus:outline-none placeholder:text-muted-foreground/40"
          placeholder="Title"
        >

        <!-- Subtitle -->
        <div class="flex-1 w-full min-h-0 relative">
          <Textarea
            :id="id + 'subtitle'"
            v-model="localStates.subtitle"
            placeholder="Subtitle"
            class="w-full h-full resize-none border-none shadow-none p-0 text-sm text-muted-foreground focus-visible:ring-0 bg-transparent min-h-[40px]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
