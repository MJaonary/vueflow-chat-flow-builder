<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-vue-next";
</script>

<template>
  <div class="h-8 bg-secondary/50 border-t flex items-center px-2">
    <div class="flex gap-1 h-full">
      <!-- Mock Tab -->
      <Button
        variant="ghost"
        size="sm"
        class="h-full rounded-b-none px-4 bg-background border-x border-t border-b-0 hover:bg-background text-xs font-normal shadow-none"
      >
        Page-1
        <ChevronDown class="w-3 h-3 ml-1 opacity-70" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        class="h-full rounded-none px-2 shadow-none"
        title="Add Page"
      >
        <Plus class="w-4 h-4" />
      </Button>
    </div>
  </div>
</template>
