<script setup lang="ts">
import { ref } from "vue";
import { Trash2 } from "lucide-vue-next";
import { useVueFlow } from "@vue-flow/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const { onNodeContextMenu, applyNodeChanges } = useVueFlow("main-flow");

const visible = ref(false);
const x = ref(0);
const y = ref(0);
const nodeId = ref("");

onNodeContextMenu((event) => {
  event.event.preventDefault();
  x.value = (event.event as MouseEvent).clientX;
  y.value = (event.event as MouseEvent).clientY;
  nodeId.value = event.node.id;
  visible.value = true;
});

const handleDelete = () => {
  applyNodeChanges([{ type: "remove", id: nodeId.value }]);
  visible.value = false;
};
</script>

<template>
  <DropdownMenu v-model:open="visible">
    <!-- Hidden trigger positioned at click location -->
    <DropdownMenuTrigger
      as-child
      :style="{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none',
      }"
    >
      <button />
    </DropdownMenuTrigger>
    <DropdownMenuContent @click.stop>
      <DropdownMenuItem
        variant="destructive"
        @click="handleDelete"
      >
        <Trash2 class="h-4 w-4" />
        <span>Delete</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
