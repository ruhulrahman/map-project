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
const userDetailsModalRef = ref()

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

// watcher
watchEffect(() => {
    // console.log('email - watchEffect')
})

const userInfoItem = ref({})

const show = async (pppoe_id) => {
    userInfoItem.value = {}
    // userInfoItem.value = JSON.parse(pppoe_id)
    await getUserInfoByPPPOEId(pppoe_id)
    await getSupportVoiceAndImageData(pppoe_id)
    await getNewConnVoiceAndImageData(pppoe_id)
    userDetailsModalRef.value.show()
}

const close = async () => {
    userDetailsModalRef.value.hide()
}


const getUserInfoByPPPOEId = async (pppoe_id) => {
    loading.value = true
    try {

        userInfoItem.value = {}
        let result = await RestApi.get(`/api/v1/sg-5/combined/user-info/${pppoe_id}/`)

        if (result.data) {
            userInfoItem.value = result.data
            console.log('userInfoItem', userInfoItem.value)
        }
    } catch (error) {
        console.log('error', error)
    } finally {
        loading.value = false
    }
}

const supportImageNVoiceList = ref([])
const newConnImageNVoiceList = ref([])


const getSupportVoiceAndImageData = async (pppoe_id) => {
    loading.value = true
    try {

        supportImageNVoiceList.value = []
        let result = await RestApi.get(`/api/v1/sg-5/get-sotrage-image-voice/?type_storage=support&pppoe_id=${pppoe_id}`)

        if (result.data) {
            supportImageNVoiceList.value = result.data
        }
    } catch (error) {
        console.log('error', error)
    } finally {
        loading.value = false
    }
}

