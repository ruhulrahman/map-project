<script setup>
import { ref, onMounted, computed } from "vue";
import RestApi from '@/libs/config'
import { useToast } from 'vue-toastification'
import Map from '@/components/Map.vue';
import LeftSideBar from '../components/LeftSideBar.vue'
import NavBar from '../components/NavBar.vue';
import Modal from "@/components/Modal.vue";

const toast = useToast()

const hideLeftSidebar = ref(true)

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

const array = [1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2]

</script>

<template>
  <div class="flex h-screen relative">
    <div class="w-full h-full z-[1]" ref="mapContainer" />

    <div class="flex flex-row w-full absolute top-0 left-0 z-[2]">
      <div class="flex-row relative w-full h-full z-[4]">
        <div
          class="flex-1 bg-[#1F1F1F] bg-opacity-[0.9] hover:bg-[#1F1F1F] transition-all duration-400 text-white w-full z-[4]">
          <!-- Navbar content -->
          <NavBar />
        </div>
        
        <div class="flex-col absolute top-0 left-0 text-white h-full z-[-1]">
          <!-- Sidebar content -->
          <div class="absolute left-0 bg-[#1F1F1F] h-screen"
            :class="hideLeftSidebar ? 'w-0 transition-all duration-200' : 'w-[300px] transition-all duration-200'">
            <div class="flex flex-row">
              <div v-if="hideLeftSidebar" @click="toggleLeftSidebar"
                class="absolute top-1/2 hover:scale-110 duration-300 right-[-23px] bg-[#1F1F1F] bg-opacity-[0.7] hover:bg-neutral-800 cursor-pointer z-[5] py-3 px-2 rounded-r-lg">
                <font-awesome-icon :icon="['fas', 'caret-right']" />
              </div>

              <div v-if="!hideLeftSidebar" class="flex flex-row w-full  h-screen px-2 overflow-y-auto">

                <div @click="toggleLeftSidebar"
                class="absolute top-1/2 right-[-23px] hover:scale-110 duration-300  bg-neutral-900 bg-opacity-[0.7] hover:bg-neutral-800 cursor-pointer z-[5] py-3 px-2 rounded-r-lg">
                <font-awesome-icon :icon="['fas', 'caret-left']" />
              </div>
                <div class="flex flex-row w-full h-full">
                  <div class="flex flex-col w-full h-full gap-3">
                    <div class="flex flex-row mt-[78px]">
                      <!-- <button class="w-full btn btn-primary bg-green-700 border-none">+ Add New </button> -->

                      <button
                        class="btn w-full bg-gradient-to-r from-gray-600 to-gray-900 hover:from-gray-900 hover:to-gray-700 text-gray-300 hover:-translate-y-[1px] duration-300">
                        + Add New
                      </button>
                    </div>

                    <div class="flex flex-row justify-start items-center pt-3 text-white"
                      style="border-top: 1px solid rgb(60, 60, 60);">
                      <div class="flex flex-col">
                        <font-awesome-icon :icon="['fas', 'angle-up']" />
                      </div>
                      <div class="flex flex-col ml-4">
                        <p>Drive Projects</p>
                      </div>
                    </div>

                    <div class="flex flex-col gap-3 pb-[85px]">

                      <div class="btn-create">
                        <div class="flex-none p-3">
                          <font-awesome-icon :icon="['fab', 'google-drive']" />
                        </div>
                        <div class="flex-1">
                          <h6>Untitled</h6>
                          <p>Dec 16, 2023</p>
                        </div>
                        <div class="flex-none p-3">
                          <font-awesome-icon :icon="['fas', 'eye-slash']" />
                        </div>
                      </div>

                      <div class="btn-create">
                        <div class="flex-none p-3">
                          <font-awesome-icon :icon="['fab', 'google-drive']" />
                        </div>
                        <div class="flex-1">
                          <h6>Untitled</h6>
                          <p>Dec 16, 2023</p>
                        </div>
                        <div class="flex-none p-3">
                          <font-awesome-icon :icon="['fas', 'eye-slash']" />
                        </div>
                      </div>

                      <div class="btn-create" v-for="(item, index) in array" :key="index">
                        <div class="flex-none p-3">
                          <font-awesome-icon :icon="['fab', 'google-drive']" />
                        </div>
                        <div class="flex-1">
                          <h6>Untitled</h6>
                          <p>Dec 16, 2023</p>
                        </div>
                        <div class="flex-none p-3">
                          <font-awesome-icon :icon="['fas', 'eye-slash']" />
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <Modal>
      <template #header>
        <h6>Add New Fiber Area</h6>
      </template>

      <div class="flex-1 rounded-lg p-2 shadow-cyan-sm shadow-sm shadow-purple-300">

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
    </Modal>
  </div>
</template>

<style scoped>
@import '@/style.css';
</style>
