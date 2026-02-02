<script setup lang="ts">
import { ref } from "vue";
import { Copy, Check } from "lucide-vue-next";

const props = defineProps<{
  label?: string;
  value: string;
}>();

const isCopied = ref(false);

const handleCopy = async () => {
  if (!props.value) return;
  try {
    await navigator.clipboard.writeText(props.value);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <span
      v-if="label || $slots.labelIcon || $slots.label"
      class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1"
    >
      <slot name="labelIcon" />
      <slot name="label">{{ label }}</slot>
    </span>

    <button
      type="button"
      class="group relative flex items-center justify-between w-full overflow-hidden rounded-md border bg-muted/40 px-2.5 py-1.5 transition-all hover:bg-muted hover:border-border/80 outline-none focus-visible:ring-2 ring-ring"
      :title="`Click to copy ${label || 'value'}`"
      @click="handleCopy"
    >
      <code class="text-xs font-mono text-foreground truncate mr-6">
        {{ value }}
      </code>

      <div
        class="absolute right-2 flex items-center justify-center bg-muted/40 group-hover:bg-muted pl-2 transition-colors"
      >
        <Check
          v-if="isCopied"
          class="w-3.5 h-3.5 text-emerald-500 scale-100 transition-all"
        />
        <Copy
          v-else
          class="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-all"
        />
      </div>
    </button>
  </div>
</template>
