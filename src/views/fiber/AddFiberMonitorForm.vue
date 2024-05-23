<script setup>
import { ref, onMounted, computed, watchEffect } from "vue";
import RestApi from '@/libs/config'
import mixin from '@/libs/mixin'
import { useToast } from 'vue-toastification'
import { Form, Field, ErrorMessage, useForm } from 'vee-validate';
import * as yup from 'yup';

const toast = useToast()

const loading = ref(false)
const myForm = ref()
const addTJModalRef = ref()

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

const getColorNameOrCode = computed(() => {
    let colorCode = ''
    const colorList = props.dropdownList.colors
    if (colorList.length) {
        const colorObj = colorList.find(item => item.value == color_code.value)
        colorCode = colorObj ? colorObj.label : ''
    }
    return colorCode
})

function ipv4(message = 'Invalid IP address') {
  return this.matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, {
    message,
    excludeEmptyString: true
  }).test('ip', message, value => {
    return value === undefined || value.trim() === ''
      ? true
      : value.split('.').find(i => parseInt(i, 10) > 255) === undefined;
  });
}

yup.addMethod(yup.string, 'ipv4', ipv4);


const schema = yup.object({
    id: yup.string().label('Id'),
    fiberarea: yup.string().required().label('Fiber Area'),
    map_type: yup.string().required().label('Map Type'),
    fibercorep: yup.string().required().label('Fibercorep'),
    fibername: yup.string().required().max(10).label('Fibername'),
    fiber_code: yup.string().required().label('Fiber Code'),
    width_height: yup.number().required().min(1).max(7).label('Fiber Weight'),
    ipaddr: yup.string().ipv4().required().label('IP Address'),
    note: yup.string().required().label('Note'),
});

const { errors, setErrors, setValues, setFieldValue, defineField, handleSubmit } = useForm({
    validationSchema: schema,
});

const [id] = defineField('id');
const [user] = defineField('user');
const [fiberarea] = defineField('fiberarea');
const [map_type] = defineField('map_type');
const [fibercorep] = defineField('fibercorep');
const [fibername] = defineField('fibername');
const [fiber_code] = defineField('fiber_code');
const [color_code] = defineField('color_code');
const [width_height] = defineField('width_height');
const [note] = defineField('note');
const [coordinates] = defineField('coordinates');
const [ipaddr] = defineField('ipaddr');

const resetFormData = () => {
    setValues({
        fiberarea: '',
        map_type: '',
        fibercorep: '',
        fibername: '',
        fiber_code: '',
        color_code: 'green',
        width_height: '',
        ipaddr: '',
        note: '',
        coordinates: '',
    });

    listReload('polyline')
}


const onSubmit = handleSubmit(async (values, { resetForm }) => {
    loading.value = true
    let result = ''
    try {
        if (values.id) {
            result = await RestApi.post('api/v1/sg-3/fibermonitor_create/', values)
        } else {
            result = await RestApi.post('api/v1/sg-3/fibermonitor_create/', values)
        }

        if (result.status == 201) {
            toast.success('Fiber Monitor has been created!')
            resetForm();
            addTJModalRef.value.hide()
            listReload('polyline_fiber_monitor')
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

const show = (formValue) => {

    const authUser = JSON.parse(localStorage.getItem('authUser'))
    setFieldValue('user', mixin.cn(authUser, 'id'));
    //   setValues({
    //     email: 'test@example.com',
    //   });
    // setFieldValue('email', 'test@example.com');
    setFieldValue('id', '');
    setFieldValue('coordinates', formValue);
    setFieldValue('color_code', 'green');
    addTJModalRef.value.show()
}

defineExpose({
    show
})

onMounted(async () => {
    // console.log('form.value - initial', form.value)
    // getIpAddressInfo()
});


const getIpAddressInfo = async () => {
    loading.value = true
    try {
        let result = await RestApi.get('https://ipinfo.io')

        console.log('result', result)

    } catch (error) {
        console.log('error', error)
    }
}

</script>

<template>
    <ModalR ref="addTJModalRef">
        <template #header>
            <h6>{{ id ? 'Update' : 'Add New' }} Fiber Monitor</h6>
        </template>
        <Form ref="myForm" @submit="onSubmit">
            <div class="flex-1 rounded-lg p-2 shadow-cyan-sm shadow-sm">


                <div class="mb-2 pb-4">
                    <label for="fiberarea" class="input-label">Fiber Area</label>
                    <v-select v-model="fiberarea" :options="dropdownList.tjareas" :reduce="item => item.value"
                        id="fiberarea" placeholder="Select Area" />
                    <p class="error-text">{{ errors.fiberarea }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="fibercorep" class="input-label">Fibercores</label>
                    <v-select v-model="fibercorep" :options="dropdownList.fibercores" :reduce="item => item.value"
                        id="fibercorep" placeholder="Select Fiber Cores" />
                    <p class="error-text">{{ errors.fibercorep }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="map_type" class="input-label">Map Type</label>
                    <v-select v-model="map_type" :options="dropdownList.map_types" :reduce="item => item.value"
                        id="map_type" placeholder="Select Map Type" />
                    <p class="error-text">{{ errors.map_type }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="fibername" class="input-label">Fibername</label>
                    <input type="text" v-model="fibername" id="fibername" class="input-control"
                        placeholder="Enter Fibername" />
                    <p class="error-text">{{ errors.fibername }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="fiber_code" class="input-label">Fiber code</label>
                    <input type="text" v-model="fiber_code" id="fiber_code" class="input-control"
                        placeholder="Enter Fiber code" />
                    <p class="error-text">{{ errors.fiber_code }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="ipaddr" class="input-label">IP Address</label>
                    <input type="text" v-model="ipaddr" id="ipaddr" class="input-control" placeholder="Enter ip address" />
                    <p class="error-text">{{ errors.ipaddr }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="width_height" class="input-label">Fiber Weight</label>
                    <input type="text" v-model="width_height" id="width_height" class="input-control" placeholder="Enter Fiber Weight" />
                    <p class="error-text">{{ errors.width_height }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="note" class="input-label">Note</label>
                    <input type="text" v-model="note" id="note" class="input-control" placeholder="Enter username" />
                    <p class="error-text">{{ errors.note }}</p>
                </div>

                <div class="text-right">
                    <button @click="resetFormData()"
                        class="btn bg-red-600 hover:bg-red-500 text-gray-300 ml-3">Reset</button>
                    <button type="submit" class="btn bg-[#2f3e56] hover:bg-[#3c4f6d] text-gray-300 ml-3">
                        Save to Project
                    </button>
                </div>

            </div>
        </Form>
    </ModalR>
</template>

<style scoped>
@import '@/style.css';
</style>