const getNewConnVoiceAndImageData = async (pppoe_id) => {
    loading.value = true
    try {

        newConnImageNVoiceList.value = []
        let result = await RestApi.get(`/api/v1/sg-5/get-sotrage-image-voice/?type_storage=newconn&pppoe_id=${pppoe_id}`)

        if (result.data) {
            newConnImageNVoiceList.value = result.data
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

const activeTab = ref('newConn')

const selectTab = (tabValue) => {
    activeTab.value = tabValue
}

const activeSubTab = ref('sub_support')

const selectSubTab = (tabValue) => {
    activeSubTab.value = tabValue
}

</script>

<template>
    <ModalR ref="userDetailsModalRef">
        <template #header>
            <h6>User Details</h6>
        </template>
        <div class="flex-1 rounded-lg p-2 shadow-cyan-sm shadow-sm">
            <div class="border-b border-gray-200 dark:border-gray-700">
                <ul class="flex flex-row gap-1 mb-3 text-sm font-medium text-center text-gray-500">
                    <li class="text-[12px]">
                        <button @click="selectTab('newConn')" :class="activeTab == 'newConn' ? 'active-tab-btn' : 'tab-btn'">
                            New Conn.
                        </button>
                    </li>
                    <li class="text-[12px]">
                        <button @click="selectTab('oltPort')"
                            :class="activeTab == 'oltPort' ? 'active-tab-btn' : 'tab-btn'">
                            Olt Data Port
                        </button>
                    </li>
                    <li class="text-[12px]">
                        <button @click="selectTab('support')"
                            :class="activeTab == 'support' ? 'active-tab-btn' : 'tab-btn'">
                            Support
                        </button>
                    </li>
                    <li class="text-[12px]">
                        <button @click="selectTab('image_n_voice')"
                            :class="activeTab == 'image_n_voice' ? 'active-tab-btn' : 'tab-btn'">
                            Image/Voice
                        </button>
                    </li>
                </ul>
            </div>


            <div>
                <!--Tab body Start-->
                <div v-show="activeTab == 'newConn'" class="w-[100%]">
                    <div class="px-5 py-2 bg-gray-300 text-blue-950 flex flex-col rounded-b-lg min-w-[175px]">
                        <table class="table-auto text-left">
                            <tbody>
                                <tr>
                                    <th class="font-bold">User name</th>
                                    <th>:</th>
                                    <td class="font-bold">{{ userInfoItem?.new_conSotrageListViewnection?.User_name }}</td>
                                </tr>
                                <tr>
                                    <th class="font-medium">Phone Number</th>
                                    <th>:</th>
                                    <td>{{ userInfoItem?.new_conSotrageListViewnection?.Phone_Number }}</td>
                                </tr>
                                <tr>
                                    <th class="font-medium">User area name</th>
                                    <th>:</th>
                                    <td>{{ userInfoItem?.new_conSotrageListViewnection?.User_area_name }}</td>
                                </tr>
                                <tr>
                                    <th class="font-medium">Spilitter SE</th>
                                    <th>:</th>
                                    <td>{{ userInfoItem?.new_conSotrageListViewnection?.spilitter_SE }}</td>
                                </tr>
                                <tr>
                                    <th class="font-medium">TJ number</th>
                                    <th>:</th>
                                    <td>{{ userInfoItem?.new_conSotrageListViewnection?.tj_number }}</td>
                                </tr>
                                <tr>
                                    <th class="font-medium">HOwfiber</th>
                                    <th>:</th>
                                    <td>{{ userInfoItem?.new_conSotrageListViewnection?.HOwfiber }}</td>
                                </tr>
                                <tr>
                                    <th class="font-medium">pppoe id</th>
                                    <th>:</th>
                                    <td>{{ userInfoItem?.new_conSotrageListViewnection?.pppoe_id }}</td>
                                </tr>
                                <tr>
                                    <th class="font-medium">Connection by</th>
                                    <th>:</th>
                                    <td>{{ userInfoItem?.new_conSotrageListViewnection?.Connection_by }}</td>
                                </tr>
                                <tr>
                                    <th class="font-medium">Activation Date</th>
                                    <th>:</th>
                                    <td>{{ mixin.dDate(userInfoItem?.new_conSotrageListViewnection?.connection_activate) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-show="activeTab == 'oltPort'" class="w-[100%]">
                    <div class="px-5 py-2 bg-gray-300 text-blue-950 flex flex-col rounded-b-lg min-w-[175px]">
                        <table class="table-auto text-left">
                            <tbody>
                                <tr>
                                    <th class="font-medium">Mac address</th>
                                    <th>:</th>
                                    <td>{{ userInfoItem?.olt_data_port?.mac_address }}</td>
                                </tr>
                                <tr>
                                    <th class="font-medium">vlan id</th>
                                    <th>:</th>
                                    <td>{{ userInfoItem?.olt_data_port?.vlan_id }}</td>
                                </tr>
                                <tr>
                                    <th class="font-medium">Description</th>
                                    <th>:</th>
                                    <td>{{ userInfoItem?.olt_data_port?.description }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-show="activeTab == 'support'" class="w-[100%]">
                    <div class="px-5 py-2 bg-gray-300 text-blue-950 flex flex-col rounded-b-lg min-w-[175px]">
                        <table class="table-auto text-left">
                            <tbody>
                                <tr>
                                    <th class="font-medium">Support by</th>
                                    <th>:</th>
                                    <td>{{ userInfoItem?.support?.Support_by }}</td>
                                </tr>
                                <tr>
                                    <th class="font-medium">User id</th>
                                    <th>:</th>
                                    <td>{{ userInfoItem?.support?.User_id }}</td>
                                </tr>
                                <tr>
                                    <th class="font-medium">Support date</th>
                                    <th>:</th>
                                    <td>{{ mixin.dDate(userInfoItem?.support?.support_date) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-show="activeTab == 'image_n_voice'" class="w-[100%]">
                    <div class="border-b border-gray-200 dark:border-gray-700">
                        <ul class="flex flex-row gap-3 mb-3 text-sm font-medium text-center text-gray-500">
                            <li class="me-2">
                                <button @click="selectSubTab('sub_support')"
                                    :class="activeSubTab == 'sub_support' ? 'active-tab-btn' : 'tab-btn'">
                                    <font-awesome-icon :icon="['fas', 'truck-medical']" class="mr-2" />Support
                                </button>
                            </li>
                            <li class="me-2">
                                <button @click="selectSubTab('sub_newCon')"
                                    :class="activeSubTab == 'sub_newCon' ? 'active-tab-btn' : 'tab-btn'">
                                    <font-awesome-icon :icon="['fas', 'plug-circle-plus']" class="mr-2" />New Connection
                                </button>
                            </li>
                        </ul>
                    </div>
                    
                    <div v-show="activeSubTab == 'sub_support'"  class="flex flex-col min-w-[175px]">
                        <table class="table-auto text-left px-5 py-2 mb-2 bg-gray-300 text-blue-950  rounded-md" v-for="(item, index) in supportImageNVoiceList" :key="index">
                            <tbody v-if="item.image || item.voice">
                                <tr v-if="item.image">
                                    <th class="font-medium p-3">Image</th>
                                    <th>:</th>
                                    <td class="pt-2">
                                        <img v-if="item.image" :src="item.image" class="w-[100px] h-auto" alt="Image" />
                                    </td>
                                </tr>
                                <tr v-if="item.voice">
                                    <th class="font-medium p-3">Voice</th>
                                    <th>:</th>
                                    <td>
                                        <div class="px-5 py-2 flex flex-col min-w-[48%]">
                                            <AVWaveform :src="item.voice" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div v-show="activeSubTab == 'sub_newCon'"  class="flex flex-col min-w-[175px]">
                        <table class="table-auto text-left px-5 py-2 mb-2 bg-gray-300 text-blue-950  rounded-md" v-for="(item, index) in newConnImageNVoiceList" :key="index">
                            <tbody v-if="item.image || item.voice">
                                <tr v-if="item.image">
                                    <th class="font-medium p-3">Image</th>
                                    <th>:</th>
                                    <td class="pt-2">
                                        <img v-if="item.image" :src="item.image" class="w-[100px] h-auto" alt="Image" />
                                    </td>
                                </tr>
                                <tr v-if="item.voice">
                                    <th class="font-medium p-3">Voice</th>
                                    <th>:</th>
                                    <td>
                                        <div class="px-5 py-2 flex flex-col min-w-[48%]">
                                            <AVWaveform :src="item.voice" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <!--Tab body End-->
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
