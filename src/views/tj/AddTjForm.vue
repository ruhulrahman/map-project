<script setup>
import { ref, onMounted, computed, watchEffect, reactive } from "vue";
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
    tj_number: yup.string().required().label('Tj Number'),
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
const [tj_number] = defineField('tj_number');
const [tj_connect] = defineField('tj_connect');
const [tj_description] = defineField('tj_description');

const resetFormData = () => {
    setValues({
        tj_area_name: '',
        spilitter: '',
        tj_type: '',
        tj_longlate: '',
        tj_number: '',
        tj_connect: '',
        tj_description: '',
    });
    
    listReload('marker')
}

const onSubmit = handleSubmit(async (values, { resetForm }) => {
    loading.value = true
    let result = ''
    try {
        console.log('values', values)
        if (values.id) {
            result = await RestApi.post('api/v1/sg-5/create_tj_numbers/', values)
        } else {
            result = await RestApi.post('api/v1/sg-5/create_tj_numbers/', values)
        }

        if (result.status == 201) {
            toast.success('Tj has been created!')
            resetForm();
            addTJModalRef.value.hide()
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

const show = (formValue) => {

    //   setValues({
    //     email: 'test@example.com',
    //   });
    // setFieldValue('email', 'test@example.com');
    setFieldValue('id', '');
    setFieldValue('tj_longlate', JSON.stringify(formValue));
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
            <h6>{{ id ? 'Update' : 'Add New' }} Tj</h6>
        </template>
        <Form ref="myForm" @submit="onSubmit">
            <div class="flex-1 rounded-lg p-2 shadow-cyan-sm shadow-sm">


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
                    <label for="tj_number" class="input-label">Tj Number</label>
                    <input type="text" v-model="tj_number" id="tj_number" class="input-control"
                        placeholder="Enter tj number" />
                    <p class="error-text">{{ errors.tj_number }}</p>
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
        </Form>
    </ModalR>
</template>

<style scoped>
@import '@/style.css';
</style>
