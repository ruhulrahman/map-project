<script setup>
import { ref, onMounted, computed } from "vue";
import RestApi from '@/libs/config'
import { useToast } from 'vue-toastification'
import Map from '@/components/Map.vue';
import LeftSideBar from '../components/LeftSideBar.vue'
import NavBar from '../components/NavBar.vue';
// import Modal from "@/components/ModalR.vue";

const toast = useToast()

const hideLeftSidebar = ref(true)

const loading = ref(false)
const lat = ref(0)
const long = ref(0)
const map = ref()
const mapContainer = ref()
const modalR = ref()
const mapTypes = ref('')
const dropdownList = ref({
  fibercores: [],
  map_types: [],
})

const mapDrawEnable = ref(false)
let drawControl = ref({})


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
  map.value = L.map(mapContainer.value).setView([lat.value, long.value], 13);

  // Add the OpenStreetMap tiles
  var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  osm.addTo(map.value);

  // leaflet draw 
  var drawnFeatures = new L.FeatureGroup();
  map.value.addLayer(drawnFeatures);


  drawControl.value = new L.Control.Draw({
    draw: {
      position: 'topleft',
      polygon: false,
      polyline: false,
      rectangle: false,
      circle: false,
      marker: false,
      circlemarker: false,
    },
    edit: false
  });

  map.value.addControl(drawControl.value);

  // var drawControl = new L.Control.Draw({
  //   position: "topright",
  //   edit: {
  //     featureGroup: drawnFeatures,
  //   }
  // });

  // map.value.addControl(drawControl);

  map.value.on("draw:created", function (e) {
    var type = e.layerType;
    var layer = e.layer;
    console.log(layer.toGeoJSON())

    form.value.coordinates = layer.toGeoJSON()
    // onToggle()

    modalR.value.onToggle()


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
  getInitData()

});

