<script setup>
import { ref, onMounted, computed, watchEffect, reactive } from "vue";
import RestApi from '@/libs/config'
import mixin from '@/libs/mixin'
import { useToast } from 'vue-toastification'
import { Form, Field, ErrorMessage, useForm } from 'vee-validate';
import * as yup from 'yup';
import { AVWaveform } from 'vue-audio-visual'

const toast = useToast()

const loading = ref(false)
const myForm = ref()
const TJDetailsModalRef = ref()

const emit = defineEmits(["getListReload"])

const listReload = (listType) => {
    emit("getListReload", listType);
}

const props = defineProps({
    dropdownList: {
        fibercores: [],
        map_types: [],
        tjareas: [],
        tjtypes: [],
        splitters: [],
        colors: [],
        tj_types: [],
        userList: [],
        tjNumberList: [],
    }
})

const viewLocation = (item) => {
    console.log('item', item)
    const tj_longlate = item.tj_longlate.replace(/\s/g, '');
    console.log('tj_longlate', tj_longlate)
    const lat = tj_longlate.split(',')[0];
    const long = tj_longlate.split(',')[0];
    // const url = `https://www.google.com/maps/place/${lat}+${long}`;
    // const url = `https://www.latlong.net/c/?lat=${lat}&long=${long}`;
    // window.open(url, '_blank');
    window.open(`https://www.google.com/maps/place/22%C2%B052'13.2%22N+91%C2%B006'09.9%22E/@${tj_longlate},17z/data=!3m1!4b1!4m4!3m3!8m2!3d22.8703333!4d91.10275?entry=ttu`, '_blank');
    // window.location.href = 'https://www.google.com/maps/place/22%C2%B052'13.2%22N+91%C2%B006'09.9%22E/@22.8703333,91.10275,17z/data=!3m1!4b1!4m4!3m3!8m2!3d22.8703333!4d91.10275?entry=ttu'
}

// watcher
watchEffect(() => {
    // console.log('email - watchEffect')
})

const tjDetailItem = ref({})

const show = async (tjNumber) => {
    tjDetailItem.value = {}
    // tjDetailItem.value = JSON.parse(tjNumber)
    await getTjDetailsData(tjNumber)
    await getTjVoiceAndImageData(tjNumber)
    TJDetailsModalRef.value.show()
}

const close = async () => {
    TJDetailsModalRef.value.hide()
}

const getTjDetailsData = async (tjNumber) => {
    loading.value = true
    try {

        tjDetailItem.value = {}
        let result = await RestApi.get(`/api/v1/sg-5/get-tj-details-by-id/${tjNumber}/`)

        if (result.data) {
            tjDetailItem.value = result.data
            console.log('tjDetailItem', tjDetailItem.value)
        }
    } catch (error) {
        console.log('error', error)
    } finally {
        loading.value = false
    }
}

const tjVoiceList = ref([])
const tjImageList = ref([])

const getTjVoiceAndImageData = async (tjNumber) => {
    loading.value = true
    try {

        const tjCustomNumber = tjNumber.replace('TJ', '')

        tjVoiceList.value = []
        tjImageList.value = []
        let result = await RestApi.get(`/api/v1/sg-5/get-tjvoiceimage/${tjCustomNumber}/`)

        if (result.data) {
            tjImageList.value = result.data.filter(item => item.image)
            tjVoiceList.value = result.data.filter(item => item.voice)
            console.log('tjImageList', tjImageList.value)
            console.log('tjVoiceList', tjVoiceList.value)
        }
    } catch (error) {
        console.log('error', error)
    } finally {
        loading.value = false
    }
}

defineExpose({
    show
})

onMounted(async () => {
    // console.log('form.value - initial', form.value)
});

const activeTab = ref('list')

const selectTab = (tabValue) => {
    activeTab.value = tabValue
}

</script>

