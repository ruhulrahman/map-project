<script setup>
import { ref, onMounted, onUnmounted, computed, watchEffect } from "vue";
import RestApi from '@/libs/config'
import mixin from '@/libs/mixin'
import { useToast } from 'vue-toastification'
import Map from '@/components/Map.vue';
import LeftSideBar from '../components/LeftSideBar.vue'
import NavBar from '../components/NavBar.vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import InputText from '@/components/InputText.vue';
import AddFiberForm from '@/views/fiber/AddFiberForm.vue';
import AddFiberMonitorForm from '@/views/fiber/AddFiberMonitorForm.vue';
import AddUserForm from '@/views/user/AddUserForm.vue';
import AddTjForm from '@/views/tj/AddTjForm.vue';
import AddAreaForm from '@/views/area/AddAreaForm.vue';
import debounce from 'lodash.debounce'
import lodash from 'lodash'
import router from "@/router";

// import Modal from "@/components/ModalR.vue";

const toast = useToast()

const hideLeftSidebar = ref(true)

const user_id = ref(20)

const loading = ref(false)
const lat = ref(0)
const long = ref(0)
const map = ref()
let mapContainer = ref()
const modalR = ref()
const addUserFormRef = ref()
const addTjFormRef = ref()
const addFiberFormRef = ref()
const addFiberMonitorFormRef = ref()
const addAreaFormRef = ref()
const mapLayoutMode = ref('hibrid')
const showMapLayoutMode = ref(false)

const showMapLayout = () => {
  showMapLayoutMode.value = true
}

const hideMapLayout = () => {
  // setTimeout(function () {
  //   showMapLayoutMode.value = false
  // }, 1000);
  showMapLayoutMode.value = false
}

const dropdownList = ref({
  fibercores: [],
  map_types: [],
  tjareas: [],
  tjtypes: [],
  splitters: [],
  colors: [],
  userTypes: [],
  userList: [],
  tjNumberList: [],
})

let drawControl = ref({})

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


const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

const googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
const googleSatellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

const googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

const emptyMapCall = () => {

  var osmBase = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

  var baseMaps = {
    "OSMBaseLayer": osmBase
  };

  // var overlayMaps = {
  //     "MetroStops": metroStops
  //      };

  // map.value = L.map(mapContainer.value, {
  //   zoom: 13,
  //   layers: [osmBase]
  // });

  map.value = L.map(mapContainer.value).setView([lat.value, long.value], 15);

  // Add the OpenStreetMap tiles
  // var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // })


  const activeMapLayout = mapLayoutMode.value
  let selectedLayout = ''

  if (activeMapLayout == 'hybrid') {
    selectedLayout = googleHybrid
  } else if (activeMapLayout == 'street') {
    selectedLayout = googleStreets
  } else if (activeMapLayout == 'satellite') {
    selectedLayout = googleSatellite
  } else if (activeMapLayout == 'terrain') {
    selectedLayout = googleTerrain
  } else {
    selectedLayout = googleHybrid
  }

  selectedLayout.addTo(map.value);

  // leaflet draw 
  var drawnFeatures = new L.FeatureGroup();
  map.value.addLayer(drawnFeatures);
}

const userIcon = ref({})
const tjIcon = ref({})

onMounted(async () => {

  await getMapLayoutData()

  map.value = L.map(mapContainer.value).setView([lat.value, long.value], 15);

  // Add the OpenStreetMap tiles
  // var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // })


  const activeMapLayout = mapLayoutMode.value
  let selectedLayout = ''

  if (activeMapLayout == 'hybrid') {
    selectedLayout = googleHybrid
  } else if (activeMapLayout == 'street') {
    selectedLayout = googleStreets
  } else if (activeMapLayout == 'satellite') {
    selectedLayout = googleSatellite
  } else if (activeMapLayout == 'terrain') {
    selectedLayout = googleTerrain
  } else {
    selectedLayout = googleHybrid
  }

  selectedLayout.addTo(map.value);

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
    // console.log(layer.toGeoJSON())

    // console.log('e.layerType', e.layerType)

    const geoJson = layer.toGeoJSON()

    let geoJsonArray = []

    if (e.layerType == 'polyline') {
      if (geoJson.geometry.coordinates.length) {
        geoJsonArray = geoJson.geometry.coordinates.map(item => {
          const newObject = item.reverse()
          return Object.assign(newObject)
        })
      }

      const coordinates = geoJsonArray
      if (activeCreatorMenu.value == 'polyline') {
        addFiberFormRef.value.show(coordinates)
      } else if (activeCreatorMenu.value == 'fiber_monitor') {
        addFiberMonitorFormRef.value.show(coordinates)
      }
    }

    if (e.layerType == 'polygon') {
      if (geoJson.geometry.coordinates.length) {
        geoJsonArray = geoJson.geometry.coordinates.map(item => {
          return item.map(item2 => {
            const newObject = item2.reverse()
            return Object.assign(newObject)
          })
        })
      }

      const coordinates = geoJsonArray
      addAreaFormRef.value.show(coordinates)
    }

    if (e.layerType == 'marker') {
      if (geoJson.geometry.coordinates.length) {
        geoJsonArray = geoJson.geometry.coordinates.reverse()
      }

      const coordinates = geoJsonArray

      if (activeCreatorMenu.value == 'user' || activeCreatorMenu.value == 'marker') {
        addUserFormRef.value.onToggle(coordinates)
      } else if (activeCreatorMenu.value == 'tjmarker') {
        addTjFormRef.value.show(coordinates)
      }
    }


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

  getIconData()
  getInitData()
  getTjnuberInitData()
  getUserMarkerConnection()
  // getMapPolygonConnection()
  // getTjMarkerConnection()
  // getMapLineConnection()
  // getFiberMonitorConnection()

  intervalId = setInterval(() => {
    getIpAddressStatus();
  }, 5000);
});

