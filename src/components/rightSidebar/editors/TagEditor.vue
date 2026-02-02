<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/stores/main";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

defineOptions({
  name: "TagEditor",
});

const props = defineProps<{
  id: string;
}>();

const store = useStore();

const selectedNode = computed(() => {
  return store.getMessageById(props.id);
});
</script>

<template>
  <div
    v-if="selectedNode"
    class="flex flex-col gap-6 p-4"
  >
    <div class="text-sm font-semibold leading-none tracking-tight">
      Tag Properties
    </div>

    <div class="grid gap-4">
      <!-- Label Input -->
      <div class="grid w-full items-center gap-2">
        <Label for="tag-label">Label</Label>
        <Input
          id="tag-label"
          v-model="selectedNode.label"
          type="text"
          placeholder="e.g. Tag Label"
        />
      </div>

      <!-- Title Input -->
      <div class="grid w-full items-center gap-2">
        <Label for="tag-title">Title</Label>
        <Input
          id="tag-title"
          v-model="selectedNode.title"
          type="text"
          placeholder="e.g. Tag Title"
        />
      </div>

      <!-- Subtitle Input -->
      <div class="grid w-full items-center gap-2">
        <Label for="tag-subtitle">Subtitle</Label>
        <Textarea
          id="tag-subtitle"
          v-model="selectedNode.subtitle"
          placeholder="e.g. Tag Subtitle"
          class="min-h-[100px]"
        />
        <p class="text-[0.8rem] text-muted-foreground">
          Enter the subtitle text for the tag.
        </p>
      </div>
    </div>
  </div>
</template>
