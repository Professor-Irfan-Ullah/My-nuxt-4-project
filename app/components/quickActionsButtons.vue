
<template>
  <button
    @click="handleClick"
    :disabled="disabled"
    class="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200 text-left disabled:cursor-not-allowed disabled:opacity-50"
    :class="disabled ? '' : hoverBorderClass"
  >
    <div class="flex flex-col items-center text-center">
      <div class="p-3 rounded-full mb-3 transition-colors" :class="iconBgClass">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="icon === 'plus'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
          <path
            v-if="icon === 'refresh'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
      <h4 class="font-semibold text-gray-900">{{ title }}</h4>
      <p class="text-sm text-gray-500 mt-1">{{ description }}</p>
      <span
        v-if="disabled"
        class="mt-2 text-xs px-2 py-1 rounded-full bg-red-100 text-red-800"
      >
        Limit Reached
      </span>
    </div>
  </button>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "plus",
  },
  color: {
    type: String,
    default: "blue",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const colorConfig = {
  blue: {
    iconBg: "bg-blue-50 text-blue-600",
    hoverBorder: "hover:border-blue-500",
  },
  green: {
    iconBg: "bg-green-50 text-green-600",
    hoverBorder: "hover:border-green-500",
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

const handleClick = () => {
  if (!props.disabled) {
    emit("click");
  }
};
</script>