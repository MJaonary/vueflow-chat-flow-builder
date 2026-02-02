<script setup lang="ts">
import { useStore } from "../stores/main";
import { useFlowState } from "../utils/useFlowState";
import { Button } from "@/components/ui/button";
import { User } from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const store = useStore();
const { onSave, onRestore, triggerImport, fileSelected } = useFlowState();
</script>

<template>
  <div
    class="flex items-center bg-white border-b border-gray-200 px-3 h-14 gap-2 font-sans"
  >
    <div class="w-10 h-10 border-gray-200 border-4 flex-shrink-0" />

    <div class="flex flex-col justify-center flex-1 h-full py-1">
      <div class="flex items-center h-7">
        <input
          v-model="store.layers.name"
          type="text"
          class="text-[14px] font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-100 rounded px-1 transition-all w-full max-w-[400px]"
        >
      </div>
      <div class="flex items-center h-6 gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="sm"
              class="h-6 px-2 text-xs text-gray-600 hover:bg-gray-100 font-normal rounded-sm"
            >
              Fichier
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-52">
            <DropdownMenuItem @click="onSave">
              Save
            </DropdownMenuItem>
            <DropdownMenuItem @click="() => onRestore(false)">
              Restore
            </DropdownMenuItem>
            <DropdownMenuItem @click="triggerImport">
              Import...
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          class="h-6 px-2 text-xs text-gray-400 hover:bg-transparent font-normal rounded-sm cursor-default"
        >
          Modifier
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="h-6 px-2 text-xs text-gray-400 hover:bg-transparent font-normal rounded-sm cursor-default"
        >
          Affichage
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="h-6 px-2 text-xs text-gray-400 hover:bg-transparent font-normal rounded-sm cursor-default"
        >
          Insertion
        </Button>
      </div>
    </div>

    <div class="flex items-center flex-shrink-0">
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8 rounded-full hover:bg-gray-100"
        title="Login"
      >
        <User class="w-5 h-5 text-gray-600" />
      </Button>
    </div>

    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept=".txt,.json"
      @change="fileSelected"
    >
  </div>
</template>
