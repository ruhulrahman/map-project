<script setup lang="ts">
import { defineProps, ref, onMounted } from "vue";

// import L from 'leaflet'
// import leafletDraw from 'leaflet-draw'
// var leafletDraw = require('leaflet-draw');

const lat = ref(0)
const long = ref(0)
const map = ref()
const mapContainer = ref()

onMounted(() => {
  map.value = L.map(mapContainer.value).setView([51.505, -0.09], 13);
  // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   maxZoom: 19,
  //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  // }).addTo(map.value);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
     }).addTo(map.value);

  // Leaflet draw
  // FeatureGroup is to store editable layers
  var drawnItems = new L.FeatureGroup();
  map.value.addLayer(drawnItems);

  var drawControl = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems,
      // show or hide delete icon
      // remove: false
    }
  });
  map.value.addControl(drawControl);

  map.value.on('draw:created', function (e: any) {
    console.log('e == ', e)
    var type = e.layerType,
      layer = e.layer;
    drawnItems.addLayer(layer)
  });

  map.value.on('draw:edited', function (e: any) {
    console.log('e == ', e)
    var type = e.layerType,
      layer = e.layer;
    drawnItems.addLayer(layer)
  });

})

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      lat.value = position.coords.latitude
      long.value = position.coords.longitude
      map.value.setView([lat.value, long.value], 15);

      L.marker([lat.value, long.value], { draggable: true }).addTo(map.value).on('dragend', (event: any) => {
        console.log('event', event)
        lat.value = event.target._latlng.lat
        long.value = event.target._latlng.lng
        // map.value.setView([lat.value, long.value], 15);
      })
        .bindPopup(`Latidute: ${lat.value} and Longitude : ${long.value}`);

    })
  }
}


</script>

<template>
  <div class="bg-black">
    <div class="flex flex-col">
      <div class="flex flex-col">
        <div class="py-2 text-right">
          <button class="btn" @click="getLocation()">
            Show Location
          </button>
          <span v-if="lat && long" class="pl-3">{{ lat }}, {{ long }}</span>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="z-[1] w-full h-screen" ref="mapContainer" />
      </div>
    </div>
  </div>
</template>

<style>
@import '@/style.css';
</style>
