<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="handleBackdropClick"
      ></div>

      <!-- Modal Panel -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full max-w-6xl transform overflow-hidden rounded-xl bg-white shadow-xl transition-all"
        >
          <!-- Header -->
          <div
            class="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-green-100 rounded-lg">
                  <LucideMapPin class="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Verify Location Coordinates
                  </h2>
                  <p class="text-sm text-gray-600 mt-0.5">
                    {{ locations.length }} location{{
                      locations.length > 1 ? "s" : ""
                    }}
                    to verify
                  </p>
                </div>
              </div>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-500 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LucideX class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">
                Verification Progress
              </span>
              <span class="text-sm font-medium text-gray-700">
                {{ confirmedCount }}/{{ locations.length }} Confirmed
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-green-500 h-2 rounded-full transition-all duration-300"
                :style="{
                  width: `${(confirmedCount / locations.length) * 100}%`,
                }"
              ></div>
            </div>
          </div>

          <!-- Content -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            <!-- Map Section -->
            <div class="lg:col-span-2">
              <!-- Editing Banner -->
              <div
                v-if="editingLocation"
                class="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-yellow-600">🎯</span>
                    <span class="text-sm font-medium text-yellow-800">
                      Editing: {{ editingLocation.name }} - Click on map to set
                      new position
                    </span>
                  </div>
                  <button
                    @click="cancelEditing"
                    class="text-sm text-yellow-700 hover:text-yellow-900 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <!-- Map Container -->
              <div
                class="relative rounded-lg overflow-hidden border border-gray-200"
              >
                <div ref="mapContainer" class="h-[500px] w-full"></div>

                <!-- Map Overlay Instructions -->
                <div
                  v-if="!hasInteracted"
                  class="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm"
                >
                  <p class="font-medium text-gray-900 mb-1">
                    📍 How to verify:
                  </p>
                  <ul class="text-gray-600 space-y-1">
                    <li>• Click marker to select location</li>
                    <li>• Drag marker to adjust position</li>
                    <li>• Click "Adjust" then click map to reposition</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Locations Panel -->
            <div class="space-y-4">
              <!-- Locations List -->
              <div
                class="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
              >
                <div class="p-4 bg-white border-b border-gray-200">
                  <h3 class="font-semibold text-gray-900">
                    Locations to Verify
                  </h3>
                </div>

                <div
                  class="divide-y divide-gray-200 max-h-[400px] overflow-y-auto"
                >
                  <div
                    v-for="location in locations"
                    :key="location.id"
                    @click="selectLocation(location.id)"
                    :class="[
                      'p-4 cursor-pointer transition-colors hover:bg-gray-100',
                      selectedLocationId === location.id
                        ? 'bg-blue-50 border-l-4 border-l-blue-500'
                        : '',
                      location.confirmed ? 'opacity-75' : '',
                    ]"
                  >
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <h4 class="font-medium text-gray-900">
                            {{ location.name }}
                          </h4>
                          <span
                            :class="[
                              'px-2 py-0.5 rounded-full text-xs font-medium',
                              location.confirmed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800',
                            ]"
                          >
                            {{
                              location.confirmed ? "✓ Confirmed" : "⚠️ Pending"
                            }}
                          </span>
                        </div>
                        <div class="font-mono text-sm text-gray-600">
                          {{ location.lat.toFixed(6) }},
                          {{ location.lng.toFixed(6) }}
                        </div>
                      </div>
                    </div>

                    <div class="flex gap-2 mt-3">
                      <button
                        v-if="!location.confirmed"
                        @click.stop="startEditing(location.id)"
                        class="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors"
                      >
                        Adjust
                      </button>
                      <button
                        v-if="!location.confirmed"
                        @click.stop="confirmLocation(location.id)"
                        class="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        v-if="location.confirmed"
                        @click.stop="unconfirmLocation(location.id)"
                        class="flex-1 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded text-xs font-medium transition-colors"
                      >
                        Reopen
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Selected Location Details -->
              <div
                v-if="selectedLocation"
                class="bg-white rounded-lg border border-gray-200 p-4"
              >
                <h4 class="font-medium text-gray-900 mb-3">
                  Selected Location
                </h4>

                <div class="space-y-3">
                  <div class="bg-gray-50 rounded-lg p-3">
                    <div class="text-xs text-gray-600 mb-1">
                      Decimal Degrees
                    </div>
                    <div class="font-mono text-sm">
                      {{ selectedLocation.lat.toFixed(6) }},
                      {{ selectedLocation.lng.toFixed(6) }}
                    </div>
                  </div>

                  <div class="bg-gray-50 rounded-lg p-3">
                    <div class="text-xs text-gray-600 mb-1">DMS Format</div>
                    <div class="font-mono text-sm">
                      {{ toDMS(selectedLocation.lat, "lat") }},
                      {{ toDMS(selectedLocation.lng, "lng") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-600">
                <span v-if="!allConfirmed" class="text-yellow-600">
                  ⚠️ {{ locations.length - confirmedCount }} location(s) need
                  verification
                </span>
                <span v-else class="text-green-600">
                  ✓ All locations verified
                </span>
              </div>
              <div class="flex space-x-3">
                <button
                  @click="closeModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  v-if="!allConfirmed"
                  @click="confirmAll"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm All
                </button>
                <button
                  @click="saveAndClose"
                  :disabled="confirmedCount === 0"
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from "vue";

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  initialCoordinates: {
    type: Array,
    default: () => [],
  },
});