const activePolyLineDraw = (params) => {
  console.log('clicked here', params)

  map.value.removeControl(drawControl.value);

  // let drawnFeatures = new L.FeatureGroup();
  // map.value.addLayer(drawnFeatures);

  if (params == 'polygon') {

    drawControl.value = new L.Control.Draw({
      draw: {
        position: 'topleft',
        polygon: {
          title: 'Draw a sexy polygon!',
          allowIntersection: false,
          drawError: {
            color: '#b00b00',
            timeout: 1000
          },
          shapeOptions: {
            color: '#bada55'
          },
          showArea: true
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: false
    });
    
    map.value.addControl(drawControl.value);
    document.querySelector(".leaflet-draw-draw-polygon").click();

  } else if (params == 'polyline') {
    drawControl.value = new L.Control.Draw({
      draw: {
        position: 'topleft',
        polygon: false,
        polyline: {
          metric: false
        },
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: false
    });

    map.value.addControl(drawControl.value);
    document.querySelector(".leaflet-draw-draw-polyline").click();

  } else if (params == 'marker') {

    drawControl.value = new L.Control.Draw({
      draw: {
        position: 'topleft',
        polygon: false,
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
      },
      edit: false
    });

    map.value.addControl(drawControl.value);
    document.querySelector(".leaflet-draw-draw-marker").click();

  }
}

const activePolyLineDraw2 = (params) => {
  console.log('clicked here', params)

  let drawnFeatures = new L.FeatureGroup();
  map.value.addLayer(drawnFeatures);

  if (params == 'polyline') {
    let drawControl = new L.Control.Draw({
      position: "topleft",
      edit: {
        featureGroup: drawnFeatures,
      },
      draw: {
        polyline: true,
        polygon: false,
        rectangle: false,
        circle: false,
        marker: false,
      }
    });

    map.value.addControl(drawControl);
    document.querySelector(".leaflet-draw-draw-polyline").click();
  }

  if (params == 'marker') {
    let drawControl = new L.Control.Draw({
      position: "topleft",
      edit: {
        featureGroup: drawnFeatures,
      },
      draw: {
        polyline: false,
        polygon: false,
        rectangle: false,
        circle: false,
        marker: true,
      }
    });

    map.value.addControl(drawControl);
    document.querySelector(".leaflet-draw-draw-marker").click();
  }
}


const getMapConnection = async () => {
  loading.value = true
  let result = await RestApi.get('/api/new-connections/')
  loading.value = false
  // console.log('result', result.data)
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
    // map.value = L.map(mapContainer.value).setView([22.946198, 91.1066334], 13);
    // map.value.setView([22.946198, 91.1066334], 13);
    // L.marker([22.946198, 91.1066334])
    //   .addTo(map.value)
  }
  // var drawnFeatures = new L.FeatureGroup();
  // drawnFeatures.addLayer(result);

  // mapTypes.value = result
}

const getInitData = async () => {
  loading.value = true
  let result = await RestApi.get('/api/v1/sg-5/selete/')
  loading.value = false
  console.log('result', result.data)
  if (result.data.fibercores) {
    dropdownList.value.fibercores = result.data.fibercores.map(item => {
      return {
        value: item.id,
        label: item.fibercoredata,
      }
    })
  }
  if (result.data.fibercores) {
    dropdownList.value.map_types = result.data.map_types.map(item => {
      return {
        value: item.id,
        label: item.mapcat,
      }
    })
  }

  console.log('dropdownList.value', dropdownList.value)
  // dropdownList.value = result
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


const submitData = async () => {
  loading.value = true
  let result = ''
  try {
    if (form.value.id) {
      result = await RestApi.post('api/v1/sg-5/createfiber/', form.value)
    } else {
      result = await RestApi.post('api/v1/sg-5/createfiber/', form.value)
    }
    loading.value = false

    console.log('create result == ', result)
    
    if (result.success) {
      toast.success(result.message)
      onToggle()
    }
  } catch (error) {
    toast.danger(error)
  }
}

</script>

<template>
  <div class="flex h-screen relative">
    <div class="w-full h-full z-[1]" ref="mapContainer" />

    <div class="flex flex-row w-full absolute top-0 left-0 z-[2]">
      <div class="flex-row relative w-full h-full z-[4]">
        <div
          class="flex-1 bg-[#1F1F1F] bg-opacity-[0.9] hover:bg-[#1F1F1F] transition-all duration-400 text-white w-full z-[4]">
          <!-- Navbar content -->
          <NavBar @activedMapDraw="activePolyLineDraw" />
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

                      <button data-ripple-light="true"
                        class="btn w-full p-[10px] bg-[#304059] hover:bg-[#344560] text-gray-300 hover:-translate-y-[1px] duration-300">
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

    <ModalR ref="modalR">
      <template #header>
        <h6>Add New Fiber Area</h6>
      </template>

      <div class="flex-1 rounded-lg p-2 shadow-cyan-sm shadow-sm">

        <div class="mb-2 pb-4">
          <label for="fibercored" class="input-label">Fibercores</label>
          <v-select v-model="form.fibercorep" :options="dropdownList.fibercores" :reduce="item => item.value" id="fibercored" placeholder="Select Fiber Cores" />
        </div>

        <div class="mb-2 pb-4">
          <label for="map_type" class="input-label">Map Type</label>
          <v-select v-model="form.map_type" :options="dropdownList.map_types" :reduce="item => item.value" id="map_type" placeholder="Select map type" />
        </div>

        <div class="mb-2 pb-4">
          <label for="fibername" class="input-label">Fibername</label>
          <input type="text" v-model="form.fibername" id="fibername" class="input-control"
            placeholder="Enter fibername" />
        </div>

        <div class="mb-2 pb-4">
          <label for="fiber_code" class="input-label">Fiber code</label>
          <input type="text" v-model="form.fiber_code" id="fiber_code" class="input-control"
            placeholder="Enter fiber code" />
        </div>

        <div class="mb-2 pb-4">
          <label for="color_code" class="input-label">Color code</label>
          <input type="text" v-model="form.color_code" id="color_code" class="input-control"
            placeholder="Enter color code" />
        </div>

        <div class="mb-2 pb-4">
          <label for="width_height" class="input-label">Width and Height</label>
          <input type="text" v-model="form.width_height" id="width_height" class="input-control"
            placeholder="Enter width height" />
        </div>

        <div class="mb-2 pb-4 ">
          <label for="note" class="input-label">Note</label>
          <textarea v-model="form.note" id="note" class="input-control" placeholder="Enter Note"></textarea>
        </div>

        <div class="text-right">
          <button @click="submitData" class="btn bg-[#2f3e56] hover:bg-[#3c4f6d] text-gray-300 ml-3">
            Save to Project
          </button>
        </div>

      </div>
    </ModalR>
  </div>
</template>

<style scoped>
@import '@/style.css';

.vs__search, .vs__search:focus {
  font-size: 13px !important;
}
</style>
