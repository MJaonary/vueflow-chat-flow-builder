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

defineOptions({
  name: "EditMarkdownModal",
});

const props = defineProps<{
  nodeId: string | null;
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const store = useStore();
const markdown = ref("");

// Prefill editor whenever the dialog opens or node changes.
watch(
  [() => props.open, () => props.nodeId],
  ([open, nodeId]) => {
    if (!open || !nodeId) return;
    const msg = store.getMessageById(nodeId);
    markdown.value = (msg?.content as string | undefined) ?? "";
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
  if (!props.nodeId) return;
  store.$patch((state) => {
    const msg = state.layers.messages.find((m) => m.id === props.nodeId);
    if (msg) {
      msg.content = markdown.value;
    }
  });
  handleClose();
};

// Prevent dialog from intercepting editor keys
const handleKeyDown = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement;
  if (
    target.closest(".monaco-editor") ||
    target.closest("[data-monaco-editor]") ||
    target.tagName === "TEXTAREA"
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
      @keyup="handleKeyDown"
    >
      <DialogHeader class="px-6 py-4 border-b flex-none">
        <DialogTitle>Edit Markdown</DialogTitle>
        <DialogDescription>
          Edit the markdown content for this node.
        </DialogDescription>
      </DialogHeader>

      <div class="flex-1 flex flex-col p-6 gap-4 overflow-hidden min-h-0">
        <div class="flex-1 flex flex-col gap-2 min-h-0">
          <label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Markdown
          </label>

          <div class="flex-1 border rounded-md overflow-hidden relative">
            <MonacoEditor
              v-model="markdown"
              language="markdown"
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
        <Button @click="handleSave">
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
