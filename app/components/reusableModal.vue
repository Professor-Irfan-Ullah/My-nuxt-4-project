<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        @click="closeModal"
      ></div>

      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-4 text-center">
        <!-- Modal Panel -->
        <Transition name="modal-panel">
          <div
            class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all w-full max-w-md"
            @click.stop
          >
            <!-- Close Button (Top Right) -->
            <button
              v-if="showCloseButton"
              @click="closeModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none flex items-center justify-center"
              aria-label="Close modal"
            >
              <!-- REPLACED RAW SVG WITH @nuxt/icon -->
              <Icon name="i-lucide-x" class="h-6 w-6" />
            </button>

            <!-- Modal Content -->
            <div class="p-8 text-center">
              <!-- Icon Slot -->
              <div class="mb-6">
                <slot name="icon">
                  <!-- Default icon if none provided -->
                  <div
                    class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto"
                  >
                    <!-- REPLACED RAW SVG WITH @nuxt/icon -->
                    <Icon
                      name="i-lucide-info"
                      class="w-10 h-10 text-gray-600"
                    />
                  </div>
                </slot>
              </div>

              <!-- Title Slot -->
              <h3
                id="modal-title"
                class="text-2xl font-bold text-gray-800 mb-3"
              >
                <slot name="title">Modal Title</slot>
              </h3>

              <!-- Content Slot -->
              <div class="text-gray-600 mb-6">
                <slot name="content">
                  <p>Modal content goes here</p>
                </slot>
              </div>

              <!-- Actions Slot -->
              <div class="flex flex-col sm:flex-row gap-3">
                <slot name="actions">
                  <button
                    @click="closeModal"
                    class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Close
                  </button>
                </slot>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  preventClose: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  if (!props.preventClose) {
    emit("close");
  }
};

// Close modal on Escape key
const handleEscape = (event) => {
  if (event.key === "Escape" && props.isOpen && !props.preventClose) {
    closeModal();
  }
};

// Add event listener for Escape key
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<style scoped>
/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-panel-enter-active,
.modal-panel-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-panel-enter-from,
.modal-panel-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Improve accessibility focus styles */
button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}
</style>