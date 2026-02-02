# 🚀 Dynamic Vue SFC Nodes Guide

This document describes the core engine for creating persistent, interactive, and interconnected custom nodes in your flow builder.

---

## 🛰️ Inter-Node Communication (The Getter)

Nodes are no longer isolated. They can "see" and "touch" each other's state via the globally injected `getNodeData(id)` function.

### How it works:

1. **Target by ID**: Every node in your flow has a unique ID (found in `data.id`).
2. **Access State**: Call `getNodeData('other-node-id')` to get a reactive pointer to that node's state.
3. **Reactive Interaction**: Changes made to the returned object are immediately reflected in the other node and saved to the store.

### Practical Example:

If you have a "Master Controller" node that needs to reset all "Child Nodes":

```javascript
// Inside the Controller's <script>
const resetAll = (childIds) => {
  childIds.forEach((id) => {
    const childState = getNodeData(id);
    if (childState) childState.isActive = false;
  });
};
```

---

## 🔄 Updating Nodes After Definition

Since components are compiled dynamically based on the code stored in your state, updating a node is as simple as updating its `code` property.

1. **Reactive Recompilation**: `CustomNodeRenderer.vue` watches for changes in the `code` string.
2. **Live Reload**: As soon as the code changes (e.g., via the editor modal), the component is instantly recompiled and re-rendered in the flow without a page refresh.

---

## 🌹 Example: "Metabolic Rose" (Persistent & Interconnected)

A beautiful, high-end example using Tailwind CSS and the state engine.

```html
<template>
  <div
    class="w-64 p-1 rounded-3xl bg-gradient-to-br from-rose-500 to-fuchsia-600 shadow-xl group"
  >
    <div class="bg-white rounded-[1.4rem] overflow-hidden">
      <!-- Image & Status -->
      <div class="relative h-24">
        <img
          src="https://images.unsplash.com/photo-1496062031456-07b8f162a322?q=80&w=400"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"
        ></div>
        <div
          class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/30 backdrop-blur-md text-[9px] font-bold text-white border border-white/20"
        >
          HEALTH: {{ data.health || 100 }}%
        </div>
      </div>

      <div class="p-4 space-y-3">
        <div class="space-y-2">
          <h4 class="font-bold text-slate-800 text-sm">Node Interaction</h4>

          <!-- The Chip -->
          <div
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200"
          >
            <span class="truncate max-w-[150px]">
              Target ID:
              <span class="text-slate-900"
                >{{ data.targetId || 'None set' }}</span
              >
            </span>
          </div>
        </div>

        <!-- Input for Inter-node connection -->
        <input
          v-model="data.targetId"
          placeholder="Paste Node ID to link..."
          class="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px] focus:ring-1 ring-rose-300 outline-none"
        />

        <button
          @click="pingTarget"
          class="w-full py-2 rounded-xl bg-slate-900 text-white text-[11px] font-bold hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
        >
          <span>TRANSFER ENERGY</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            class="w-3 h-3"
            stroke="currentColor"
            stroke-width="3"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Flow Points -->
    <Handle
      type="target"
      :position="Position.Top"
      class="!bg-rose-500 !border-white !w-3 !h-3"
    />
    <Handle
      type="source"
      :position="Position.Bottom"
      class="!bg-fuchsia-600 !border-white !w-3 !h-3"
    />
  </div>
</template>

<script>
  export default {
    setup() {
      const pingTarget = () => {
        if (!data.targetId) return alert("Enter a Target Node ID first!");

        const target = getNodeData(data.targetId);
        if (!target) return alert("Node not found!");

        // Access and modify ANOTHER node's state
        target.health = (target.health || 100) + 10;
        data.health = (data.health || 100) - 5;
      };

      return { pingTarget };
    },
  };
</script>
```

---

## 🤖 AI Prompt template

```markdown
[Paste this into your AI Assistant]

"Help me create a custom Vue Flow node for my application.

CONTEXT:

- Framework: Vue.js 3 + Tailwind CSS.
- Persistence: Use an injected 'data' object. Any properties I set on it (e.g. data.value = 10) are saved to the store.
- Interaction: I can call 'getNodeData(id)' to access the 'data' object of other nodes.
- Layout: I must use <Handle /> from @vue-flow/core (type='target'|'source').
- Constraints: No internal imports. All Vue APIs (ref, computed, watch, etc.) are already available.

TASK: Create a [NAME OF NODE] that looks [DESIGN STYLE e.g. futuristic glassmorphism]. It should [SPECIFIC FUNCTIONALITY]."
```
