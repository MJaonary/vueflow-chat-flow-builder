<script setup lang="ts">
import { ref, computed, watch, inject } from "vue";
import { Handle, Position } from "@vue-flow/core";
import { NodeResizer } from "@vue-flow/node-resizer";

// Import marked for markdown rendering
import { marked } from "marked";
// Import DOMPurify for HTML sanitization
import DOMPurify from "dompurify";

// Importing Store Pinia
import { useStore } from "../stores/main";
import { Code2 } from "lucide-vue-next";

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

// Rendered Markdown
const renderedMarkdown = computed(() => {
  if (!localStates.value || !localStates.value.content) {
    return "<p class='text-muted-foreground text-sm'>Use the editor button to edit markdown...</p>";
  }
  const result = marked(localStates.value.content);
  // Ensure we return a string (marked can return Promise<string> in async mode)
  const html = typeof result === "string" ? result : String(result);
  // Sanitize HTML to prevent XSS attacks
  return DOMPurify.sanitize(html);
});

// Watch Selection
watch(
  () => props.selected,
  (isSelected) => (selectedColor.value = isSelected),
);

// Inject Open Modal Function
const openMarkdownModal = inject<(id: string) => void>("openMarkdownModal");

const handleOpenEditor = () => {
  openMarkdownModal?.(props.id);
};
</script>

<template>
  <NodeResizer
    :min-width="150"
    :min-height="100"
    :is-resizable="selected"
    :color="selectedColor ? 'var(--primary)' : 'transparent'"
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
    <!-- Node Container -->
    <div
      class="w-full h-full bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden flex flex-col transition-all duration-200 group relative"
      :class="{
        'ring-2 ring-primary ring-offset-1': selectedColor,
        'hover:shadow-md': !selectedColor,
      }"
    >
      <!-- Rendered Content Area -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div
        class="w-full p-4 overflow-hidden text-left"
        v-html="renderedMarkdown"
      />

      <!-- Quick Action: Edit Button (Hover only) -->
      <div
        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <button
          class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/90 text-primary-foreground shadow-sm hover:bg-primary transition-colors"
          title="Edit Markdown"
          @click.stop="handleOpenEditor"
        >
          <Code2 class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
