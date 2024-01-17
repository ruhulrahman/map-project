<script setup>
import { ref, onMounted } from "vue";

const lat = ref(0)
const long = ref(0)
const map = ref()
const mapContainer = ref()

onMounted(() => {

  // Initialize the map
  map.value = L.map(mapContainer.value, {drawControl: true}).setView([28.2096, 83.9856], 13);

  // Add the OpenStreetMap tiles
  var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  osm.addTo(map.value);

  // leaflet draw 
  var drawnFeatures = new L.FeatureGroup();
  map.value.addLayer(drawnFeatures);

  var drawControl = new L.Control.Draw({
    // position: "topright",
    edit: {
      featureGroup: drawnFeatures,
      remove: true,
    },
    draw: {
      polygon: {
        shapeOptions: {
          color: 'purple'
        },
        //  allowIntersection: false,
        //  drawError: {
        //   color: 'orange',
        //   timeout: 1000
        //  },
      },
      polyline: {
        shapeOptions: {
          color: 'red'
        },
      },
      rect: {
        shapeOptions: {
          color: 'green'
        },
      },
      circle: {
        shapeOptions: {
          color: 'steelblue'
        },
      },
    },

  });
  map.value.addControl(drawControl);

  map.value.on("draw:created", function (e) {
    var type = e.layerType;
    var layer = e.layer;
    console.log(layer.toGeoJSON())

    layer.bindPopup(`<p>${JSON.stringify(layer.toGeoJSON())}</p>`)
    drawnFeatures.addLayer(layer);
  });

  map.value.on("draw:edited", function (e) {
    var layers = e.layers;
    var type = e.layerType;

    layers.eachLayer(function (layer) {
      console.log(layer)
    });

  });

});

</script>

<template>
  <div class="bg-black">
    <div class="flex flex-col">
      <div class="flex flex-col">
        <div class="py-2 text-right">
          <!-- <button class="btn" @click="getLocation()">
            Show Location
          </button> -->
          <span v-if="lat && long" class="pl-3">{{ lat }}, {{ long }}</span>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="z-[1] w-full h-screen" ref="mapContainer" />
      </div>
    </div>
  </div>
</template>