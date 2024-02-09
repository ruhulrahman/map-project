<script setup>
import { ref, onMounted, computed, watchEffect } from "vue";
import RestApi from '@/libs/config'
import mixin from '@/libs/mixin'
import { useToast } from 'vue-toastification'
import Map from '@/components/Map.vue';
import LeftSideBar from '../components/LeftSideBar.vue'
import NavBar from '../components/NavBar.vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import InputText from '@/components/InputText.vue';

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
  drawType: '',
})

const resetFormData = () => {
  form.value = {
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
    drawType: '',
  }
}


let validationErrors = ref({
  map_type: [],
  fibercorep: [],
  fibername: [],
  fiber_code: [],
  color_code: [],
  width_height: [],
  note: [],
  coordinates: [],
})



const toggleLeftSidebar = () => {
  hideLeftSidebar.value = !hideLeftSidebar.value
}



var greenIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

onMounted(async () => {
  // Initialize the map
  map.value = L.map(mapContainer.value).setView([lat.value, long.value], 13);

  // Add the OpenStreetMap tiles
  // var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // })

  const googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });
  const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });
  const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });

  const googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });

  googleHybrid.addTo(map.value);

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

    console.log('e.layerType', e.layerType)

    form.value.drawType = ''

    const geoJson = layer.toGeoJSON()
    form.value.drawType = e.layerType

    let geoJsonArray = []

    if (e.layerType == 'polyline' || e.layerType == 'polygon') {
      if (geoJson.geometry.coordinates.length) {
        geoJsonArray = geoJson.geometry.coordinates.map(item => {
          const newObject = item.reverse()
          return Object.assign(newObject)
        })
      }
    }

    if (e.layerType == 'marker') {
      if (geoJson.geometry.coordinates.length) {
        geoJsonArray = geoJson.geometry.coordinates.reverse()
      }
    }

    form.value.coordinates = geoJsonArray

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

  getInitData()
  getMapMarkerConnection()
  getMapLineConnection()

});

const activePolyLineDraw = (params) => {

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
    // L.marker({ icon: greenIcon });
    document.querySelector(".leaflet-draw-draw-marker").click();

  }
}

const getMapMarkerConnection = async () => {
  loading.value = true
  let result = await RestApi.get('/api/new-connections/')
  if (result.data.length) {
    const latLong = []
    await result.data.forEach((item, index) => {

      loading.value = true
      if (index < 50) {

        let intLatLong = item.user_longlate.split(',')
        lat.value = intLatLong[0]
        long.value = intLatLong[1]

        const newArray = [lat.value, long.value]

        latLong.push(newArray)

        var greenIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        var myIcon = L.divIcon({className: 'w-[100px] h-[100px] bg-orange-500 marker-tag'});
        // var myIcon = L.divIcon({className: 'w-[50px] h-[50px] bg-orange-500 pin2'});
        // var myIcon = L.divIcon({ className: '<div class="pin2"></div>'});

        map.value.setView([lat.value, long.value], 15);
        L.marker([lat.value, long.value]).addTo(map.value)
        L.marker([lat.value, long.value], { icon: greenIcon }).addTo(map.value)
          .bindPopup(`Latidute: ${lat.value} and Longitude : ${long.value}, pppoe_id: ${item.pppoe_id}`)

      }

      loading.value = false
    })

    loading.value = false
  }
}

const getMapLineConnection = async () => {
  loading.value = true
  let result = await RestApi.get('/api/v1/sg-5/getmapdemo/')
  // console.log('result', result.data)
  if (result.data.length) {
    await result.data.forEach((item, index) => {

      const mapType = dropdownList.value.map_types.find(mapType => mapType.value === item.map_type)
      const fiberCore = dropdownList.value.fibercores.find(mapType => mapType.value === item.fibercorep)

      const mapTypeName = mapType ? mapType.label : ''
      const fiberCoreName = fiberCore ? fiberCore.label : ''

      // var polyline = L.polyline(item.coordinates, { color: item.color_code }).addTo(map.value)
      var polyline = L.polyline(item.coordinates, { color: 'red' }).addTo(map.value)
        .bindPopup(`
                        <div class="p-1">
                          <p class="m-0 p-0"><b>Fibername</b>: <span>${item.fibername}</span></p>
                          ${mapTypeName ? `<p class="m-0 p-0"><b>Map Type</b>: <span>${mapTypeName}</span></p>` : ''
          }
                          ${fiberCoreName ? `<p class="m-0 p-0"><b>Fibercores</b>: <span>${fiberCoreName}</span></p>` : ''
          }
                          <p class="m-0 p-0"><b>Fiber Code</b>: <span>${item.fiber_code}</span></p>
                          <p class="m-0 p-0"><b>Width and Height</b>: <span>${item.width_height}</span></p>
                          <p class="m-0 p-0"><b>Note</b>: <span>${item.note}</span></p>
                        </div>
                      `)


      // zoom the map to the polyline
      // map.value.fitBounds(polyline.getBounds());
    })
  }

  loading.value = false
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
  modalR.value.onToggle()
}


// const submitData = async () => {
//   loading.value = true
//   let result = ''

//   if (form.value.id) {
//       result = await RestApi.post('api/v1/sg-5/createfiber/', form.value)
//     } else {
//       result = await RestApi.post('api/v1/sg-5/createfiber/', form.value)
//     }
//     loading.value = false

//     console.log('create result == ', result)
//     if (result.error) {
//       validationErrors.value = mixin.cn(result.error, 'data.errors', null)
//     }

// }

