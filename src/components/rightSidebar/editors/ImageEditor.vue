<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/stores/main";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      Image Properties
    </div>

    <div class="grid gap-4">
      <!-- Label Input -->
      <div class="grid w-full items-center gap-2">
        <Label for="image-label">Label</Label>
        <Input
          id="image-label"
          v-model="selectedNode.label"
          type="text"
          placeholder="e.g. Hero Image"
        />
      </div>

      <!-- Source Input -->
      <div class="grid w-full items-center gap-2">
        <Label for="image-src">Image Source (URL)</Label>
        <Input
          id="image-src"
          v-model="selectedNode.src"
          type="text"
          :placeholder="store.getDefaultValues.image || 'https://...'"
        />
        <p class="text-[0.8rem] text-muted-foreground">
          Enter the full URL path to the image.
        </p>
      </div>
    </div>
  </div>
</template>