// Emits
const emit = defineEmits(["close", "confirm", "adjust"]);

// Reactive state
const mapContainer = ref(null);
const locations = ref([]);
const selectedLocationId = ref(null);
const editingLocation = ref(null);
const hasInteracted = ref(false);
const isMapReady = ref(false);

let map = null;
let markers = new Map();
let popupMarker = null;
let L = null;

// Dynamic import of Leaflet (client-side only)
const loadLeaflet = async () => {
  if (process.client) {
    try {
      const leafletModule = await import("leaflet");
      L = leafletModule.default || leafletModule;

      // Import CSS
      await import("leaflet/dist/leaflet.css");

      // Fix Leaflet's default icon issue
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      isMapReady.value = true;
      return true;
    } catch (error) {
      console.error("Failed to load Leaflet:", error);
      return false;
    }
  }
  return false;
};

// Computed
const selectedLocation = computed(() => {
  return locations.value.find((loc) => loc.id === selectedLocationId.value);
});

const confirmedCount = computed(() => {
  return locations.value.filter((loc) => loc.confirmed).length;
});

const allConfirmed = computed(() => {
  return locations.value.every((loc) => loc.confirmed);
});

// Initialize locations from props
watch(
  () => props.initialCoordinates,
  (newCoords) => {
    if (newCoords && newCoords.length > 0) {
      locations.value = newCoords.map((coord) => ({
        ...coord,
        confirmed: coord.confirmed || false,
      }));
    } else {
      // Default location if none provided
      locations.value = [
        {
          id: 1,
          name: "Report Location",
          lat: 36.65544,
          lng: 72.26369,
          confirmed: false,
        },
      ];
    }
  },
  { immediate: true }
);

// Initialize map when modal opens
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      await nextTick();
      // Load Leaflet if not already loaded
      if (!isMapReady.value) {
        await loadLeaflet();
      }
      if (isMapReady.value) {
        initializeMap();
      }
    } else {
      cleanupMap();
    }
  }
);

const initializeMap = () => {
  if (!mapContainer.value || !L || !isMapReady.value) return;

  // Clean up existing map if any
  if (map) {
    cleanupMap();
  }

  // Get center from first location or use default
  const center =
    locations.value.length > 0
      ? [locations.value[0].lat, locations.value[0].lng]
      : [36.65544, 72.26369];

  map = L.map(mapContainer.value, {
    center: center,
    zoom: 15,
    zoomControl: true,
  });

  // Add satellite layer
  L.tileLayer(
    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles &copy; Esri",
      maxZoom: 18,
    }
  ).addTo(map);

  // Add scale bar
  L.control.scale({ imperial: false, metric: true }).addTo(map);

  // Add markers for all locations
  locations.value.forEach((location) => {
    addMarkerForLocation(location);
  });

  // Fit bounds to show all markers
  if (locations.value.length > 0) {
    const bounds = L.latLngBounds(
      locations.value.map((loc) => [loc.lat, loc.lng])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }

  // Click handler for adjusting coordinates
  map.on("click", (e) => {
    hasInteracted.value = true;
    if (editingLocation.value) {
      const { lat, lng } = e.latlng;
      updateLocationCoordinates(editingLocation.value.id, lat, lng);
      editingLocation.value = null;
      map.getContainer().style.cursor = "";
      if (popupMarker) {
        map.removeLayer(popupMarker);
        popupMarker = null;
      }
    }
  });

  // Force a resize to ensure proper rendering
  setTimeout(() => {
    if (map) {
      map.invalidateSize();
    }
  }, 100);
};

const cleanupMap = () => {
  if (map) {
    map.remove();
    map = null;
  }
  markers.clear();
  hasInteracted.value = false;
};