let intervalId;

onUnmounted(() => clearInterval(intervalId))

// function checkInstance() {
//   console.log("checkInstance")
// }

const checkedSidebarMenu = ref([])

const getListDataByCheckedMenus = async () => {
  // emptyMapCall()

  map.value.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
    if (layer instanceof L.Polygon) {
      layer.remove();
    }
    if (layer instanceof L.Polyline) {
      layer.remove();
    }
    if (layer instanceof L.Polyline) {
      layer.remove();
    }
  });
  console.log('checkedSidebarMenu', checkedSidebarMenu)
  if (checkedSidebarMenu.value.length) {
    checkedSidebarMenu.value.forEach((item, index) => {
      getListReload(item)
    })
  }
}
// const getListDataByTab = async (tab) => {
//   getListReload(tab)
// }

const getListReload = (listType) => {
  if (listType == 'marker') {
    getUserMarkerConnection()
  } else if (listType == 'tj') {
    getTjMarkerConnection()
  } else if (listType == 'polyline') {
    getMapLineConnection()
  } else if (listType == 'polygon') {
    getMapPolygonConnection()
  } else if (listType == 'polyline_fiber_monitor') {
    getFiberMonitorConnection()
  }
}

let activeCreatorMenu = ref('user')

const activateMapDrawer = (params) => {

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

  } else if (params == 'polyline' || params == 'fiber_monitor') {

    activeCreatorMenu.value = params

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

  } else if (params == 'marker' || params == 'tjmarker') {

    activeCreatorMenu.value = params

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

const markerLoadingMsg = computed(() => {
  return `${userMarkerLoadingCount.value} of ${totalUserMarkerCount.value} users`
})

const markerLoadingShow = computed(() => {
  if (totalUserMarkerCount.value != userMarkerLoadingCount.value) {
    // if (userMarkerLoadingCount.value > 600) {
    //   return false
    // }
    return true
  } else {
    return false
  }
})

const userMarkerList = ref([])
const tjMarkerList = ref([])
const fiberLineList = ref([])
const areaPolygonList = ref([])
const fiberMonitorLineList = ref([])

const markerLoading = ref(false)
let totalUserMarkerCount = ref(0)
let userMarkerLoadingCount = ref(0)

const getUserMarkerConnection = async () => {
  markerLoading.value = true
  totalUserMarkerCount.value = 0
  userMarkerLoadingCount.value = 0

  userMarkerList.value = []
  let result = await RestApi.get('/api/v1/sg-5/get_user_marker_list/')
  userMarkerList.value = result.data
  totalUserMarkerCount.value = result.data.length

  if (result.data.length) {
    const chunks = lodash.chunk(result.data, 50);

    chunks.forEach((arrayItem, arrayIndex) => {

      if (arrayIndex == 0) {
        userMapMarkerCall(arrayItem)
      }

      // if (arrayIndex == 0) {
      //   markerLoading.value = true
      //   userMapMarkerCall(arrayItem)
      // } else if (arrayIndex <= 5) {
      //   markerLoading.value = true
      //   setTimeout(function () {
      //     console.log('debounce calling')
      //     userMapMarkerCall(arrayItem)
      //   }, 5000);
      // } else if (arrayIndex <= 10) {
      //   markerLoading.value = true
      //   setTimeout(function () {
      //     console.log('debounce calling')
      //     userMapMarkerCall(arrayItem)
      //   }, 6000);
      // } else if (arrayIndex <= 15) {
      //   markerLoading.value = true
      //   setTimeout(function () {
      //     console.log('debounce calling')
      //     userMapMarkerCall(arrayItem)
      //   }, 7000);
      // } else {
      //   markerLoading.value = true
      //   setTimeout(function () {
      //     console.log('debounce calling')
      //     userMapMarkerCall(arrayItem)
      //   }, 8000);
      // }

    })

    markerLoading.value = false
  }
}

const userMapMarkerCall = (arrayItem) => {

  markerLoading.value = true

  arrayItem.forEach((item, index) => {

    userMarkerLoadingCount.value += 1

    const userLatLong = item.user_longlate
    item.user_longlate = userLatLong.trim()

    let intLatLong = item.user_longlate.split(',')
    lat.value = intLatLong[0]
    long.value = intLatLong[1]

    // var greenIcon = new L.Icon({
    //   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    //   iconSize: [25, 41],
    //   iconAnchor: [12, 41],
    //   popupAnchor: [1, -34],
    //   shadowSize: [41, 41]
    // });

    var greenIcon = new L.Icon({
      iconUrl: userIcon.value.iconurl,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [35, 35],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // var myIcon = L.divIcon({ className: 'w-[100px] h-[100px] bg-orange-500 marker-tag' });
    // var myIcon = L.divIcon({ className: 'w-[50px] h-[50px] bg-orange-500 pin2' });
    // var myIcon = L.divIcon({ className: '<div class="pin2"></div>' });
  
    map.value.setView([lat.value, long.value], 15);
    L.marker([lat.value, long.value], { icon: greenIcon }).addTo(map.value)
      .bindPopup(`Latidute: ${lat.value} and Longitude : ${long.value}, pppoe_id: ${item.pppoe_id}`)

  })

  markerLoading.value = false
}

let totalTjMarkerCount = ref(0)
let tjMarkerLoadingCount = ref(0)

const getTjMarkerConnection = async () => {
  totalTjMarkerCount.value = 0
  tjMarkerLoadingCount.value = 0

  tjMarkerList.value = []
  let result = await RestApi.get('/api/v1/sg-5/get_tj_marker_list/')
  totalTjMarkerCount.value = result.data.length
  
  if (result.data.length) {
    tjMarkerList.value = result.data.map(item => {
      
      const areaObj = dropdownList.value.tjareas.find(areaItem => areaItem.value == item.tj_area_name)
      const mapTypeObj = dropdownList.value.map_types.find(areaItem => areaItem.value == item.tj_type)
      const splitterObj = dropdownList.value.splitters.find(areaItem => areaItem.value == item.spilitter)
      item.area_name = areaObj ? areaObj.label : ''
      item.tj_type_name = mapTypeObj ? mapTypeObj.label : ''
      item.splitter_name = splitterObj ? splitterObj.label : ''
      return Object.assign(item)
    })
    const chunks = lodash.chunk(result.data, 50);

    chunks.forEach((arrayItem, arrayIndex) => {

      if (arrayIndex == 0) {
        tjMapMarkerCall(arrayItem)
      }

      // if (arrayIndex == 0) {
      //   markerLoading.value = true
      //   tjMapMarkerCall(arrayItem)
      // } else if (arrayIndex <= 5) {
      //   markerLoading.value = true
      //   setTimeout(function () {
      //     console.log('debounce calling')
      //     tjMapMarkerCall(arrayItem)
      //   }, 5000);
      // } else if (arrayIndex <= 10) {
      //   markerLoading.value = true
      //   setTimeout(function () {
      //     console.log('debounce calling')
      //     tjMapMarkerCall(arrayItem)
      //   }, 6000);
      // } else if (arrayIndex <= 15) {
      //   markerLoading.value = true
      //   setTimeout(function () {
      //     console.log('debounce calling')
      //     tjMapMarkerCall(arrayItem)
      //   }, 7000);
      // } else {
      //   markerLoading.value = true
      //   setTimeout(function () {
      //     console.log('debounce calling')
      //     tjMapMarkerCall(arrayItem)
      //   }, 8000);
      // }

    })

  }
}

const tjMapMarkerCall = (arrayItem) => {

  arrayItem.forEach((item, index) => {

    tjMarkerLoadingCount.value += 1

    const userLatLong = item.tj_longlate.trim()

    let intLatLong = userLatLong.split(',')
    lat.value = intLatLong[0]
    long.value = intLatLong[1]

    var greenIcon = new L.Icon({
      // iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      iconUrl: tjIcon.value.iconurl,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [35, 35],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // var myIcon = L.divIcon({ className: 'w-[100px] h-[100px] bg-orange-500 marker-tag' });
    // var myIcon = L.divIcon({ className: 'w-[50px] h-[50px] bg-orange-500 pin2' });
    // var myIcon = L.divIcon({ className: '<div class="pin2"></div>' });

    map.value.setView([lat.value, long.value], 15);
    L.marker([lat.value, long.value], { icon: greenIcon }).addTo(map.value)
      .bindPopup(`Latidute: ${lat.value} and Longitude : ${long.value}, pppoe_id: ${item.pppoe_id}`)

  })

}

const getMapLineConnection = async () => {
  loading.value = true
  fiberLineList.value = []
  let result = await RestApi.get('/api/v1/sg-5/get_polyline_list/')
  fiberLineList.value = result.data

  if (result.data.length) {
    await result.data.forEach((item, index) => {

      if (index > -1) {

        const mapType = dropdownList.value.map_types.find(mapType => mapType.value === item.map_type)
        const fiberCore = dropdownList.value.fibercores.find(mapType => mapType.value === item.fibercorep)

        const mapTypeName = mapType ? mapType.label : ''
        const fiberCoreName = fiberCore ? fiberCore.label : ''

        // var polyline = L.polyline(item.coordinates, { color: item.color_code, weight: item.width_height }).addTo(map.value)
        var polyline = L.polyline(item.coordinates, { color: item.color_code }).addTo(map.value)
          // var polyline = L.polyline(item.coordinates, { color: 'red' }).addTo(map.value)
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



      }
      // zoom the map to the polyline
      // map.value.fitBounds(polyline.getBounds());
    })
  }

  loading.value = false
}


const getMapPolygonConnection = async () => {
  loading.value = true
  areaPolygonList.value = []
  let result = await RestApi.get('/api/v1/sg-5/get_area/')
  
  if (result.data.length) {
    areaPolygonList.value = result.data.map(item => {
      const areaObj = dropdownList.value.tjareas.find(areaItem => areaItem.value == item.fiberarea)
      const userObj = dropdownList.value.userList.find(areaItem => areaItem.value == item.user)
      item.area_name = areaObj ? areaObj.label : ''
      item.user_name = userObj ? userObj.label : ''
      return Object.assign(item)
    })

    await result.data.forEach((item, index) => {

      if (index > -1) {

        const fiberAreaObj = dropdownList.value.tjareas.find(areaItem => areaItem.value === item.fiberarea)

        const fiberAreaName = fiberAreaObj ? fiberAreaObj.label : ''
        const coordinates = JSON.parse(item.coordinates)

        const content = `
                          <div class="p-1">
                            <p class="m-0 p-0"><b>Display Name</b>: <span>${item.displayname}</span></p>
                            <p class="m-0 p-0"><b>Fiber Area</b>: <span>${fiberAreaName}</span></p>
                            <p class="m-0 p-0"><b>Note</b>: <span>${item.note}</span></p>
                          </div>
                        `
        L.polygon(coordinates, { color: item.color_code, title: 'Leaflet.LabelTextCollision!!!!!!!!' }).addTo(map.value)
          .bindTooltip(item.displayname, { permanent: true, direction: "center" })
          .bindPopup(content)

      }
      // zoom the map to the polyline
      // map.value.fitBounds(polyline.getBounds());
    })
  }

  loading.value = false
}

const fiberMonitorList = ref([])

const getFiberMonitorConnection = async () => {
  loading.value = true
  fiberMonitorLineList.value = []
  let result = await RestApi.get('/api/v1/sg-5/fiber_monitor_get/')
  fiberMonitorLineList.value = result.data

  if (result.data.length) {
    fiberMonitorList.value = await result.data.map((item, index) => {

      const mapType = dropdownList.value.map_types.find(mapType => mapType.value === item.map_type)
      const fiberCore = dropdownList.value.fibercores.find(mapType => mapType.value === item.fibercorep)

      item.mapTypeName = mapType ? mapType.label : ''
      item.fiberCoreName = fiberCore ? fiberCore.label : ''

      return Object.assign({}, item)

    })

    getIpAddressStatus()

  }

  loading.value = false
}

const getIpAddressStatus = () => {

  fiberMonitorList.value.forEach(async (item, index) => {

    const params = { ip_address: item.ipaddr }

    try {
      let result = await RestApi.get('/pingajax', { params })

      item.color_code = result.data.status

      L.polyline(item.coordinates, { color: item.color_code, weight: item.width_height }).addTo(map.value)
        // L.polyline(item.coordinates, { color: item.color_code, weight: 3 }).addTo(map.value)
        .bindPopup(`
                          <div class="p-1">
                            <p class="m-0 p-0"><b>Fibername</b>: <span>${item.fibername}</span></p>
                            ${item.mapTypeName ? `<p class="m-0 p-0"><b>Map Type</b>: <span>${item.mapTypeName}</span></p>` : ''
          }
                            ${item.fiberCoreName ? `<p class="m-0 p-0"><b>Fibercores</b>: <span>${item.fiberCoreName}</span></p>` : ''
          }
                            <p class="m-0 p-0"><b>Fiber Code</b>: <span>${item.fiber_code}</span></p>
                            <p class="m-0 p-0"><b>Width and Height</b>: <span>${item.width_height}</span></p>
                            <p class="m-0 p-0"><b>Note</b>: <span>${item.note}</span></p>
                          </div>
                        `)

    } catch (error) {
      console.log('error', error)
    }

  })

}

const getIconData = async () => {
  loading.value = true
  let result = await RestApi.get('/api/v1/sg-5/get_iconncare_maps/')
  loading.value = false

  if (result.data.length) {
    userIcon.value = result.data[0]
    tjIcon.value = result.data[1]
  }

  // console.log('dropdownList.value', dropdownList.value)
}

const getInitData = async () => {
  loading.value = true
  let result = await RestApi.get('/api/v1/sg-5/selete/')
  loading.value = false

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

  if (result.data.tjarea) {
    dropdownList.value.tjareas = result.data.tjarea.map(item => {
      return {
        value: item.id,
        label: item.area_name,
      }
    })
  }

  if (result.data.tjtype) {
    dropdownList.value.tjtypes = result.data.tjtype.map(item => {
      return {
        value: item.id,
        label: item.cat,
      }
    })
  }

  if (result.data.splitter) {
    dropdownList.value.splitters = result.data.splitter.map(item => {
      return {
        value: item.id,
        label: item.cat,
      }
    })
  }

  if (result.data.color) {
    dropdownList.value.colors = result.data.color.map(item => {
      return {
        value: item.color,
        label: item.color,
      }
    })
  }

  if (result.data.mapusertype) {
    dropdownList.value.userTypes = result.data.mapusertype.map(item => {
      return {
        value: item.id,
        label: item.usertype,
      }
    })
  }

  if (result.data.alluserlist) {
    dropdownList.value.userList = result.data.alluserlist.map(item => {
      return {
        value: item.id,
        label: item.username,
      }
    })
  }

  // console.log('dropdownList.value', dropdownList.value)
}

const getTjnuberInitData = async () => {
  loading.value = true
  let result = await RestApi.get('/alltjlist/v1/')
  loading.value = false

  if (result.data) {
    dropdownList.value.tjNumberList = result.data.map(item => {
      return {
        value: item.id,
        label: item.tj_number,
      }
    })
  }
}

const getMapLayoutData = async () => {
  const user_id = 20;
  loading.value = true
  let result = await RestApi.get(`/api/v1/sg-5/maptypestate/update/${user_id}/`)
  loading.value = false

  if (result.data) {
    mapLayoutMode.value = result.data.status
  }
}

// watcher
watchEffect(() => {
})

const showCreateMenus = ref(false)

const toggleCreateMenus = () => {
  showCreateMenus.value = !showCreateMenus.value
}

const updateMapLayout = async (layoutMode) => {
  loading.value = true
  let result = ''
  try {
    const params = { status: layoutMode, user_id: user_id }
    if (mapLayoutMode.value) {
      result = await RestApi.put('api/v1/sg-5/maptypestate/update/20/', params)
    } else {
      result = await RestApi.post('api/v1/sg-5/maptypestate/create/', params)
    }

    if (result.status == 200) {

      // router.go()

      await getMapLayoutData()

      // map.value = L.map(mapContainer.value).setView([lat.value, long.value], 15);
      const activeMapLayout = mapLayoutMode.value ? mapLayoutMode.value : 'hybrid'
      let selectedLayout = ref('')

      if (activeMapLayout == 'hybrid') {
        selectedLayout.value = googleHybrid
      } else if (activeMapLayout == 'satellite') {
        selectedLayout.value = googleSatellite
      } else if (activeMapLayout == 'street') {
        selectedLayout.value = googleStreets
      } else if (activeMapLayout == 'terrain') {
        selectedLayout.value = googleTerrain
      }

      console.log('selectedLayout.value', selectedLayout.value)

      selectedLayout.value.addTo(map.value);
    }

  } catch (error) {
    console.log('error', error)
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <ProgressBar color="green" v-if="loading" />

  <div class="flex h-screen relative">
    <div class="w-full h-full z-[1]" ref="mapContainer" />
    <div v-if="markerLoadingShow"
      class="absolute top-[80px] right-0 w-auto h-auto z-[2] bg-gray-950 opacity-50 p-2 rounded-sm">
      <p>Loading ....</p>
      <p>{{ markerLoadingMsg }}</p>
    </div>

    <div class="flex flex-row w-full absolute top-0 left-0 z-[2]">
      <div class="flex-row relative w-full h-full z-[4]">
        <div
          class="flex-1 bg-[#1F1F1F] bg-opacity-[0.8] hover:bg-[#1F1F1F] transition-all duration-400 text-white w-full z-[4]">
          <!-- Navbar content -->
          <NavBar @activedMapDraw="activateMapDrawer" />
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
                <div class="flex flex-col w-full h-full">

                  <div :class="showCreateMenus ? 'w-full h-full translate-x-[0px]' : ' w-0 h-0 translate-x-[-400px]'"
                    class="flex flex-col gap-3 pt-3 transform duration-500 transition-all ease-in-out"
                    style="border-top: 1px solid rgb(60, 60, 60);">
                    <div class="flex flex-col gap-3 mt-[78px] pb-[85px]">

                      <div class="flex flex-row justify-end">
                        <font-awesome-icon @click="toggleCreateMenus()"
                          v-tippy="{ content: 'Close', placement: 'left', arrow: true, animation: 'fade', }"
                          class="bg-[#2A2A2A] hover:bg-[#434343] transform duration-200 w-[15px] h-[15px] p-2 rounded-full cursor-pointer"
                          :icon="['fas', 'xmark']" />
                      </div>

                      <div class="flex flex-row justify-between">
                        <button type="button" @click="activateMapDrawer('marker')"
                          class="text-gray-900 w-1/2 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-4 mb-2">
                          <font-awesome-icon :icon="['fas', 'user-plus']" class="text-orange-500 mr-2" />
                          Add User
                        </button>

                        <button type="button" @click="activateMapDrawer('tjmarker')"
                          class="text-gray-900 w-1/2 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mb-2">
                          <font-awesome-icon :icon="['fas', 'compass-drafting']" class="text-blue-500 mr-2" />
                          Add TJ
                        </button>
                      </div>

                      <div class="flex flex-row justify-between">
                        <button type="button" @click="activateMapDrawer('polyline')"
                          class="text-gray-900 w-1/2 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-4 mb-2">
                          <font-awesome-icon :icon="['fas', 'network-wired']" class="text-yellow-500 mr-2" />
                          Add Fiber
                        </button>

                        <button type="button" @click="activateMapDrawer('polygon')"
                          class="text-gray-900 w-1/2 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mb-2">
                          <font-awesome-icon :icon="['fas', 'map']" class="text-red-500 mr-2" />
                          Add Area
                        </button>
                      </div>

                      <div class="flex flex-row justify-between">
                        <button type="button" @click="activateMapDrawer('fiber_monitor')"
                          class="text-gray-900 w-full bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mb-2">
                          <font-awesome-icon :icon="['fab', 'watchman-monitoring']" class="text-green-500 mr-2" />
                          Add Fiber Monitor
                        </button>
                      </div>

                    </div>
                  </div>



                  <div v-if="!showCreateMenus"
                    class="flex flex-col w-full h-full gap-3 transform duration-500 transition-all ease-in-out">

                    <div class="flex flex-col w-full h-auto mt-[78px]">
                      <button @click="toggleCreateMenus()"
                        class="btn w-full p-[10px] bg-[#304059] hover:bg-[#344560] text-gray-300 hover:-translate-y-[1px] duration-300">
                        + Add New
                      </button>
                    </div>

                    <div
                      class="flex flex-row w-full min-h-[50px] overflow-x-auto no-scrollbar justify-start items-center text-white pt-3"
                      style="border-top: 1px solid #3c3c3c;">
                      <div class="flex flex-row w-full py-1">

                        <ul class="flex flex-row w-full space-x-2">
                          <li>
                            <input type="checkbox" id="marker" @change="getListDataByCheckedMenus()" v-model="checkedSidebarMenu" value="marker" class="hidden peer">
                            <label for="marker"
                              class="btn btn-secondary bg-slate-50 hover:bg-slate-200 hover:text-green-500 cursor-pointer peer-checked:border-blue-600 peer-checked:bg-lime-700 peer-checked:text-white">
                              User
                            </label>
                          </li>
                          <li>
                            <input type="checkbox" id="tjmarker" @change="getListDataByCheckedMenus()" v-model="checkedSidebarMenu" value="tj"
                              class="hidden peer">
                            <label for="tjmarker"
                              class="btn btn-secondary bg-slate-50 hover:bg-slate-200 hover:text-green-500 cursor-pointer peer-checked:border-blue-600 peer-checked:bg-lime-700 peer-checked:text-white">
                              TJs
                            </label>
                          </li>
                          <li>
                            <input type="checkbox" id="polyline" @change="getListDataByCheckedMenus()" v-model="checkedSidebarMenu" value="polyline"
                              class="hidden peer">
                            <label for="polyline"
                              class="btn btn-secondary bg-slate-50 hover:bg-slate-200 hover:text-green-500 cursor-pointer peer-checked:border-blue-600 peer-checked:bg-lime-700 peer-checked:text-white">
                              Fibers
                            </label>
                          </li>
                          <li>
                            <input type="checkbox" id="polygon" @change="getListDataByCheckedMenus()" v-model="checkedSidebarMenu" value="polygon"
                              class="hidden peer">
                            <label for="polygon"
                              class="btn btn-secondary bg-slate-50 hover:bg-slate-200 hover:text-green-500 cursor-pointer peer-checked:border-blue-600 peer-checked:bg-lime-700 peer-checked:text-white">
                              Areas
                            </label>
                          </li>
                          <li>
                            <input type="checkbox" id="polyline_fiber_monitor" @change="getListDataByCheckedMenus()" v-model="checkedSidebarMenu"
                              value="polyline_fiber_monitor" class="hidden peer">
                            <label for="polyline_fiber_monitor"
                              class="btn btn-secondary bg-slate-50 hover:bg-slate-200 hover:text-green-500 cursor-pointer peer-checked:border-blue-600 peer-checked:bg-lime-700 peer-checked:text-white">
                              Fiber Motitors
                            </label>
                          </li>

                        </ul>

                        <!--<input type="checkbox" v-model="checkedSidebarMenu" value="marker" id="marker" class="peer hidden" />
                        <label for="marker" class="checkbox-btn-label">User</label>

                        <input type="checkbox" v-model="checkedSidebarMenu" value="tjmarker" id="tjmarker" class="peer hidden" />
                        <label for="tjmarker" class="checkbox-btn-label">TJs</label>
   
                        <button @click="getListDataByTab('marker')" :class="userActive ? 'bg-lime-700 text-white' : 'bg-slate-50'" class="btn btn-secondary hover:bg-slate-200 hover:text-green-500">User</button>
                        <button @click="getListDataByTab('tjmarker')" class="btn btn-secondary bg-slate-50 hover:bg-slate-200 hover:text-green-500">TJs</button>
                        <button @click="getListDataByTab('polyline')" class="btn btn-secondary bg-slate-50 hover:bg-slate-200 hover:text-green-500">Fibers</button>
                        <button @click="getListDataByTab('polygon')" class="btn btn-secondary bg-slate-50 hover:bg-slate-200 hover:text-green-500">Areas</button>
                        <button @click="getListDataByTab('polyline_fiber_monitor')" class="btn btn-secondary bg-slate-50 hover:bg-slate-200 hover:text-green-500">Fiber Motitors</button>
                      -->
                      </div>
                    </div>

                    <!--<div class="flex flex-row justify-start items-center text-white pt-3"
                      style="border-top: 1px solid rgb(60, 60, 60);">
                      <div class="flex flex-col">
                        <font-awesome-icon :icon="['fas', 'angle-up']" />
                      </div>
                      <div  class="flex flex-col ml-4">
                        <p>Project Drive</p>
                      </div>
                    </div>-->

                    <p v-if="checkedSidebarMenu.length > 1" class="text-red-500">You have selected Multiple Menus</p>

                    <div v-if="checkedSidebarMenu[0] == 'marker'" class="flex flex-col gap-3 pb-[85px]">
                      <p>User List</p>
                      <template v-for="(item, index) in userMarkerList" :key="index">
                        <div class="btn-create text-[10px]">
                          <div class="flex-none p-3">
                            <img src="/src/assets/images/demo-img.jpg" class="w-[60px] h-[60px]" alt="Image">
                          </div>
                          <div class="flex-1">
                            <h6>Tj Number: {{ item.tj_number }}</h6>
                            <p>PPPOE ID: {{ item.pppoe_id }}</p>
                          </div>
                        </div>
                      </template>

                      <!--<div class="btn-create">
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
                      </div>-->

                    </div>

                    <div v-if="checkedSidebarMenu[0] == 'tj'" class="flex flex-col gap-3 pb-[85px]">
                      <p>Tj List</p>
                      <template v-for="(item, index) in tjMarkerList" :key="index">
                        <div class="btn-create text-[10px]">
                          <div class="flex-none p-3">
                            <img src="/src/assets/images/demo-img.jpg" class="w-[70px] h-[110px]" alt="Image">
                          </div>
                          <div class="flex-1">
                            <h6>Tj Number: {{ item.tj_number }}</h6>
                            <p>Tj Connect: {{ item.tj_connect }}</p>
                            <p>Desc: {{ item.tj_description }}</p>
                            <p>Tj Area: {{ item.area_name }}</p>
                            <p>Tj Type: {{ item.tj_type_name }}</p>
                            <p>Splitter: {{ item.splitter_name }}</p>
                          </div>
                        </div>
                      </template>
                    </div>

                    <div v-if="checkedSidebarMenu[0] == 'polyline'" class="flex flex-col gap-3 pb-[85px]">
                      <p>Fiber List</p>
                      <template v-for="(item, index) in fiberLineList" :key="index">
                        <div class="btn-create text-[11px]">
                          <div class="flex-1">
                            <h6>Area name: {{ item.fiberarea_name }}</h6>
                            <p>Fiber Name: {{ item.fibername }}</p>
                            <p>Fiber Code: {{ item.fiber_code }}</p>
                            <p>Note: {{ item.note }}</p>
                          </div>
                        </div>
                      </template>
                    </div>

                    <div v-if="checkedSidebarMenu[0] == 'polygon'" class="flex flex-col gap-3 pb-[85px]">
                      <p>Area List</p>
                      <template v-for="(item, index) in areaPolygonList" :key="index">
                        <div class="btn-create text-[11px]">
                          <div class="flex-1">
                            <h6>Display name: {{ item.displayname }}</h6>
                            <p>Fiber Area: {{ item.area_name }}</p>
                            <p>User: {{ item.user_name }}</p>
                            <p>Note: {{ item.note }}</p>
                          </div>
                        </div>
                      </template>
                    </div>

                    <div v-if="checkedSidebarMenu[0] == 'polyline_fiber_monitor'" class="flex flex-col gap-3 pb-[85px]">
                      <p>Fiber Monitor List</p>
                      <template v-for="(item, index) in fiberMonitorLineList" :key="index">
                        <div class="btn-create text-[11px]">
                          <div class="flex-1">
                            <h6>Map Type: {{ item.map_type }}</h6>
                            <p>Fiber Corep: {{ item.fibercorep }}</p>
                            <p>User: {{ item.user }}</p>
                            <p>Fibername: {{ item.fibername }}</p>
                            <p>Fibercode: {{ item.fiber_code }}</p>
                            <p>IP Address: {{ item.ipaddr }}</p>
                            <p>Note: {{ item.note }}</p>
                          </div>
                        </div>
                      </template>
                    </div>

                  </div>


                </div>
              </div>

              <div :class="hideLeftSidebar ? 'left-[20px]' : 'left-[320px]'"
                class="absolute bottom-[20px] left-[20px] w-[80px] h-[80px] z-[5]">
                <div class="flex flex-col w-full h-full">
                  <div v-on:mouseenter="showMapLayout()"
                    class="flex-col w-full h-full relative rounded-lg overflow-hidden border-2 border-gray-950 hover:border-4 flex hover:scale-110 duration-300 cursor-pointer">
                    <img v-if="mapLayoutMode == 'hybrid'" src="/src/assets/images/map-layout/hybrid.png"
                      class="absolute top-0 left-0 w-full h-full z-[5]" alt="">
                    <img v-else-if="mapLayoutMode == 'satellite'" src="/src/assets/images/map-layout/satellite.png"
                      class="absolute top-0 left-0 w-full h-full z-[5]" alt="">
                    <img v-else-if="mapLayoutMode == 'street'" src="/src/assets/images/map-layout/street.png"
                      class="absolute top-0 left-0 w-full h-full z-[5]" alt="">
                    <img v-else-if="mapLayoutMode == 'terrain'" src="/src/assets/images/map-layout/terrain.png"
                      class="absolute top-0 left-0 w-full h-full z-[5]" alt="">

                    <div class="text-[12px] w-full h-full flex flex-row justify-center items-end z-[6] pb-1">
                      <font-awesome-icon :icon="['fas', 'layer-group']" class="" /> <span
                        class="font-semibold ml-1">Layers</span>
                    </div>
                  </div>
                  <div v-on:mouseenter="showMapLayout()" v-on:mouseleave="hideMapLayout()"
                    :class="showMapLayoutMode ? 'w-[320px] h-[80px] space-x-3 p-3' : 'w-0 h-0'"
                    class="absolute bottom-0 left-[100px] text-[12px] bg-white rounded-lg flex flex-row justify-center items-end z-[6] transition-all duration-200">
                    <div @click="updateMapLayout('hybrid')"
                      v-tippy="{ content: 'Hybrid', appendTo: 'parent', theme: 'green' }" class="map-layout-item border-2"
                      :class="{ 'border-blue-500': mapLayoutMode == 'hybrid' }">
                      <img src="/src/assets/images/map-layout/hybrid.png" class="w-full h-full rounded-lg" alt="">
                    </div>
                    <div @click="updateMapLayout('satellite')"
                      v-tippy="{ content: 'Satellite', appendTo: 'parent', theme: 'green' }"
                      class="map-layout-item border-2" :class="{ 'border-blue-500': mapLayoutMode == 'satellite' }">
                      <img src="/src/assets/images/map-layout/satellite.png" class="w-full h-full rounded-lg" alt="">
                    </div>
                    <div @click="updateMapLayout('street')"
                      v-tippy="{ content: 'Street', appendTo: 'parent', theme: 'green' }" class="map-layout-item border-2"
                      :class="{ 'border-blue-500': mapLayoutMode == 'street' }">
                      <img src="/src/assets/images/map-layout/street.png" class="w-full h-full rounded-lg" alt="">
                    </div>
                    <div @click="updateMapLayout('terrain')"
                      v-tippy="{ content: 'Terrain', appendTo: 'parent', theme: 'green' }"
                      class="map-layout-item border-2" :class="{ 'border-blue-500': mapLayoutMode == 'terrain' }">
                      <img src="/src/assets/images/map-layout/terrain.png" class="w-full h-full rounded-lg" alt="">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <AddUserForm ref="addUserFormRef" :dropdownList="dropdownList" v-on:getListReload="getListReload" />
    <AddTjForm ref="addTjFormRef" :dropdownList="dropdownList" v-on:getListReload="getListReload" />
    <AddFiberForm ref="addFiberFormRef" :dropdownList="dropdownList" v-on:getListReload="getListReload" />
    <AddAreaForm ref="addAreaFormRef" :dropdownList="dropdownList" v-on:getListReload="getListReload" />
    <AddFiberMonitorForm ref="addFiberMonitorFormRef" :dropdownList="dropdownList" v-on:getListReload="getListReload" />

  </div>
</template>

<style scoped>
@import '@/style.css';

*>>>.tippy-box[data-theme~='green'] {
  background-color: #27A824;
  padding: 3px;
  border-radius: 3px;
  color: rgb(255, 255, 255);
}

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