<template>
    <ModalR ref="TJDetailsModalRef">
        <template #header>
            <h6>TJ Details</h6>
        </template>
        <div class="flex-1 rounded-lg p-2 shadow-cyan-sm shadow-sm">

            <div class="mb-2 p-6 bg-[#0D2139] text-slate-200 rounded-xl">
                <button class="btn btn-silver">Splitter | {{ tjDetailItem.spilitter }}</button>
                <button @click="viewLocation(tjDetailItem)" class="btn btn-silver ml-3">View Location <font-awesome-icon
                        class="text-green-600 ml-2" :icon="['fas', 'location-dot']" /></button>
                <p class="mt-2">{{ tjDetailItem.tj_area_name }}</p>
            </div>

            <div class="border-b border-gray-200 dark:border-gray-700">
                <ul class="flex flex-row gap-3 mb-3 text-sm font-medium text-center text-gray-500">
                    <li class="me-2">
                        <button @click="selectTab('list')" :class="activeTab == 'list' ? 'active-tab-btn' : 'tab-btn'">
                            <font-awesome-icon :icon="['fas', 'list']" class="mr-2" />List
                        </button>
                    </li>
                    <li class="me-2">
                        <button @click="selectTab('voice')"
                            :class="activeTab == 'voice' ? 'active-tab-btn' : 'tab-btn'">
                            <font-awesome-icon :icon="['fas', 'microphone']" class="mr-2" />Voice
                        </button>
                    </li>
                    <li class="me-2">
                        <button @click="selectTab('image')"
                            :class="activeTab == 'image' ? 'active-tab-btn' : 'tab-btn'">
                            <font-awesome-icon :icon="['far', 'image']" class="mr-2" />Image
                        </button>
                    </li>
                </ul>
            </div>


            <div>
                <div v-show="activeTab == 'list'" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div class="flex justify-start items-center gap-1 w-[100%]">
                        <div class="px-5 py-2 bg-gray-300 text-blue-950 flex flex-col rounded-lg min-w-[175px]">
                            <div class="flex flex-row items-center">
                                <font-awesome-icon :icon="['far', 'calendar']"
                                    class="mr-2 p-2 bg-blue-950 text-slate-200 rounded-full" />
                                <span>{{ tjDetailItem.tj_number }}</span>
                            </div>
                            <p class="mt-2 text-[12px] font-semibold">{{ mixin.dDate(tjDetailItem.update_date) }}</p>
                        </div>
                        <font-awesome-icon :icon="['fas', 'link']" class="text-yellow-500" />
                        <div class="px-5 py-2 bg-gray-300 text-blue-950 flex flex-col rounded-lg min-w-[175px]">
                            <div class="flex flex-row items-center">
                                <font-awesome-icon :icon="['far', 'calendar']"
                                    class="mr-2 p-2 bg-blue-950 text-slate-200 rounded-full" />
                                <span>{{ tjDetailItem.tj_connect }}</span>
                            </div>
                            <p class="mt-2 text-[12px] font-semibold">{{ mixin.dDate(tjDetailItem.update_date) }}</p>
                        </div>
                    </div>

                    <h6 v-if="tjDetailItem.splitelist && tjDetailItem.splitelist.length" class="my-4 text-slate-300 text-[15px] font-semibold">
                        Splite List: {{ tjDetailItem.splitelist.length }}
                    </h6>

                    <div v-if="tjDetailItem.splitelist" class="grid grid-cols-2 gap-4 mb-4">
                        <div v-for="(item, splitIndex) in tjDetailItem.splitelist" :key="splitIndex" class="bg-gray-300 text-blue-950 rounded-lg px-5 py-2 ">
                            <p class="mt-2 text-[12px] font-semibold">{{ item.userid }} | {{ item.lineby }}</p>
                            <p class="mt-2 text-[12px] flex flex-row items-center font-semibold"><font-awesome-icon
                                    :icon="['far', 'clock']" class="mr-1" /> {{ mixin.dDate(item.createdate) }}</p>
                        </div>
                    </div>
                    <!--
                    <template v-for="(item, splitIndex) in tjDetailItem.splitelist" :key="splitIndex">
                        <div class="flex justify-start items-center gap-4 w-full mb-4">
                            <div class="px-5 py-2 bg-gray-300 text-blue-950 flex flex-col rounded-lg min-w-[48%]">
                                <p class="mt-2 text-[12px] font-semibold">{{ item.userid }} | {{ item.lineby }}</p>
                                <p class="mt-2 text-[12px] flex flex-row items-center font-semibold"><font-awesome-icon
                                        :icon="['far', 'clock']" class="mr-1" /> {{ mixin.dDate(item.createdate) }}</p>
                            </div>
                            <div class="px-5 py-2 bg-gray-300 text-blue-950 flex flex-col rounded-lg min-w-[48%]">
                                <p class="mt-2 text-[12px] font-semibold">{{ item.userid }} | {{ item.lineby }}</p>
                                <p class="mt-2 text-[12px] flex flex-row items-center font-semibold"><font-awesome-icon
                                        :icon="['far', 'clock']" class="mr-1" /> {{ mixin.dDate(item.createdate) }}</p>
                            </div>
                        </div>
                    </template>-->

                    <h6 v-if="tjDetailItem.disconnectuser && tjDetailItem.disconnectuser.length" class="my-4 text-slate-300 text-[15px] font-semibold">
                        Disconnect Users: </h6>

                    <div v-if="tjDetailItem.disconnectuser" class="grid grid-cols-2 gap-4 mb-4">
                        <div v-for="(item, index) in tjDetailItem.disconnectuser" :key="index" class="bg-gray-300 text-blue-950 rounded-lg px-5 py-2 ">
                            <p class="mt-2 text-[12px] font-semibold">{{ item.userid }} | {{ item.lineby }}</p>
                            <p class="mt-2 text-[12px] flex flex-row items-center font-semibold"><font-awesome-icon
                                    :icon="['far', 'clock']" class="mr-1" /> {{ mixin.dDate(item.createdate) }}</p>
                        </div>
                    </div>

                    <h6 v-if="tjDetailItem.ponlist && tjDetailItem.ponlist.length" class="my-4 text-slate-300 text-[15px] font-semibold">Pon
                        List: </h6>

                    <div v-if="tjDetailItem.ponlist" class="grid grid-cols-2 gap-4 mb-4">
                        <div v-for="(item, splitIndex) in tjDetailItem.ponlist" :key="splitIndex" class="bg-gray-300 text-blue-950 rounded-lg px-5 py-2 ">
                            <p class="mt-2 text-[12px] font-semibold">{{ item.userid }} | {{ item.lineby }}</p>
                            <p class="mt-2 text-[12px] flex flex-row items-center font-semibold"><font-awesome-icon
                                    :icon="['far', 'clock']" class="mr-1" /> {{ mixin.dDate(item.createdate) }}</p>
                        </div>
                    </div>

                    <h6 v-if="tjDetailItem.tj_description" class="my-4 text-slate-300 text-[15px] font-semibold">
                        Description:
                    </h6>
                    <p class="text-[12px] text-slate-300 font-semibold">{{ tjDetailItem.tj_description }}</p>
                </div>

                <div v-show="activeTab == 'voice'" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <p v-if="!tjVoiceList.length" class="text-sm text-red-500">Voice Not Found!</p>
                        <div v-for="(item, index) in tjVoiceList" :key="index" class="flex justify-start items-center gap-4 w-full mb-4">
                            <div class="px-5 py-2 flex flex-col min-w-[48%]">
                                <!--<AVWaveform src="/src/assets/audio/file_example.ogg" />-->
                                <AVWaveform :src="item.voice" />
                            </div>
                        </div>
                </div>

                <div v-show="activeTab == 'image'" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <p v-if="!tjImageList.length" class="text-sm text-red-500">Image Not Found!</p>

                    <div v-if="tjImageList" class="grid grid-cols-2 gap-4 mb-4">
                        <div v-for="(item, splitIndex) in tjImageList" :key="splitIndex" class="rounded-lg px-5 py-2 ">
                            <img :src="item.image" class="w-full h-auto" alt="Image">
                        </div>
                    </div>
                </div>
            </div>


            <div class="text-right mt-4">
                <button @click="close()" class="btn bg-red-600 hover:bg-red-500 text-gray-300 ml-3">Close</button>
            </div>

        </div>
    </ModalR>
</template>

<style scoped>
@import '@/style.css';
</style>
