<script setup lang="ts">
import { ref, watch } from "vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MonacoEditor from "@/components/ui/MonacoEditor.vue";
import { useStore } from "@/stores/main";

const props = defineProps<{
  nodeId: string | null;
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const store = useStore();

// Reactive code editor value
const vueCode = ref("");

// Prefill editor with current node code whenever the dialog opens or the node changes.
watch(
  [() => props.open, () => props.nodeId],
  ([open, nodeId]) => {
    if (!open || !nodeId) return;
    const msg = store.getMessageById(nodeId);
    const code = (msg?.code as string | undefined) ?? "";
    vueCode.value = code;
  },
  { immediate: true },
);

const handleUpdateOpen = (val: boolean) => {
  if (val) {
    emit("update:open", val);
  } else {
    handleClose();
  }
};

const handleClose = () => {
  emit("update:open", false);
};

const handleSave = () => {
  if (props.nodeId && vueCode.value.trim()) {
    store.$patch((state) => {
      const msg = state.layers.messages.find((m) => m.id === props.nodeId);
      if (msg) {
        msg.code = vueCode.value.trim();
      }
    });
    handleClose();
  }
};

// Prevent dialog from intercepting editor keys
const handleKeyDown = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement;
  if (
    target.closest(".monaco-editor") ||
    target.closest("[data-monaco-editor]")
  ) {
    event.stopPropagation();
  }
};
</script>

<template>
  <Dialog
    :open="open"
    @update:open="handleUpdateOpen"
  >
    <DialogContent
      class="w-screen h-screen max-w-none! rounded-none border-none flex flex-col"
      @keydown="handleKeyDown"
    >
      <DialogHeader class="px-6 py-4 border-b flex-none">
        <DialogTitle>Edit Custom Node</DialogTitle>
        <DialogDescription>
          Edit the Vue component code for this custom node.
        </DialogDescription>
      </DialogHeader>

      <!-- Main Body: Flex column to manage available height -->
      <div class="flex-1 flex flex-col p-6 gap-4 overflow-hidden min-h-0">
        <!-- Editor Section (Flex Grow) -->
        <div class="flex-1 flex flex-col gap-2 min-h-0">
          <label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Vue Component Code
          </label>

          <!-- Editor Container: relative for absolute positioning of Monaco -->
          <div
            class="flex-1 border rounded-md overflow-hidden bg-[#1e1e1e] relative"
          >
            <MonacoEditor
              v-model="vueCode"
              language="html"
              theme="vs-dark"
              class="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </div>

      <DialogFooter class="p-4 border-t bg-secondary/30 flex-none">
        <Button
          variant="outline"
          @click="handleClose"
        >
          Cancel
        </Button>
        <Button
          :disabled="!vueCode.trim()"
          @click="handleSave"
        >
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
