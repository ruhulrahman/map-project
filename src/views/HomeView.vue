<script setup>
import { ref, onMounted, computed } from "vue";
import Map from '@/components/Map.vue';
import LeftSideBar from '../components/LeftSideBar.vue'
import NavBar from '../components/NavBar.vue';
import RestApi from '@/libs/config'

const hideLeftSidebar = ref(false)

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
  // getMapConnection()
});

</script>

<template>
  <NavBar />
  <main class="flex relative h-fit">

    <LeftSideBar/>

    <div class="felx flex-row w-full bg-black h-fit">
      <Map />
    </div>
  </main>
</template>

<style scoped>
@import '@/style.css';
</style>
