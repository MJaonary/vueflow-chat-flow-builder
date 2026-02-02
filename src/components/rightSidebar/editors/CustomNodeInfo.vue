<script setup lang="ts">
import { inject } from "vue";
import { Button } from "@/components/ui/button";
import { Code2, Fingerprint, FileCode } from "lucide-vue-next";
import CopyBadge from "@/components/ui/CopyBadge.vue";

const props = defineProps<{
  id: string;
}>();

const openCustomNodeModal = inject<(id: string) => void>("openCustomNodeModal");

const handleOpenEditor = () => {
  openCustomNodeModal?.(props.id);
};
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <CopyBadge :value="id">
      <template #labelIcon>
        <Fingerprint class="w-3 h-3" />
      </template>
      <template #label>
        Node Identifier
      </template>
    </CopyBadge>

    <div class="flex flex-col gap-1.5">
      <span
        class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1"
      >
        <FileCode class="w-3 h-3" />
        Component Source
      </span>

      <Button
        variant="outline"
        class="w-full justify-start border-dashed hover:border-solid hover:bg-secondary/50"
        @click="handleOpenEditor"
      >
        <Code2 class="w-4 h-4 mr-2 text-primary" />
        <span>Open Editor</span>
      </Button>
    </div>
  </div>
</template>
