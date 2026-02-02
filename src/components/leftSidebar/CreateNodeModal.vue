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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MonacoEditor from "@/components/ui/MonacoEditor.vue";

const props = defineProps<{
  show: boolean;
  initialData?: {
    id: string;
    name: string;
    type: string;
    code: string;
    logoColor?: string;
  } | null;
}>();

const emit = defineEmits(["close", "submit"]);

const nodeName = ref("");
const vueCode = ref(
  (
    `<template>
  <!-- Full control: Use SVG for polygons -->
  <div class="relative group p-2">
    <svg width="100" height="100" viewBox="0 0 100 100" class="drop-shadow-md">
      <polygon 
        points="50,5 95,25 95,75 50,95 5,75 5,25" 
        fill="#3b82f6" 
        stroke="#1d4ed8" 
        stroke-width="2"
      />
      <text x="50" y="55" font-size="12" text-anchor="middle" fill="white" font-weight="bold">
        HEXAGON
      </text>
    </svg>
    
    <!-- You can still use Handles inside if you want custom positioning -->
    <Handle type="target" :position="Position.Left" style="background: #1d4ed8" />
    <Handle type="source" :position="Position.Right" style="background: #1d4ed8" />
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
</` + `script>`
  ).trim(),
);

// Watch for initialData to populate form when editing
watch(
  () => props.initialData,
  (data) => {
    if (data) {
      nodeName.value = data.name;
      vueCode.value = data.code;
    } else {
      nodeName.value = "";
      vueCode.value = (
        `<template>
  <!-- Full control: Use SVG for polygons -->
  <div class="relative group p-2">
    <svg width="100" height="100" viewBox="0 0 100 100" class="drop-shadow-md">
      <polygon 
        points="50,5 95,25 95,75 50,95 5,75 5,25" 
        fill="#3b82f6" 
        stroke="#1d4ed8" 
        stroke-width="2"
      />
      <text x="50" y="55" font-size="12" text-anchor="middle" fill="white" font-weight="bold">
        HEXAGON
      </text>
    </svg>
    
    <!-- You can still use Handles inside if you want custom positioning -->
    <Handle type="target" :position="Position.Left" style="background: #1d4ed8" />
    <Handle type="source" :position="Position.Right" style="background: #1d4ed8" />
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
</` + `script>`
      ).trim();
    }
  },
  { immediate: true },
);

const handleSubmit = () => {
  if (nodeName.value.trim() && vueCode.value.trim()) {
    emit("submit", {
      name: nodeName.value.trim(),
      code: vueCode.value.trim(),
    });
    // Reset form
    nodeName.value = "";
    vueCode.value = "";
  }
};

const handleUpdateShow = (val: boolean) => {
  if (!val) {
    handleClose();
  }
};

const handleClose = () => {
  nodeName.value = "";
  vueCode.value = "";
  emit("close");
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
    :open="show"
    @update:open="handleUpdateShow"
  >
    <DialogContent
      class="w-screen h-screen max-w-none! rounded-none border-none flex flex-col"
      @keydown="handleKeyDown"
    >
      <DialogHeader class="px-6 py-4 border-b flex-none">
        <DialogTitle>Create Custom Node</DialogTitle>
        <DialogDescription>
          Enter basic information and Vue component code.
          <div class="mt-2 p-2 bg-muted/50 rounded text-xs border border-border/50">
            <strong>Principle:</strong> Your code is dynamically compiled into a functional Vue component.
            Use <code>&lt;template&gt;</code> for UI and <code>&lt;script setup&gt;</code> for logic.
            You can import <code>Handle</code> and <code>Position</code> from <code>@vue-flow/core</code>.
          </div>
        </DialogDescription>
      </DialogHeader>

      <!-- Main Body: Flex column to manage available height -->
      <div class="flex-1 flex flex-col p-6 gap-4 overflow-hidden min-h-0">
        <!-- Node Name Section (Static Height) -->
        <div class="flex-none space-y-2">
          <label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Node Name
          </label>
          <Input
            v-model="nodeName"
            type="text"
            placeholder="Enter node name"
          />
        </div>

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
          :disabled="!nodeName.trim() || !vueCode.trim()"
          @click="handleSubmit"
        >
          Create Node
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
