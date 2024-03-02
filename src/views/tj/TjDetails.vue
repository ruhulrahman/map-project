<script setup>
import { ref, onMounted, computed, watchEffect, reactive } from "vue";
import RestApi from '@/libs/config'
import mixin from '@/libs/mixin'
import { useToast } from 'vue-toastification'
import { Form, Field, ErrorMessage, useForm } from 'vee-validate';
import * as yup from 'yup';
import 'https://unpkg.com/@themesberg/flowbite@1.2.0/dist/flowbite.bundle.js';

const toast = useToast()

const loading = ref(false)
const myForm = ref()
const TJDetailsModalRef = ref()

const emit = defineEmits(["getListReload"])

const listReload = (listType) => {
    emit("getListReload", listType);
}

defineProps({
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

const schema = yup.object({
    id: yup.string().label('Id'),
    tj_area_name: yup.string().required().label('Tj Area'),
    spilitter: yup.string().required().label('Splitter'),
    tj_type: yup.string().required().label('Tj Type'),
    tj_longlate: yup.string().required().label('Tj latlong'),
    tjnumber: yup.number().required().label('Tj Number'),
    tj_connect: yup.string().required().min(2).label('Tj Connect'),
    tj_description: yup.string().required().min(2).label('Description'),
});

const { errors, setErrors, setValues, setFieldValue, defineField, handleSubmit } = useForm({
    validationSchema: schema,
});

const [id] = defineField('id');
const [tj_area_name] = defineField('tj_area_name');
const [spilitter] = defineField('spilitter');
const [tj_type] = defineField('tj_type');
const [tj_longlate] = defineField('tj_longlate');
const [tjnumber] = defineField('tjnumber');
const [tj_connect] = defineField('tj_connect');
const [tj_description] = defineField('tj_description');

const resetFormData = () => {
    setValues({
        tj_area_name: '',
        spilitter: '',
        tj_type: '',
        tj_longlate: '',
        tjnumber: '',
        tj_connect: '',
        tj_description: '',
    });
    
    listReload('marker')
}

const viewLocation = (item) => {
    console.log('item', item)
    const tj_longlate = item.tj_longlate.replace(/\s/g, '');
    console.log('tj_longlate', tj_longlate)
    const lat = tj_longlate.split(',')[0];
    const long = tj_longlate.split(',')[0];
    // const url = `https://www.google.com/maps/place/${lat}+${long}`;
    const url = `https://www.latlong.net/c/?lat=${lat}&long=${long}`;
    window.open(url, '_blank');
    // window.open(`https://www.google.com/maps/place/22%C2%B052'13.2%22N+91%C2%B006'09.9%22E/@${tj_longlate},17z/data=!3m1!4b1!4m4!3m3!8m2!3d22.8703333!4d91.10275?entry=ttu`, '_blank');
    // window.location.href = 'https://www.google.com/maps/place/22%C2%B052'13.2%22N+91%C2%B006'09.9%22E/@22.8703333,91.10275,17z/data=!3m1!4b1!4m4!3m3!8m2!3d22.8703333!4d91.10275?entry=ttu'
}

const onSubmit = handleSubmit(async (values, { resetForm }) => {
    loading.value = true
    let result = ''
    try {
        if (values.id) {
            result = await RestApi.post('api/v1/sg-5/create_tj_numbers/', values)
        } else {
            result = await RestApi.post('api/v1/sg-5/create_tj_numbers/', values)
        }

        if (result.status == 201) {
            toast.success('Tj has been created!')
            resetForm();
            TJDetailsModalRef.value.hide()
            listReload('marker')
        }

    } catch (error) {
        console.log('error', error)
        myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
    } finally {
        loading.value = false
    }
});
// watcher
watchEffect(() => {
    // console.log('email - watchEffect')
})

const tjDetailItem = ref({})

const show = (formValue) => {
    tjDetailItem.value = {}
    tjDetailItem.value = JSON.parse(formValue)

    TJDetailsModalRef.value.show()
}

defineExpose({
    show
})

onMounted(async () => {
    // console.log('form.value - initial', form.value)
});

</script>

<template>
    <ModalC ref="TJDetailsModalRef">
        <template #header>
            <h6>TJ Details</h6>
        </template>
            <div class="flex-1 rounded-lg p-2 shadow-cyan-sm shadow-sm">

                <div class="mb-2 p-6 bg-[#0D2139] text-slate-200 rounded-xl">
                    <button @click="resetFormData()" class="btn btn-silver">Splitter | {{ tjDetailItem.splitter_name }}</button>
                    <button @click="viewLocation(tjDetailItem)" class="btn btn-silver ml-3">View Location <font-awesome-icon class="text-green-600 ml-2" :icon="['fas', 'location-dot']" /></button>
                    <p class="mt-2">{{ tjDetailItem.area_name }}</p>
                </div>

                <div class="max-w-2xl mx-auto">
    
    <div class="border-b border-gray-200 dark:border-gray-700 mb-4">
        <ul class="flex flex-wrap -mb-px" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
            <li class="mr-2" role="presentation">
                <button class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300" id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button>
            </li>
            <li class="mr-2" role="presentation">
                <button class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300 active" id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="true">Dashboard</button>
            </li>
            <li class="mr-2" role="presentation">
                <button class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300" id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">Settings</button>
            </li>
            <li role="presentation">
                <button class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300" id="contacts-tab" data-tabs-target="#contacts" type="button" role="tab" aria-controls="contacts" aria-selected="false">Contacts</button>
            </li>
        </ul>
    </div>
    <div id="myTabContent">
        <div class="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 hidden" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            <p class="text-gray-500 dark:text-gray-400 text-sm">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Profile tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg dark:bg-gray-800" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
            <p class="text-gray-500 dark:text-gray-400 text-sm">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Dashboard tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 hidden" id="settings" role="tabpanel" aria-labelledby="settings-tab">
            <p class="text-gray-500 dark:text-gray-400 text-sm">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Settings tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 hidden" id="contacts" role="tabpanel" aria-labelledby="contacts-tab">
            <p class="text-gray-500 dark:text-gray-400 text-sm">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
        </div>
    </div>
</div>

                <div class="mb-2 pb-4">
                    <label for="tj_area_name" class="input-label">Tj Area</label>
                    <v-select v-model="tj_area_name" :options="dropdownList.tjareas" :reduce="item => item.value"
                        id="tj_area_name" placeholder="Select Area" />
                    <p class="error-text">{{ errors.tj_area_name }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="spilitter" class="input-label">Splitter</label>
                    <v-select v-model="spilitter" :options="dropdownList.splitters" :reduce="item => item.value"
                        id="spilitter" placeholder="Select Splitter" />
                    <p class="error-text">{{ errors.spilitter }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="tj_type" class="input-label">Tj Type</label>
                    <v-select v-model="tj_type" :options="dropdownList.tjtypes" :reduce="item => item.value" id="tj_type"
                        placeholder="Select User Type" />
                    <p class="error-text">{{ errors.tj_type }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="tj_longlate" class="input-label">Tj Latlong</label>
                    <input type="text" v-model="tj_longlate" id="tj_longlate" class="input-control"
                        placeholder="Enter latlong" />
                    <p class="error-text">{{ errors.tj_longlate }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="tjnumber" class="input-label">Tj Number</label>
                    <input type="text" v-model="tjnumber" id="tjnumber" class="input-control"
                        placeholder="Enter tj number" />
                </div>

                <div class="mb-2 pb-4">
                    <label for="tj_connect" class="input-label">Tj Connect</label>
                    <v-select v-model="tj_connect" :options="dropdownList.tjNumberList" :reduce="item => item.value"
                        id="tj_connect" placeholder="Select Tj Connect" />
                    <p class="error-text">{{ errors.tj_connect }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="tj_description" class="input-label">Description</label>
                    <input type="text" v-model="tj_description" id="tj_description" class="input-control"
                        placeholder="Enter username" />
                    <p class="error-text">{{ errors.tj_description }}</p>
                </div>

                <div class="text-right">
                    <button @click="resetFormData()" class="btn bg-red-600 hover:bg-red-500 text-gray-300 ml-3">Reset</button>
                    <button type="submit" class="btn bg-[#2f3e56] hover:bg-[#3c4f6d] text-gray-300 ml-3">
                        Save to Project
                    </button>
                </div>

            </div>
    </ModalC>
</template>

<style scoped>
@import '@/style.css';
</style>
