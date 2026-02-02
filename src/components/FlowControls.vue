<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize, Undo2, Redo2 } from "lucide-vue-next";

const { zoomIn, zoomOut, fitView } = useVueFlow("main-flow");

const onUndo = () => {
  // TODO: Implement undo functionality
  console.log("Undo not yet implemented");
};

const onRedo = () => {
  // TODO: Implement redo functionality
  console.log("Redo not yet implemented");
};
</script>

<template>
  <div
    class="flex items-center gap-1 px-2 py-1 border-b bg-[#f5f5f580] h-10 w-full overflow-x-auto no-scrollbar"
  >
    <div class="flex items-center">
      <div class="flex items-center border-gray-300 pl-1 ml-1 h-6">
        <Button
          variant="ghost"
          size="icon"
          class="h-7 w-7 text-gray-600 hover:bg-gray-200"
          @click="() => zoomIn()"
        >
          <ZoomIn class="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="h-7 w-7 text-gray-600 hover:bg-gray-200"
          @click="() => zoomOut()"
        >
          <ZoomOut class="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          class="h-7 px-2"
          title="Fit View"
          @click="() => fitView()"
        >
          <Maximize class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <div class="h-6 border-l border-gray-300 mx-1" />

    <div class="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        class="h-7 w-7 text-gray-600 hover:bg-gray-200"
        title="Undo"
        @click="onUndo"
      >
        <Undo2 class="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-7 w-7 text-gray-600 hover:bg-gray-200"
        title="Redo"
        @click="onRedo"
      >
        <Redo2 class="w-4 h-4" />
      </Button>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
