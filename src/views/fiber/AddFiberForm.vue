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

const schema = yup.object({
    id: yup.string().label('Id'),
    fiberarea: yup.string().required().label('Fiber Area'),
    map_type: yup.string().required().label('Map Type'),
    fibercorep: yup.string().required().label('Fibercorep'),
    fibername: yup.string().required().label('Fibername'),
    fiber_code: yup.string().required().label('Fiber Code'),
    width_height: yup.number().required().label('Fiber Width'),
    color_code: yup.string().required().min(2).label('Color Code'),
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

const resetFormData = () => {
    setValues({
        fiberarea: '',
        map_type: '',
        fibercorep: '',
        fibername: '',
        fiber_code: '',
        color_code: '',
        width_height: '',
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
            result = await RestApi.post('api/v1/sg-5/create_line_draw/', values)
        } else {
            result = await RestApi.post('api/v1/sg-5/create_line_draw/', values)
        }

        if (result.status == 201) {
            toast.success('Fiber has been created!')
            resetForm();
            addTJModalRef.value.hide()
            listReload('polyline')
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
    addTJModalRef.value.show()
}

defineExpose({
    show
})

onMounted(async () => {
    // console.log('form.value - initial', form.value)
});

</script>

<template>
    <ModalR ref="addTJModalRef">
        <template #header>
            <h6>{{ id ? 'Update' : 'Add New' }} Fiber</h6>
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

                <div class="mb-2 pb-4 flex justify-between">
                    <div class="w-full">
                        <label for="color_code" class="input-label">Fiber Color</label>
                        <v-select v-model="color_code" :options="dropdownList.colors" :reduce="item => item.value"
                            id="color_code" placeholder="Select Color" />
                        <p class="error-text">{{ errors.color_code }}</p>
                    </div>
                    {{ getColorNameOrCode }}
                    <div v-if="getColorNameOrCode" class="w-[30%] h-[37px] mt-[30px] ml-3 rounded"
                        :style="`background: ${getColorNameOrCode}`">
                    </div>
                </div>

                <div class="mb-2 pb-4">
                    <label for="width_height" class="input-label">Fiber Width</label>
                    <input type="text" v-model="width_height" id="width_height" class="input-control" placeholder="Enter Fiber Width" />
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
