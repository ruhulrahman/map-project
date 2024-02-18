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
const addUserModalRef = ref()

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
        userTypes: [],
        userList: [],
        tjNumberList: [],
    }
})

const schema = yup.object({
    id: yup.string().label('Id'),
    spilitter: yup.string().required().label('Splitter'),
    usertype: yup.string().required().label('User Type'),
    userlatlong: yup.string().required().label('User latlong'),
    tjnumber: yup.number().required().label('Tj Number'),
    lineby: yup.string().required().min(2).label('Line By'),
    userid: yup.string().required().min(2).label('User ID'),
    loginusername: yup.string().required().min(2).label('Username'),
});

const { errors, setErrors, setValues, setFieldValue, defineField, handleSubmit } = useForm({
    validationSchema: schema,
});

const [id] = defineField('id');
const [spilitter] = defineField('spilitter');
const [usertype] = defineField('usertype');
const [userlatlong] = defineField('userlatlong');
const [tjnumber] = defineField('tjnumber');
const [lineby] = defineField('lineby');
const [userid] = defineField('userid');
const [loginusername] = defineField('loginusername');

const resetFormData = () => {
    setValues({
        spilitter: '',
        usertype: '',
        userlatlong: '',
        tjnumber: '',
        lineby: '',
        userid: '',
        loginusername: '',
    });
    
    listReload('marker')
}

const onSubmit = handleSubmit(async (values, { resetForm }) => {
    loading.value = true
    let result = ''
    try {
        if (values.id) {
            result = await RestApi.post('api/v1/sg-5/create_useer_map/', values)
        } else {
            result = await RestApi.post('api/v1/sg-5/create_useer_map/', values)
        }

        if (result.status == 201) {
            toast.success('User has been created!')
            resetForm();
            onToggle()
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

const onToggle = (formValue) => {

    //   setValues({
    //     email: 'test@example.com',
    //   });
    // setFieldValue('email', 'test@example.com');
    setFieldValue('id', '');
    setFieldValue('userlatlong', JSON.stringify(formValue));
    addUserModalRef.value.onToggle()
}

defineExpose({
    onToggle
})

onMounted(async () => {
    // console.log('form.value - initial', form.value)
});

</script>

<template>
    <ModalR ref="addUserModalRef">
        <template #header>
            <h6>{{ id ? 'Update' : 'Add New' }} User</h6>
        </template>
        <Form ref="myForm" @submit="onSubmit">
            <div class="flex-1 rounded-lg p-2 shadow-cyan-sm shadow-sm">


                <div class="mb-2 pb-4">
                    <label for="spilitter" class="input-label">Splitter</label>
                    <v-select v-model="spilitter" :options="dropdownList.splitters" :reduce="item => item.value"
                        id="spilitter" placeholder="Select Splitter" />
                    <p class="error-text">{{ errors.spilitter }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="usertype" class="input-label">User Type</label>
                    <v-select v-model="usertype" :options="dropdownList.userTypes" :reduce="item => item.value"
                        id="usertype" placeholder="Select User Type" />
                    <p class="error-text">{{ errors.usertype }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="userlatlong" class="input-label">User Latlong</label>
                    <input type="text" v-model="userlatlong" id="userlatlong" class="input-control"
                        placeholder="Enter userlatlong" />
                    <p class="error-text">{{ errors.userlatlong }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="tjnumber" class="input-label">Tj Number</label>
                    <v-select v-model="tjnumber" :options="dropdownList.tjNumberList" :reduce="item => item.value"
                        id="tjnumber" placeholder="Select Tj Number" />
                    <p class="error-text">{{ errors.tjnumber }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="lineby" class="input-label">Line By</label>
                    <v-select v-model="lineby" :options="dropdownList.userList" :reduce="item => item.value"
                        id="lineby" placeholder="Select Line By" />
                    <p class="error-text">{{ errors.lineby }}</p>
                </div>

                <!-- <div class="mb-2 pb-4">
                    <label for="lineby" class="input-label">Line By</label>
                    <input type="text" v-model="lineby" id="lineby" class="input-control" placeholder="Enter lineby" />
                    <p class="error-text">{{ errors.lineby }}</p>
                </div> -->

                <div class="mb-2 pb-4">
                    <label for="userid" class="input-label">User ID</label>
                    <input type="text" v-model="userid" id="userid" class="input-control"
                        placeholder="Enter user id" />
                    <p class="error-text">{{ errors.userid }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="loginusername" class="input-label">Username</label>
                    <input type="text" v-model="loginusername" id="loginusername" class="input-control"
                        placeholder="Enter username" />
                    <p class="error-text">{{ errors.loginusername }}</p>
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