const addMarkerForLocation = (location) => {
  if (!L || !map) return;

  const markerColor = location.confirmed ? "#10b981" : "#ef4444";

  const marker = L.marker([location.lat, location.lng], {
    draggable: !location.confirmed,
  }).addTo(map);

  // Custom icon for pending locations
  if (!location.confirmed) {
    marker.setIcon(
      L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
      })
    );
  }

  marker.bindPopup(createPopupContent(location));

  marker.on("dragend", (e) => {
    const position = marker.getLatLng();
    updateLocationCoordinates(location.id, position.lat, position.lng);
  });

  marker.on("click", () => {
    selectedLocationId.value = location.id;
  });

  markers.set(location.id, marker);
};

const createPopupContent = (location) => {
  const statusBadge = location.confirmed
    ? '<span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">✓ Confirmed</span>'
    : '<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">⚠️ Pending</span>';

  return `
    <div class="p-2 min-w-[200px]">
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-semibold text-gray-900">${location.name}</h3>
        ${statusBadge}
      </div>
      <div class="space-y-1 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Lat:</span>
          <span class="font-mono">${location.lat.toFixed(6)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Lng:</span>
          <span class="font-mono">${location.lng.toFixed(6)}</span>
        </div>
      </div>
    </div>
  `;
};

const updateLocationCoordinates = (id, lat, lng) => {
  const location = locations.value.find((loc) => loc.id === id);
  if (location && !location.confirmed) {
    location.lat = lat;
    location.lng = lng;

    const marker = markers.get(id);
    if (marker) {
      marker.setLatLng([lat, lng]);
      marker.setPopupContent(createPopupContent(location));
    }

    emit("adjust", location);
  }
};

const selectLocation = (id) => {
  selectedLocationId.value = id;
  const location = locations.value.find((loc) => loc.id === id);
  if (location && map && L) {
    map.flyTo([location.lat, location.lng], 17);
    const marker = markers.get(id);
    if (marker) {
      marker.openPopup();
    }
  }
};

const startEditing = (id) => {
  const location = locations.value.find((loc) => loc.id === id);
  if (location && !location.confirmed && L && map) {
    editingLocation.value = location;
    map.getContainer().style.cursor = "crosshair";

    if (popupMarker) {
      map.removeLayer(popupMarker);
    }
    popupMarker = L.popup()
      .setLatLng([location.lat, location.lng])
      .setContent(
        '<div class="text-sm font-medium">🎯 Click on map to set new position</div>'
      )
      .openOn(map);
  }
};

const cancelEditing = () => {
  if (map) {
    editingLocation.value = null;
    map.getContainer().style.cursor = "";
    if (popupMarker) {
      map.removeLayer(popupMarker);
      popupMarker = null;
    }
  }
};

const confirmLocation = (id) => {
  const location = locations.value.find((loc) => loc.id === id);
  if (location && L) {
    location.confirmed = true;

    const marker = markers.get(id);
    if (marker) {
      marker.setIcon(
        L.icon({
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })
      );
      marker.dragging.disable();
      marker.setPopupContent(createPopupContent(location));
    }
  }
};

const unconfirmLocation = (id) => {
  const location = locations.value.find((loc) => loc.id === id);
  if (location && L) {
    location.confirmed = false;

    const marker = markers.get(id);
    if (marker) {
      marker.setIcon(
        L.divIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -10],
        })
      );
      marker.dragging.enable();
      marker.setPopupContent(createPopupContent(location));
    }
  }
};

const confirmAll = () => {
  locations.value.forEach((loc) => {
    if (!loc.confirmed) {
      confirmLocation(loc.id);
    }
  });
};

const toDMS = (coord, type) => {
  const absolute = Math.abs(coord);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);

  const direction =
    type === "lat" ? (coord >= 0 ? "N" : "S") : coord >= 0 ? "E" : "W";

  return `${degrees}°${minutes}'${seconds}"${direction}`;
};

const handleBackdropClick = () => {
  // Optional: close on backdrop click
};

const closeModal = () => {
  emit("close");
};

const saveAndClose = () => {
  const confirmedLocations = locations.value.filter((loc) => loc.confirmed);
  if (confirmedLocations.length > 0) {
    emit("confirm", confirmedLocations);
  }
  closeModal();
};

// Clean up on component unmount
onBeforeUnmount(() => {
  cleanupMap();
});
</script>

<style scoped>
:deep(.leaflet-container) {
  font-family: inherit;
}

:deep(.leaflet-popup-content) {
  margin: 12px;
  min-width: 200px;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}
</style>