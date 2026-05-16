<!-- components/AdminFormGuide.vue -->
<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
  >
    <!-- Header -->
    <div
      class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 shadow-xs"
          >
            <LucideBookOpen class="h-5 w-5" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">
              Form Guide & Reference
            </h2>
            <p class="text-sm text-gray-500">
              Understanding how this form processes your changes
            </p>
          </div>
        </div>
        <button
          type="button"
          @click="isExpanded = !isExpanded"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          :aria-label="isExpanded ? 'Collapse guide' : 'Expand guide'"
        >
          <LucideChevronUp v-if="isExpanded" class="h-5 w-5" />
          <LucideChevronDown v-else class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <Transition name="expand">
      <div v-show="isExpanded" class="divide-y divide-gray-100">
        <!-- Critical Warning - Unchecking Deletes Data -->
        <div class="bg-red-50/80 p-6">
          <div class="flex items-start gap-4">
            <div
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-200 text-red-700"
            >
              <LucideAlertTriangle class="h-6 w-6" />
            </div>
            <div class="space-y-3">
              <div>
                <h3 class="text-base font-bold text-red-900">
                  Critical: Unchecking a Section Deletes All Associated Data
                </h3>
                <p class="mt-1 text-sm text-red-800">
                  When you uncheck an impact section, the system permanently
                  removes every record tied to it. This action is immediate and
                  cannot be reversed.
                </p>
              </div>
              <ul class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <li
                  class="flex items-center gap-2 rounded-md bg-white/60 px-3 py-2 text-red-800"
                >
                  <span class="font-mono text-red-500">🗑️</span>
                  <span
                    ><strong class="font-semibold">Animals</strong> —
                    Death/injury counts</span
                  >
                </li>
                <li
                  class="flex items-center gap-2 rounded-md bg-white/60 px-3 py-2 text-red-800"
                >
                  <span class="font-mono text-red-500">🗑️</span>
                  <span
                    ><strong class="font-semibold">Humans</strong> — Residents &
                    demographics</span
                  >
                </li>
                <li
                  class="flex items-center gap-2 rounded-md bg-white/60 px-3 py-2 text-red-800"
                >
                  <span class="font-mono text-red-500">🗑️</span>
                  <span
                    ><strong class="font-semibold">Properties</strong> — Records
                    & images</span
                  >
                </li>
              </ul>
              <p class="text-sm font-medium text-red-900">
                <span class="inline-block mr-1">⚠️</span>
                This includes removing all associated images from Cloudinary
                storage.
              </p>
            </div>
          </div>
        </div>

        <!-- Form Sections Overview -->
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <!-- Core Information Card -->
            <div class="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
              <div class="mb-4 flex items-center gap-2">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 text-gray-700"
                >
                  <LucideEdit class="h-4 w-4" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Core Information</h3>
                  <span
                    class="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700"
                  >
                    Edit Only — Cannot Be Deleted
                  </span>
                </div>
              </div>
              <p class="mb-4 text-sm leading-relaxed text-gray-600">
                These fields represent the foundational record. They were
                captured during initial submission and can be edited, but the
                section itself cannot be removed.
              </p>
              <dl class="space-y-2 text-sm">
                <div class="flex">
                  <dt class="w-20 flex-shrink-0 text-gray-500">Personal</dt>
                  <dd class="text-gray-700">
                    Name, Father's Name, CNIC, Phone, Address
                  </dd>
                </div>
                <div class="flex">
                  <dt class="w-20 flex-shrink-0 text-gray-500">Disaster</dt>
                  <dd class="text-gray-700">Disaster Type</dd>
                </div>
                <div class="flex">
                  <dt class="w-20 flex-shrink-0 text-gray-500">Location</dt>
                  <dd class="text-gray-700">GPS Coordinates</dd>
                </div>
              </dl>
            </div>

            <!-- Impact Sections Card -->
            <div class="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
              <div class="mb-4 flex items-center gap-2">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700"
                >
                  <LucidePlusCircle class="h-4 w-4" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Impact Sections</h3>
                  <span
                    class="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                  >
                    Add / Remove / Update
                  </span>
                </div>
              </div>
              <p class="mb-4 text-sm leading-relaxed text-gray-600">
                These sections are optional. Use the checkboxes to activate or
                deactivate them. Activating a section reveals its form fields
                for data entry.
              </p>
              <dl class="space-y-2 text-sm">
                <div class="flex">
                  <dt class="w-20 flex-shrink-0 text-gray-500">Animals</dt>
                  <dd class="text-gray-700">
                    Track livestock and wildlife impact
                  </dd>
                </div>
                <div class="flex">
                  <dt class="w-20 flex-shrink-0 text-gray-500">Humans</dt>
                  <dd class="text-gray-700">
                    Record affected residents and demographics
                  </dd>
                </div>
                <div class="flex">
                  <dt class="w-20 flex-shrink-0 text-gray-500">Properties</dt>
                  <dd class="text-gray-700">
                    Document structural damage and images
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <!-- Checkbox State Visual Comparison -->
        <div class="bg-amber-50/60 p-6">
          <h3
            class="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-800"
          >
            <LucideAlertCircle class="h-4 w-4" />
            Checkbox States Explained
          </h3>

          <!-- Two Primary Scenarios -->
          <div class="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-5">
            <!-- Scenario 1: Checked + No Data = Error -->
            <div
              class="rounded-xl border-2 border-amber-300 bg-amber-50/90 p-5"
            >
              <div class="mb-4 flex items-center gap-3">
                <div
                  class="flex h-6 w-6 items-center justify-center rounded border-2 border-amber-600 bg-amber-600 text-white"
                >
                  <LucideCheck class="h-4 w-4" />
                </div>
                <div>
                  <span class="text-base font-semibold text-amber-900"
                    >Checked ✓ + No Data</span
                  >
                  <span
                    class="ml-2 inline-flex items-center rounded-full bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-800"
                  >
                    Validation Error
                  </span>
                </div>
              </div>
              <p class="mb-3 text-sm font-medium text-amber-800">
                If a section is checked but required fields are left empty:
              </p>
              <ul class="space-y-2 text-sm text-amber-800">
                <li class="flex items-start gap-2">
                  <span class="text-amber-600 mt-0.5">⚠️</span>
                  <span
                    >The system will throw a
                    <strong>validation error</strong> when attempting to
                    save</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-amber-600 mt-0.5">⚠️</span>
                  <span
                    >You must provide all required data for that section</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-amber-600 mt-0.5">⚠️</span>
                  <span
                    >The form cannot be saved until data is entered or the
                    checkbox is unchecked</span
                  >
                </li>
              </ul>
            </div>

            <!-- Scenario 2: Unchecked + Existing Data = Deletion -->
            <div class="rounded-xl border-2 border-red-300 bg-red-50/90 p-5">
              <div class="mb-4 flex items-center gap-3">
                <div
                  class="flex h-6 w-6 items-center justify-center rounded border-2 border-red-500 bg-white"
                ></div>
                <div>
                  <span class="text-base font-semibold text-red-900"
                    >Unchecked ✗ + Existing Data</span
                  >
                  <span
                    class="ml-2 inline-flex items-center rounded-full bg-red-200 px-2 py-0.5 text-xs font-medium text-red-800"
                  >
                    Permanent Deletion
                  </span>
                </div>
              </div>
              <p class="mb-3 text-sm font-medium text-red-800">
                If a section is unchecked and previously contained data:
              </p>
              <ul class="space-y-2 text-sm text-red-800">
                <li class="flex items-start gap-2">
                  <span class="text-red-600 mt-0.5">🗑️</span>
                  <span
                    >All related records are
                    <strong>permanently deleted</strong> from the database</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-red-600 mt-0.5">🗑️</span>
                  <span
                    >Associated images are removed from Cloudinary storage</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-red-600 mt-0.5">🗑️</span>
                  <span
                    >This action is <strong>irreversible</strong> — data cannot
                    be recovered</span
                  >
                </li>
              </ul>
            </div>
          </div>

          <!-- Normal Operation States -->
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <!-- Checked + Has Data (Normal) -->
            <div class="rounded-xl border border-green-200 bg-green-50/80 p-5">
              <div class="mb-4 flex items-center gap-3">
                <div
                  class="flex h-6 w-6 items-center justify-center rounded border-2 border-green-600 bg-green-600 text-white"
                >
                  <LucideCheck class="h-4 w-4" />
                </div>
                <div>
                  <span class="text-base font-semibold text-green-900"
                    >Checked ✓ + Has Data</span
                  >
                  <span
                    class="ml-2 inline-flex items-center rounded-full bg-green-200 px-2 py-0.5 text-xs font-medium text-green-800"
                  >
                    Normal Operation
                  </span>
                </div>
              </div>
              <p class="mb-3 text-sm font-medium text-green-800">
                Section is active and contains valid data:
              </p>
              <ul class="space-y-2 text-sm text-green-800">
                <li class="flex items-start gap-2">
                  <span class="text-green-600 mt-0.5">✓</span>
                  <span>Data is saved and updated in the database</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-600 mt-0.5">✓</span>
                  <span>Form fields are enabled and editable</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-600 mt-0.5">✓</span>
                  <span>Images are stored in Cloudinary</span>
                </li>
              </ul>
            </div>

            <!-- Unchecked + No Data (Normal) -->
            <div class="rounded-xl border border-gray-200 bg-gray-50/80 p-5">
              <div class="mb-4 flex items-center gap-3">
                <div
                  class="flex h-6 w-6 items-center justify-center rounded border-2 border-gray-400 bg-white"
                ></div>
                <div>
                  <span class="text-base font-semibold text-gray-700"
                    >Unchecked ✗ + No Data</span
                  >
                  <span
                    class="ml-2 inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700"
                  >
                    Inactive Section
                  </span>
                </div>
              </div>
              <p class="mb-3 text-sm font-medium text-gray-700">
                Section is inactive and contains no data:
              </p>
              <ul class="space-y-2 text-sm text-gray-700">
                <li class="flex items-start gap-2">
                  <span class="text-gray-500 mt-0.5">○</span>
                  <span>No data exists for this section</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-gray-500 mt-0.5">○</span>
                  <span>Form fields are hidden or disabled</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-gray-500 mt-0.5">○</span>
                  <span>Checking this box will reveal the form fields</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Section-Specific Details -->
        <div class="p-6">
          <h3
            class="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-500"
          >
            Section‑Specific Rules
          </h3>
          <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
            <!-- Animals -->
            <div
              class="rounded-xl border border-purple-200 bg-purple-50/60 p-5"
            >
              <h4
                class="mb-3 flex items-center gap-2 font-medium text-purple-900"
              >
                <LucideDog class="h-5 w-5 text-purple-600" />
                Animals Impact
              </h4>
              <ul class="space-y-2.5 text-sm">
                <li class="flex items-start gap-2 text-purple-800">
                  <span class="mt-0.5 text-green-600">✓</span>
                  <span
                    ><strong>Checked:</strong> Add or update death/injury
                    counts</span
                  >
                </li>
                <li class="flex items-start gap-2 text-purple-800">
                  <span class="mt-0.5 text-red-600">✗</span>
                  <span
                    ><strong>Unchecked:</strong>
                    <span class="font-semibold text-red-700"
                      >Delete all animal data</span
                    ></span
                  >
                </li>
                <li class="flex items-start gap-2 text-purple-800">
                  <span class="mt-0.5 text-amber-600">⚠️</span>
                  <span
                    ><strong>Required fields:</strong> At least one animal type
                    count</span
                  >
                </li>
                <li class="flex items-start gap-2 text-purple-800">
                  <span class="mt-0.5 text-purple-500">•</span>
                  <span>Use the +/– buttons or type numbers directly</span>
                </li>
              </ul>
            </div>

            <!-- Humans -->
            <div
              class="rounded-xl border border-yellow-200 bg-yellow-50/60 p-5"
            >
              <h4
                class="mb-3 flex items-center gap-2 font-medium text-yellow-900"
              >
                <LucideUsers class="h-5 w-5 text-yellow-600" />
                Humans Impact
              </h4>
              <ul class="space-y-2.5 text-sm">
                <li class="flex items-start gap-2 text-yellow-800">
                  <span class="mt-0.5 text-green-600">✓</span>
                  <span
                    ><strong>Checked:</strong> Add or update resident data</span
                  >
                </li>
                <li class="flex items-start gap-2 text-yellow-800">
                  <span class="mt-0.5 text-red-600">✗</span>
                  <span
                    ><strong>Unchecked:</strong>
                    <span class="font-semibold text-red-700"
                      >Delete all human data</span
                    ></span
                  >
                </li>
                <li class="flex items-start gap-2 text-yellow-800">
                  <span class="mt-0.5 text-amber-600">⚠️</span>
                  <span
                    ><strong>Required fields:</strong> Total residents and
                    demographics</span
                  >
                </li>
                <li class="flex items-start gap-2 text-yellow-800">
                  <span class="mt-0.5 text-yellow-500">•</span>
                  <span>Total residents should equal sum of demographics</span>
                </li>
              </ul>
            </div>

            <!-- Properties -->
            <div
              class="rounded-xl border border-indigo-200 bg-indigo-50/60 p-5"
            >
              <h4
                class="mb-3 flex items-center gap-2 font-medium text-indigo-900"
              >
                <LucideHome class="h-5 w-5 text-indigo-600" />
                Properties Impact
              </h4>
              <ul class="space-y-2.5 text-sm">
                <li class="flex items-start gap-2 text-indigo-800">
                  <span class="mt-0.5 text-green-600">✓</span>
                  <span><strong>Checked:</strong> Manage property records</span>
                </li>
                <li class="flex items-start gap-2 text-indigo-800">
                  <span class="mt-0.5 text-red-600">✗</span>
                  <span
                    ><strong>Unchecked:</strong>
                    <span class="font-semibold text-red-700"
                      >Delete all properties</span
                    ></span
                  >
                </li>
                <li class="flex items-start gap-2 text-indigo-800">
                  <span class="mt-0.5 text-amber-600">⚠️</span>
                  <span
                    ><strong>Required fields:</strong> Property type, damage
                    level, image</span
                  >
                </li>
                <li class="flex items-start gap-2 text-indigo-800">
                  <span class="mt-0.5 text-indigo-500">•</span>
                  <span>Each property requires all three components</span>
                </li>
                <li class="flex items-start gap-2 text-indigo-800">
                  <span class="mt-0.5 text-indigo-500">•</span>
                  <span>"Change Image" replaces the existing photo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="bg-blue-50/60 p-6">
          <h3
            class="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-blue-800"
          >
            <LucideInfo class="h-4 w-4" />
            Form Actions
          </h3>
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="space-y-1.5">
              <p class="flex items-center gap-2 font-medium text-gray-900">
                <span class="text-lg">💾</span> Save Modifications
              </p>
              <p class="text-sm leading-relaxed text-gray-700">
                Commits all changes to the database. Checked sections are
                updated; unchecked sections trigger permanent deletion of their
                data. Validation errors will prevent saving if checked sections
                lack required data.
              </p>
            </div>
            <div class="space-y-1.5">
              <p class="flex items-center gap-2 font-medium text-gray-900">
                <span class="text-lg">↩️</span> Reset Changes
              </p>
              <p class="text-sm leading-relaxed text-gray-700">
                Discards all unsaved modifications and reverts the form to the
                last saved state. Useful for correcting mistakes before saving
                or recovering from accidental unchecking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Collapsed Summary Bar -->
    <div
      v-show="!isExpanded"
      class="border-t border-red-200 bg-gradient-to-r from-red-50 to-amber-50 px-6 py-3"
    >
      <p class="flex items-center text-sm">
        <LucideAlertTriangle class="mr-2 h-4 w-4 flex-shrink-0 text-red-600" />
        <span class="text-red-800">
          <strong class="font-semibold text-red-900">Warning:</strong>
          Unchecking deletes data permanently. Checking without required data
          triggers validation errors.
          <span class="hidden sm:inline">Expand to review the full guide.</span>
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isExpanded = ref(true);
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease-in-out;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>