<script setup>
import { ref, onMounted, computed } from "vue";
// import RestApi, { baseURL } from '@/libs/config'
import RestApi from '@/libs/config'
import { useToast } from 'vue-toastification'
import ModalT from '../components/ModalT.vue'

const toast = useToast()

const loading = ref(false)
const lat = ref(0)
const long = ref(0)
const map = ref()
const mapContainer = ref()

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


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      lat.value = position.coords.latitude
      long.value = position.coords.longitude
      map.value.setView([lat.value, long.value], 15);
;
      L.marker([lat.value, long.value], { draggable: true }).addTo(map.value).on('dragend', (event) => {
        console.log('event', event)
        lat.value = event.target._latlng.lat
        long.value = event.target._latlng.lng
        // map.value.setView([lat.value, long.value], 15);
      })
        .bindPopup(`Latidute: ${lat.value} and Longitude : ${long.value}`)

    })
  }
}

const mapTypes = ref('')

const getMapConnection = async () => {
  loading.value = true
  let result = await RestApi.get('/api/new-connections/')
  loading.value = false
  console.log('result', result.data)
  if (result.data.length) {
    result.data.forEach((item, index) => {

      let intLatLong = item.user_longlate.split(',')
      lat.value = intLatLong[0]
      long.value = intLatLong[1]

      console.log('intLatLong=', intLatLong, '  index=', index)
    
      map.value.setView([lat.value, long.value], 15);
      L.marker([lat.value, long.value]).addTo(map.value)
        .bindPopup(`Latidute: ${lat.value} and Longitude : ${long.value}, pppoe_id: ${item.pppoe_id}`)

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

const submitData = async () => {
  loading.value = true
  let result = ''
  if (form.value.id) {
    result = await RestApi.post('api/v1/sg-5/createfiber/', form.value)
  } else {
    result = await RestApi.post('api/v1/sg-5/createfiber/', form.value)
  }
  loading.value = false
  
  onToggle()

  if (result.success) {
    toast.success(result.message)
    // this.$bvModal.hide('modal-1')
  } else {
    // this.$refs.form.setErrors(result.errors)
  }
}


const isOpen = ref(false)
const createModal = ref(false)

const isModalVisible = computed(() => {
  return isOpen.value
})

const onToggle = () => {
  // isOpen.value = !isOpen.value
  createModal.value.toggleRightSidebar()
}

</script>

<template>
  <div class="bg-black">
    <div class="flex flex-col">
      <div class="flex flex-col">
        <div class="py-2 text-right">
          <button @click="getLocation()" class="btn bg-gray-700 hover:bg-gray-600 text-gray-300">
            Set Current Location
          </button>

          <button @click="onToggle" class="btn bg-purple-700 hover:bg-purple-600 text-gray-300 ml-3">
            Open Modal
          </button>
          <!--<span v-if="lat && long" class="pl-3">{{ lat }}, {{ long }}</span>-->
        </div>
      </div>
      <div class="flex flex-col">
        <div class="z-[1] w-full h-screen" ref="mapContainer" />



        <!---Modal -->
        <transition v-if="isModalVisible" name="fade">
          <div class="z-[9999999] absolute w-full h-screen" v-if="isModalVisible">
            <div @click="onToggle" class="absolute bg-black opacity-70 inset-0 z-0"></div>
            <div :class="isModalVisible ? 'max-w-lg transition-all duration-200' : 'w-0 transition-all duration-200'"
              class="p-3 relative mx-auto my-auto rounded-xl shadow-lg bg-neutral-900 bg-opacity-[0.6]">
              <div>
                <div class="text-center p-3 flex-auto justify-center leading-6">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 flex items-center text-purple-500 mx-auto"
                    viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd" />
                  </svg>
                  <h2 class="text-2xl font-bold py-4">Are you sure?</h2>
                  <p class="text-md text-gray-500 px-8">
                    Do you really want to exit without saving your work?
                  </p>
                </div>
                <div class="p-3 mt-2 text-center space-x-4 md:block">
                  <button
                    class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-md hover:shadow-lg hover:bg-gray-100">
                    Save
                  </button>
                  <button @click="onToggle"
                    class="mb-2 md:mb-0 bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>

      </div>
    </div>


    <ModalT ref="createModal">

      <template #header>
        <h6>Add New Fiber Area</h6>
      </template>

      <div class="flex-1 bg-black bg-opacity-[0.4] rounded-lg p-2 shadow-cyan-sm shadow-sm shadow-purple-300">

        <div class="mb-2 pb-5">
          <label for="success" class="block mb-2 text-sm font-medium text-purple-300">Fibername</label>
          <input type="text" v-model="form.fibername" id="success"
            class=" text-purple-300 placeholder-purple-500 text-sm rounded-lg block w-full p-2.5 shadow-gray-outset focus:shadow-gray-inset"
            placeholder="Enter fibername" />
        </div>

        <div class="mb-2 pb-5">
          <label for="success" class="block mb-2 text-sm font-medium text-purple-300">Fiber code</label>
          <input type="text" v-model="form.fiber_code" id="success"
            class=" text-purple-300 placeholder-purple-500 text-sm rounded-lg block w-full p-2.5 shadow-gray-outset focus:shadow-gray-inset"
            placeholder="Enter fiber code" />
        </div>

        <div class="mb-2 pb-5">
          <label for="success" class="block mb-2 text-sm font-medium text-purple-300">Color code</label>
          <input type="text" v-model="form.color_code" id="success"
            class=" text-purple-300 placeholder-purple-500 text-sm rounded-lg block w-full p-2.5 shadow-gray-outset focus:shadow-gray-inset"
            placeholder="Enter color code" />
        </div>

        <div class="mb-2 pb-5">
          <label for="success" class="block mb-2 text-sm font-medium text-purple-300">Width and Height</label>
          <input type="text" v-model="form.width_height" id="success"
            class=" text-purple-300 placeholder-purple-500 text-sm rounded-lg block w-full p-2.5 shadow-gray-outset focus:shadow-gray-inset"
            placeholder="Enter width height" />
        </div>

        <div class="mb-2 pb-5 ">
          <label for="success" class="block mb-2 text-sm font-medium text-purple-300">Note</label>
          <textarea v-model="form.note" type="text" id="success"
            class=" text-purple-300 placeholder-purple-500 text-sm rounded-lg block w-full p-2.5 bg-black bg-opacity-[0.1] shadow-gray-outset focus:shadow-gray-inset"
            placeholder="Enter Note"></textarea>
        </div>

        <div class="mb-2 pb-4 text-right">
          <button @click="submitData" class="btn bg-purple-700 hover:bg-purple-600 text-gray-300 ml-3">
            Submit
          </button>
        </div>

      </div>


    </ModalT>

  </div>
</template>