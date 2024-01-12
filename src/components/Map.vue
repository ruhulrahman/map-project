<script setup lang="ts">
import { defineProps, ref, onMounted } from "vue";

import Leaflet from 'leaflet'

const lat = ref(0)
const long = ref(0)
const map = ref()
const mapContainer = ref()

onMounted(() => {
  map.value = Leaflet.map(mapContainer.value).setView([51.505, -0.09], 13);
  Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map.value);
})

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      lat.value = position.coords.latitude
      long.value = position.coords.longitude
      map.value.setView([lat.value, long.value], 15);

      Leaflet.marker([lat.value, long.value], { draggable: true }).addTo(map.value).on('dragend', (event) => {
        console.log('event', event)
        lat.value = event.target._latlng.lat
        long.value = event.target._latlng.lng
        // map.value.setView([lat.value, long.value], 15);
      });
    })
  }
}


</script>

<template>
  <div class="bg-black">
    <div class="flex flex-col">
      <!-- <div class="flex flex-col">
        <div class="py-2 text-right">
          <button class="btn" @click="getLocation()">
            Show Location
          </button>
          <span v-if="lat && long" class="pl-3">{{ lat }}, {{ long }}</span>
        </div>
      </div> -->
      <div class="flex flex-col">
        <div class="z-[1] w-full h-screen" ref="mapContainer" />
      </div>
    </div>
  </div>
</template>

<style>
@import '@/style.css';
</style>
