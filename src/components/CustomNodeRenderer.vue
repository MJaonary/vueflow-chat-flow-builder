<script setup lang="ts">
import {
  ref,
  shallowRef,
  computed,
  watch,
  reactive,
  inject,
  nextTick,
  type Component,
} from "vue";
import { useStore } from "../stores/main";
import { useVueFlow } from "@vue-flow/core";
import { Code2 } from "lucide-vue-next";
import { compileSfc } from "../utils/sfcCompiler";

const props = defineProps<{
  id: string;
  selected: boolean;
}>();

const store = useStore();

const localStates = computed(() => store.getMessageById(props.id));
const customComponent = shallowRef<Component | null>(null);
const compileError = ref("");
const { updateNodeInternals } = useVueFlow();

watch(customComponent, async (newVal) => {
  if (newVal) {
    await nextTick();
    updateNodeInternals([props.id]);
  }
});

// Inject Open Modal Function
const openCustomNodeModal = inject<(id: string) => void>("openCustomNodeModal");

const handleOpenEditor = () => {
  openCustomNodeModal?.(props.id);
};

function refresh() {
  compileError.value = "";
  customComponent.value = null;

  if (!localStates.value || !localStates.value.code) return;

  try {
    // Ensure this node has a data object in the store
    if (!localStates.value.data) {
      localStates.value.data = reactive({});
    }

    // New helper to access other nodes' state
    const getNodeData = (targetId: string) => {
      const message = store.getMessageById(targetId);
      if (message && !message.data) {
        message.data = reactive({});
      }
      return message?.data as Record<string, unknown> | undefined;
    };

    customComponent.value = compileSfc(
      localStates.value.code as string,
      localStates.value.data as Record<string, unknown>,
      getNodeData,
    );
  } catch (e: unknown) {
    compileError.value = e instanceof Error ? e.message : String(e);
  }
}

watch(
  () => (localStates.value as { code?: string })?.code,
  () => refresh(),
  { immediate: true },
);
</script>

<template>
  <div
    v-if="localStates"
    class="relative group"
  >
    <div
      :class="{ 'ring-2 ring-blue-500 ring-offset-2': selected }"
      class="inline-block transition-all"
    >
      <component
        :is="customComponent"
        v-if="customComponent"
      />
      <div
        v-else-if="compileError"
        class="text-red-600 text-xs p-2 bg-white border border-red-200 rounded shadow-lg whitespace-pre-wrap max-w-md"
      >
        <div class="font-bold border-b mb-1 pb-1">
          Compilation Error
        </div>
        {{ compileError }}
      </div>
      <div
        v-else
        class="p-4 bg-white/50 animate-pulse rounded border border-dashed border-gray-300"
      >
        Loading component...
      </div>

      <!-- Quick Action: Edit Button (Hover only) -->
      <div
        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <button
          class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
          title="Edit Component Code"
          @click.stop="handleOpenEditor"
        >
          <Code2 class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