const submitData = async () => {
  loading.value = true
  let result = ''
  try {
    console.log('form.value', form.value)
    if (form.value.drawType == 'polyline') {
      if (form.value.id) {
        result = await RestApi.post('api/v1/sg-5/create_line_draw/', form.value)
      } else {
        result = await RestApi.post('api/v1/sg-5/create_line_draw/', form.value)
      }

      if (result.status == 201) {
        toast.success('Polyline has been created!')
        onToggle()
        resetFormData()
        getMapLineConnection()
      }

    }

    if (form.value.drawType == 'polygon') {
      if (form.value.id) {
        result = await RestApi.post('api/v1/sg-5/create_line_draw/', form.value)
      } else {
        result = await RestApi.post('api/v1/sg-5/create_line_draw/', form.value)
      }

      if (result.status == 201) {
        toast.success('Polyline has been created!')
        onToggle()
        resetFormData()
        getMapLineConnection()
      }
    }

    if (form.value.drawType == 'marker') {
      if (form.value.id) {
        result = await RestApi.post('api/v1/sg-5/create_line_draw/', form.value)
      } else {
        result = await RestApi.post('api/v1/sg-5/create_line_draw/', form.value)
      }

      if (result.status == 201) {
        toast.success('Polyline has been created!')
        onToggle()
        resetFormData()
        getMapLineConnection()
      }
    }

    // console.log('create result == ', result)

  } catch (error) {
    validationErrors.value = mixin.cn(error, 'response.data', null)
  } finally {
    loading.value = false
  }
}


// watcher
watchEffect(() => {
  console.log('watchEffect')
  if (form.value.color_code) {
    validationErrors.value.color_code = []
  }
  if (form.value.coordinates) {
    validationErrors.value.coordinates = []
  }
  if (form.value.fiber_code) {
    validationErrors.value.fiber_code = []
  }
  if (form.value.fibercorep) {
    validationErrors.value.fibercorep = []
  }
  if (form.value.map_type) {
    validationErrors.value.map_type = []
  }
  if (form.value.note) {
    validationErrors.value.note = []
  }
  if (form.value.width_height) {
    validationErrors.value.width_height = []
  }
})

</script>

<template>
  <ProgressBar v-if="loading" />

  <div class="flex h-screen relative">
    <div class="w-full h-full z-[1]" ref="mapContainer" />

    <div class="flex flex-row w-full absolute top-0 left-0 z-[2]">
      <div class="flex-row relative w-full h-full z-[4]">
        <div
          class="flex-1 bg-[#1F1F1F] bg-opacity-[0.8] hover:bg-[#1F1F1F] transition-all duration-400 text-white w-full z-[4]">
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
          <v-select v-model="form.fibercorep" :options="dropdownList.fibercores" :reduce="item => item.value"
            id="fibercored" placeholder="Select Fiber Cores" />
          <p class="error-text" v-if="validationErrors.fibercorep.length">
            {{ validationErrors.fibercorep[0] }}
          </p>
        </div>

        <div class="mb-2 pb-4">
          <label for="map_type" class="input-label">Map Type</label>
          <v-select v-model="form.map_type" :options="dropdownList.map_types" :reduce="item => item.value" id="map_type"
            placeholder="Select map type" />
          <p class="error-text" v-if="validationErrors.map_type.length">
            {{ validationErrors.map_type[0] }}
          </p>
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
          <p class="error-text" v-if="validationErrors.fiber_code.length">
            {{ validationErrors.fiber_code[0] }}
          </p>
        </div>

        <div class="mb-2 pb-4">
          <label for="color_code" class="input-label">Color code</label>
          <input type="text" v-model="form.color_code" id="color_code" class="input-control"
            placeholder="Enter color code" />
          <p class="error-text" v-if="validationErrors.color_code.length">
            {{ validationErrors.color_code[0] }}
          </p>
        </div>

        <div class="mb-2 pb-4">
          <label for="width_height" class="input-label">Width and Height</label>
          <input type="text" v-model="form.width_height" id="width_height" class="input-control"
            placeholder="Enter width height" />
          <p class="error-text" v-if="validationErrors.width_height.length">
            {{ validationErrors.width_height[0] }}
          </p>
        </div>

        <div class="mb-2 pb-4 ">
          <label for="note" class="input-label">Note</label>
          <textarea v-model="form.note" id="note" class="input-control" placeholder="Enter Note"></textarea>
          <p class="error-text" v-if="validationErrors.note.length">
            {{ validationErrors.note[0] }}
          </p>
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

img.leaflet-marker-icon {
  filter: hue-rotate(244deg) !important;
  filter: hue-rotate(90deg);
}

.vs__search,
.vs__search:focus {
  font-size: 13px !important;
}

.marker-tag {
  background-color: #4285F4;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 14px;
  padding: 10px 15px;
  position: relative;
}

.marker-tag::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translate(-50%, 0);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #4285F4;
}


.pin1 {
  position: absolute;
  top: 40%;
  left: 50%;
  margin-left: -115px;
  
  border-radius: 50% 50% 50% 0;
  border: 4px solid #fff;
  width: 20px;
  height: 20px;
  transform: rotate(-45deg);
}

.pin1::after {
  position: absolute;
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  margin-left: -5px;
  margin-top: -5px;
  background-color: #fff;
}



.pin2 {
  position: absolute;
  top: 40%;
  left: 50%;
  margin-left: 115px;
  
  border-radius: 50%;
  border: 8px solid #fff;
  width: 8px;
  height: 8px;
}

.pin2::after {
  position: absolute;
  content: '';
  width: 0px;
  height: 0px;
  bottom: -30px;
  left: -6px;
  border: 10px solid transparent;
  border-top: 17px solid #fff;
}
</style>
