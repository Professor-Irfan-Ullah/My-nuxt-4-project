<script setup lang="ts">
import { ref, onMounted } from 'vue'

const installEvent = ref<any>(null)
const isInstallable = ref(false)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default browser pop-up mini-infobar
    e.preventDefault()
    // Stash the event so it can be triggered later
    installEvent.value = e
    isInstallable.value = true
  })

  window.addEventListener('appinstalled', () => {
    isInstallable.value = false
    installEvent.value = null
    console.log('PWA was installed successfully')
  })
})

async function triggerInstall() {
  if (!installEvent.value) return
  
  // Show the native browser installation prompt
  installEvent.value.prompt()
  
  // Wait for the user to respond to the prompt
  const { outcome } = await installEvent.value.userChoice
  if (outcome === 'accepted') {
    isInstallable.value = false
  }
}
</script>

<template>
  <button 
    v-if="isInstallable" 
    @click="triggerInstall"
    class="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
  >
    Install Desktop/Mobile App
  </button>
</template>
