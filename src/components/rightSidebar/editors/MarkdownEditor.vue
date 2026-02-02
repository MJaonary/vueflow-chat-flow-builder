<script setup lang="ts">
import { inject } from "vue";
import { Button } from "@/components/ui/button";
import { Code2, FileText } from "lucide-vue-next";

defineOptions({
  name: "MarkdownEditor",
});

const props = defineProps<{
  id: string;
}>();

const openMarkdownModal = inject<(id: string) => void>("openMarkdownModal");

const handleOpenEditor = () => {
  openMarkdownModal?.(props.id);
};
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex flex-col gap-1.5">
      <span
        class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1"
      >
        <FileText class="w-3 h-3" />
        Markdown Content
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
