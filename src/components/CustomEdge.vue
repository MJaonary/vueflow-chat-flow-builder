<script setup lang="ts">
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useVueFlow,
} from "@vue-flow/core";
import type { EdgeChange } from "@vue-flow/core";
import { computed, ref } from "vue";

// Importing SVG icons
import { Trash2 } from "lucide-vue-next";

import { Position } from "@vue-flow/core";

interface EdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  data?: unknown;
  markerEnd?: string;
  style?: Record<string, unknown>;
}

const props = defineProps<EdgeProps>();

const { applyEdgeChanges } = useVueFlow("main-flow");

const onClick = (evt: MouseEvent, id: string): void => {
  applyEdgeChanges([{ type: "remove", id }] as EdgeChange[]);
  evt.stopPropagation();
};

const getBottomLeftEdge = (props: EdgeProps): [string, number, number] => {
  return [
    `
  M ${props.sourceX} ${props.sourceY - 7.5}
  L ${props.sourceX} ${props.sourceY + 15}
  Q ${props.sourceX} ${props.sourceY + 30}
   ${props.sourceX - 15} ${props.sourceY + 30}
  L ${props.targetX - 15} ${props.sourceY + 30}
  Q ${props.targetX - 30} ${props.sourceY + 30}
   ${props.targetX - 30} ${
     props.sourceY + (props.sourceY < props.targetY - 30 ? 45 : 15)
   }
  L ${props.targetX - 30} ${
    props.targetY + (props.sourceY < props.targetY - 30 ? -15 : 15)
  }
  Q  ${props.targetX - 30} ${props.targetY}
    ${props.targetX - 15} ${props.targetY}
  L ${props.targetX} ${props.targetY}
`,
    props.targetX - 15,
    props.targetY,
  ];
};

const getLeftLeftEdge = (props: EdgeProps): [string, number, number] => {
  return [
    `M ${props.sourceX}, ${props.sourceY}
     C ${props.targetX}, ${props.sourceY}
     ${props.targetX}, ${props.targetY}
    ${props.targetX}, ${props.targetY}`,
    props.sourceX - 25,
    props.sourceY,
  ];
};

const getCurvedEdge = (
  props: EdgeProps,
  margin = 8,
): [string, number, number] => {
  return [
    `M${props.sourceX + margin}, ${props.sourceY} C ${props.sourceX} ${
      props.targetY
    } ${props.sourceX} ${props.targetY} ${props.targetX}, ${props.targetY}`,
    (props.sourceX + props.targetX) / 2,
    props.targetY,
  ];
};

const getDirectLine = (props: EdgeProps): [string, number, number] => {
  return [
    `M ${props.sourceX} ${props.sourceY} L ${props.targetX} ${props.targetY}`,
    (props.sourceX + props.targetX) / 2,
    (props.sourceY + props.targetY) / 2,
  ];
};

const validated = (validation: boolean) => {
  if (validation === true) {
    strokeColor.value = "#8492a6";
  } else {
    strokeColor.value = "red";
  }
};

const path = computed(() => {
  /* Q1, Q2, Q3, Q4 stands for Quandrants, the plane is divided by 4 zones.
  Primary axis are vertical and horizontal axis passing through the point (sourceX, sourceY)*/
  const [Q1, Q2, Q3, Q4] = [
    props.sourceX < props.targetX && props.sourceY > props.targetY,
    props.sourceX > props.targetX && props.sourceY > props.targetY,
    props.sourceX > props.targetX && props.sourceY < props.targetY,
    props.sourceX < props.targetX && props.sourceY < props.targetY,
  ];

  if (props.sourcePosition === Position.Left) {
    if (props.targetPosition === Position.Left) {
      validated(Q1 || Q2 || Q4);
      if (Q2) {
        return getLeftLeftEdge(props);
      }
    } else if (props.targetPosition === Position.Right) {
      validated(Q2 || Q3);
      return getBezierPath(props);
    } else if (props.targetPosition === Position.Bottom) {
      // No specific handling needed for Bottom position
      void 0;
    } else {
      // No specific handling needed for other positions
      void 0;
    }

    return getCurvedEdge(props);
  } else if (props.sourcePosition === Position.Right) {
    if (props.targetPosition === Position.Left) {
      validated(Q1 || Q4);
    } else if (props.targetPosition === Position.Right) {
      // No specific handling needed for Right position
      void 0;
    } else if (props.targetPosition === Position.Bottom) {
      validated(Q1);
    } else {
      // No specific handling needed for other positions
      void 0;
    }

    return getBezierPath(props);
  } else if (props.sourcePosition === Position.Bottom) {
    if (props.targetPosition === Position.Left) {
      if (Q3 || Q2) {
        return getBottomLeftEdge(props);
      }
      validated(Q4);
    } else if (props.targetPosition === Position.Right) {
      validated(Q3);
    } else if (props.targetPosition === Position.Bottom) {
      validated(Q3 || Q4);
    } else {
      // No specific handling needed for other positions
      void 0;
    }

    return getCurvedEdge(props, 0);
  } else {
    if (props.targetPosition === Position.Left) {
      // No specific handling needed for Left position
      void 0;
    } else if (props.targetPosition === Position.Right) {
      // No specific handling needed for Right position
      void 0;
    } else if (props.targetPosition === Position.Bottom) {
      // No specific handling needed for Bottom position
      void 0;
    } else {
      // No specific handling needed for other positions
      void 0;
    }
  }

  return getDirectLine(props);
});

// Local variables and props declaration.
let strokeColor = ref("#8492a6");
////////////////////////////////////////////.
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <BaseEdge
    :id="id"
    :style="{
      'stroke-width': 4,
      stroke: strokeColor,
    }"
    :path="path[0]"
    marker-end="url(#triangle)"
    markerWidth="4"
  />

  <defs>
    <marker
      id="triangle"
      viewBox="0 0 1 10"
      refX="1"
      refY="5"
      markerUnits="strokeWidth"
      markerHeight="8"
      markerWidth="8"
      orient="auto"
      :fill="strokeColor"
    >
      <path d="M 0 1.5 L 4 5 L 0 8.5 z" />
    </marker>
  </defs>

  <EdgeLabelRenderer>
    <div
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
        'z-index': 9999,
      }"
      class="nodrag nopan"
    >
      <div
        class="flex justify-center items-center border-2 border-black rounded-2xl p-[0.1rem] bg-[#f2f5f7] text-[rgba(255,0,0,0.796)] hover:scale-120 transition-transform duration-500 delay-100 cursor-pointer"
        @click="(event) => onClick(event, id)"
      >
        <Trash2 class="w-4 h-4" />
      </div>
    </div>
  </EdgeLabelRenderer>
</template>
