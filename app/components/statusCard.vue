<!-- src/components/victim/StatsCard.vue -->
<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
    :class="hoverBorderClass"
  >
    <div class="flex items-center">
      <div class="p-3 rounded-lg mr-4" :class="iconBgClass">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="icon === 'document'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
          <path
            v-if="icon === 'check'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            v-if="icon === 'clock'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">
          {{ value }}
        </p>
      </div>
    </div>
    <div class="mt-4 pt-4 border-t border-gray-100">
      <p class="text-xs text-gray-500">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    default: 0,
  },
  description: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "document",
  },
  color: {
    type: String,
    default: "blue",
  },
});

const colorConfig = {
  blue: {
    iconBg: "bg-blue-50 text-blue-600",
    hoverBorder: "hover:border-blue-500",
  },
  green: {
    iconBg: "bg-green-50 text-green-600",
    hoverBorder: "hover:border-green-500",
  },
  yellow: {
    iconBg: "bg-yellow-50 text-yellow-600",
    hoverBorder: "hover:border-yellow-500",
  },
  purple: {
    iconBg: "bg-purple-50 text-purple-600",
    hoverBorder: "hover:border-purple-500",
  },
  gray: {
    iconBg: "bg-gray-50 text-gray-600",
    hoverBorder: "hover:border-gray-500",
  },
};

const config = colorConfig[props.color] || colorConfig.blue;
const iconBgClass = config.iconBg;
const hoverBorderClass = config.hoverBorder;
</script>