<script setup>
import { ref, onMounted, computed, watchEffect } from "vue";
import RestApi from '@/libs/config'
import mixin from '@/libs/mixin'
import { useToast } from 'vue-toastification'
import Map from '@/components/Map.vue';
import LeftSideBar from '../components/LeftSideBar.vue'
import NavBar from '../components/NavBar.vue';
import { Form, Field, ErrorMessage, useForm } from 'vee-validate';
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
})

const schema = yup.object({
  form: yup.object({
    fibercorep: yup.string().required().label('Fibercorep'),
    fiber_code: yup.string().required().label('Fiber Code'),
  }),
});

function onSubmit(values) {
  console.log('values ===', values);
}

const toggleLeftSidebar = () => {
  hideLeftSidebar.value = !hideLeftSidebar.value
}
onMounted(() => {
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

  map.value.on("draw:created", function (e) {
    var type = e.layerType;
    var layer = e.layer;
    console.log(layer.toGeoJSON())

    const geoJson = layer.toGeoJSON()

    form.value.coordinates = geoJson.geometry.coordinates
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

const getMapConnection = async () => {
  loading.value = true
  // controlLoader.value.show();
  let result = await RestApi.get('/api/new-connections/')
  // console.log('result', result.data)
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

        console.log('intLatLong=', intLatLong, '  index=', index, 'id=', item.id)

        map.value.setView([lat.value, long.value], 15);
        L.marker([lat.value, long.value]).addTo(map.value)
          .bindPopup(`Latidute: ${lat.value} and Longitude : ${long.value}, pppoe_id: ${item.pppoe_id}`)
        
      }

      loading.value = false
    })

    loading.value = false
  }
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
}

const onToggle = () => {
  modalR.value.onToggle()
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

    console.log('create result == ', result)
  } catch (error) {
    console.log('error', error)
  } finally {
    loading.value = false
  }
}


// watcher
watchEffect(() => {
  console.log('watchEffect')
})

</script>

<template>
  
  <ProgressBar v-if="loading"/>

  <div class="flex h-screen relative">
    <div class="w-full h-full z-[1]" ref="mapContainer" />

    <ModalR ref="modalR">
      <template #header>
        <h6>Add New Fiber Area</h6>
      </template>

      <Form v-slot="{ errors }" :validation-schema="schema" @submit="onSubmit">
        <div class="flex-1 rounded-lg p-2 shadow-cyan-sm shadow-sm">

          <div class="mb-2 pb-4">
            <label for="fibercorep" class="input-label">Fibercores</label>
            <Field name="form.fibercorep" v-slot="{ field  }">
              <v-select v-bind="field" :options="dropdownList.fibercores" :reduce="item => item.value" id="fibercorep" placeholder="Select Fiber Cores" />
            </Field>
            <ErrorMessage class="error-text" name="form.fibercorep" />
            <p class="error-text">{{ errors['form.fibercorep'] }}</p>
          </div>

          <div class="mb-2 pb-4">
            <label for="fiber_code" class="input-label">Fiber code</label>
            <Field name="form.fiber_code" v-slot="{ field  }">
                <input type="text" v-bind="field" id="fiber_code" class="input-control" placeholder="Enter fiber code" />
            </Field>
            <ErrorMessage class="error-text" name="form.fiber_code" />
            <p class="error-text">{{ errors['form.fiber_code'] }}</p>
          </div>

          <div class="text-right">
            <button type="submit" class="btn bg-[#2f3e56] hover:bg-[#3c4f6d] text-gray-300 ml-3">
              Save to Project
            </button>
          </div>

        </div>
      </Form>
    </ModalR>

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
  </div>
</template>

<style scoped>
@import '@/style.css';

.vs__search, .vs__search:focus {
  font-size: 13px !important;
}
</style>
