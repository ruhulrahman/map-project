<script setup>
import { ref, onMounted, computed } from "vue";
import RestApi from '@/libs/config'
import { useToast } from 'vue-toastification'
import Map from '@/components/Map.vue';
import LeftSideBar from '../components/LeftSideBar.vue'
import NavBar from '../components/NavBar.vue';

const toast = useToast()

const hideLeftSidebar = ref(false)

const loading = ref(false)
const lat = ref(0)
const long = ref(0)
const map = ref()
const mapContainer = ref()
const mapTypes = ref('')


let form = ref({
  id: '',
  map_type: '',
  fibercorep: '',
  user: 20,
  fibername: '',
  fiber_code: '',
  color_code: '',
  width_height: '',
  note: '',
  coordinates: '',
})


const toggleLeftSidebar = () => {
  hideLeftSidebar.value = !hideLeftSidebar.value
}

// const getMapConnection = async () => {

//   try {
//         const data = await RestApi.get(`api/new-connections/`)
//         console.log('data====>', data)
//     } catch (error) {
//         console.log(error.message)
//     }
// }


onMounted(() => {

  // getLocation()

  // Initialize the map
  map.value = L.map(mapContainer.value, { drawControl: true }).setView([lat.value, long.value], 13);

  // Add the OpenStreetMap tiles
  var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  osm.addTo(map.value);

  // leaflet draw 
  var drawnFeatures = new L.FeatureGroup();
  map.value.addLayer(drawnFeatures);

  var drawControl = new L.Control.Draw({
    position: "topright",
    edit: {
      featureGroup: drawnFeatures,
      remove: true,
    },
    draw: {
      polygon: {
        shapeOptions: {
          color: 'purple'
        },
        allowIntersection: false,
        drawError: {
          color: 'orange',
          timeout: 1000
        },
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

    form.value.coordinates = layer.toGeoJSON()
    onToggle()

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

  getMapConnection()
  getMapTypes()

});


const getMapConnection = async () => {
  loading.value = true
  let result = await RestApi.get('/api/new-connections/')
  loading.value = false
  console.log('result', result.data)
  if (result.data.length) {
    result.data.forEach((item, index) => {

      if (index <= 20) {
        let intLatLong = item.user_longlate.split(',')
        lat.value = intLatLong[0]
        long.value = intLatLong[1]

        console.log('intLatLong=', intLatLong, '  index=', index, 'id=', item.id)

        map.value.setView([lat.value, long.value], 15);
        L.marker([lat.value, long.value]).addTo(map.value)
          .bindPopup(`Latidute: ${lat.value} and Longitude : ${long.value}, pppoe_id: ${item.pppoe_id}`)

      }

    })
    //     result.forEach(item => {
    //       // marker = new L.marker([item.user_longlate])
    //       //   .bindPopup(item.pppoe_id)
    //       //   .addTo(map);

    //         map.value.setView([item.user_longlate], 15);
    // ;
    //         L.marker([item.user_longlate])
    //         .addTo(map.value)
    //         // .bindPopup(`Latidute: ${lat.value} and Longitude : ${long.value}`)
    //     })
    map.value = L.map(mapContainer.value).setView([22.946198, 91.1066334], 13);
    // map.value.setView([22.946198, 91.1066334], 15);
    ;
    L.marker([22.946198, 91.1066334])
      .addTo(map.value)
  }
  // var drawnFeatures = new L.FeatureGroup();
  // drawnFeatures.addLayer(result);

  // mapTypes.value = result
}

const getMapTypes = async () => {
  loading.value = true
  let result = await RestApi.get('/api/v1/sg-5/selete/')
  loading.value = false

  mapTypes.value = result
}

const isOpen = ref(false)
const createModal = ref(false)

const isModalVisible = computed(() => {
  return isOpen.value
})

const onToggle = () => {
  isOpen.value = !isOpen.value
  // createModal.value.onToggle()
}

</script>

<template>
  <div class="flex h-screen relative">
    <div class="w-full h-full z-[1]" ref="mapContainer" />

    <div class="flex flex-row w-full absolute top-0 left-0 z-[2]">
      <div class="flex-row relative w-full h-full z-[4]">
        <div class="flex-1 bg-[#1F1F1F] bg-opacity-[0.9] hover:bg-[#1F1F1F] transition-all duration-400 text-white w-full z-[4]">
          <!-- Navbar content -->
          <NavBar/>
        </div>
        <div class="flex-col absolute top-0 left-0 text-white h-full z-[-1]">
          <!-- Sidebar content -->
          <LeftSideBar/>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import '@/style.css';
</style>
