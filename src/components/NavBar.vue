
<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/user';
import mixin from '@/libs/mixin'

const router = useRouter()

const authStore = useAuthStore();

const showMenubar = ref(true);
const open = ref(false);

const toggleMenubar = () => {
  showMenubar.value = !showMenubar.value;
}

const authUser = computed(() => {
  return JSON.parse(localStorage.getItem('authUser'))
})

const emit = defineEmits(["activedMapDraw", "updateSearchValue"])

const activateMapDraw = (drawTool) => {
  emit("activedMapDraw", drawTool);
}

const searchField = ref('')

watch([searchField], ([new_search_field]) => {
  emit("updateSearchValue", new_search_field);
})

const logout = () => {
  localStorage.setItem('token', '')
  localStorage.setItem('authUser', '')
  router.push('/login')
}

onMounted(() => {
})

</script>

<template>
  <header class="z-[7] shadow-down">
    <div v-if="showMenubar" class="flex flex-row px-2 py-1">
      <nav class="text-white flex flex-row gap-8 text-[13px] px-2">
        <RouterLink to="/" class="text-green-500">File</RouterLink>
        <RouterLink to="/about">View</RouterLink>
        <RouterLink to="/about">Add</RouterLink>
        <RouterLink to="/about">Tools</RouterLink>
        <RouterLink to="/about">Help</RouterLink>
      </nav>
    </div>

    <div class="flex flex-row w-full shadow-xl px-3 py-2">

      <div class="flex flex-row w-[280px] rounded-3xl bg-neutral-800 py-1 px-4 items-center">
        <font-awesome-icon icon="fa-magnifying-glass" />
        <input v-model="searchField" type="text" class="ml-2 bg-[#262626] focus-within:outline-none" placeholder="Search for ...">
      </div>

      <div class="flex flex-col justify-around w-full py-1 px-4">
        <div class="flex">
          <div class="flex gap-4 pr-5" style="border-right: 2px solid rgb(60, 60, 60);">
            <button @click="activateMapDraw('marker')"
              v-tippy="{ content: 'Add User', placement: 'left', arrow: true, animation: 'fade', }"
              class="btn border-none bg-[#80808033]"><font-awesome-icon :icon="['fas', 'location-dot']" /></button>
            <button @click="activateMapDraw('polyline')" content="Add Fiber" v-tippy
              class="btn border-none bg-[#80808033]">
              <font-awesome-icon :icon="['fas', 'draw-polygon']" />
            </button>
          </div>

          <div class="flex-initial pl-5">
            <button @click="activateMapDraw('polygon')" v-tippy="'Add Area'"
              class="btn border-none bg-[#80808033]"><font-awesome-icon :icon="['fas', 'ruler-horizontal']" /></button>
            <button v-if="showMenubar" @click="toggleMenubar()" v-tippy="'Hide the menubar'"
              class="btn border-none hover:bg-[#80808033] ml-2 text-cyan-200 hover:text-cyan-400">
              <font-awesome-icon :icon="['fas', 'angle-up']" />
            </button>
            <button @click="toggleMenubar()" v-else
              v-tippy="{ content: 'Show the menubar', placement: 'right', animation: 'fade', }"
              class="btn border-none hover:bg-[#80808033] ml-2 text-cyan-200 hover:text-cyan-400">
              <font-awesome-icon :icon="['fas', 'angle-down']" />
            </button>
          </div>
        </div>
      </div>

      <div class="flex absolute right-0 top-1">
        <div x-data="{ open: false }" class=" w-64  shadow flex justify-end items-center pr-3">
          <div @click="open = !open" class="relative border-b-4 border-transparent"
            :class="{ 'border-indigo-700 transform transition duration-300 ': open } && { 'py-1' : showMenubar }">
            <div class="flex justify-end items-center space-x-3 cursor-pointer">
              <div class="w-[40px] h-[40px] rounded-full overflow-hidden border-2 dark:border-white border-gray-900">
                <img
                  v-if="authUser && authUser.user_profile"
                  :src="authUser.user_profile.photo_url"
                  alt="" class="w-full h-full object-cover">
                <img
                 v-else
                  src="https://images.unsplash.com/photo-1610397095767-84a5b4736cbd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
                  alt="" class="w-full h-full object-cover">
              </div>
              <div class="font-semibold dark:text-white text-gray-900 text-lg">
                <div class="cursor-pointer p-0 m-0" v-if="authUser">
                  <span class="uppercase text-[13px] text-right">{{ authUser.user_name }}</span><br/>
                </div>
                <div class="cursor-pointer p-0 m-0">
                  <span class="uppercase text-[13px] text-cyan-400">{{ mixin.cn(authStore, 'user.user_role.name') }}</span><br/>
                </div>
              </div>
            </div>
            <div v-show="open" class="absolute right-[-10px] w-56 px-5 py-3 dark:bg-gray-800 bg-white rounded-lg shadow border dark:border-transparent mt-5">
              <ul class="space-y-3 dark:text-white">
                <!--
                <li class="font-medium">
                  <a href="#"
                    class="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-indigo-700">
                    <div class="mr-3">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    Account
                  </a>
                </li>
                <li class="font-medium">
                  <a href="#"
                    class="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-indigo-700">
                    <div class="mr-3">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                        </path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    Setting
                  </a>
                </li>-->
                <hr class="dark:border-gray-700">
                <li class="font-medium">
                  <a href="#" @click="logout()"
                    class="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-red-600">
                    <div class="mr-3 text-red-600">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                        </path>
                      </svg>
                    </div>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  </header>
</template>

<style scoped>@import '@/style.css';</style>