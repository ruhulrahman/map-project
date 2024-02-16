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
    }
})

// const dropdownList = ref({
//   fibercores: [],
//   usertypes: [],
//   tjareas: [],
//   tjtypes: [],
//   splitters: [],
//   colors: [],
// })

let form = ref({
    id: '',
    userid: 20,
    spilitter: '',
    usertype: '',
    userlatlong: '',
    tjnumber: '',
    lineby: '',
    loginusername: 'Ruhul',
})

const initialErrors = {
    // 'email': 'This email is already taken',
};

const schema = yup.object({
    id: yup.string().label('Id'),
    userid: yup.string().label('User Id'),
    spilitter: yup.string().required().label('Splitter'),
    usertype: yup.string().required().label('User Type'),
    userlatlong: yup.string().required().label('User latlong'),
    tjnumber: yup.number().required().label('Tj Number'),
    lineby: yup.string().required().min(2).label('Line By'),
    loginusername: yup.string().required().min(2).label('Username'),
});

// const userLatLong = ref('')
const { errors, setErrors, setValues, setFieldValue, defineField, handleSubmit } = useForm({
    validationSchema: schema,
});

const [id] = defineField('id');
const [userid] = defineField('userid');
const [spilitter] = defineField('spilitter');
const [usertype] = defineField('usertype');
const [userlatlong] = defineField('userlatlong');
const [tjnumber] = defineField('tjnumber');
const [lineby] = defineField('lineby');
const [loginusername] = defineField('loginusername');

const onSubmit = handleSubmit( async(values, { resetForm }) => {
    console.log(JSON.stringify(values, null, 2));
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
    // if (value) {
    //     value.userlatlong = value.loginusername
    // }
    console.log('email - watchEffect')
})

const onToggle = (formValue) => {

    //   setValues({
    //     email: 'test@example.com',
    //   });
    // setFieldValue('email', 'test@example.com');
    setFieldValue('id', '');
    setFieldValue('userid', 20);
    setFieldValue('userlatlong', JSON.stringify(formValue));
    addUserModalRef.value.onToggle()
    // console.log('schema === modal open', schema)
}

defineExpose({
    onToggle
})

// const { handleSubmit, values } = useForm({
//     validationSchema: schema
// });


// resetForm({
//     values: {
//       email: '',
//     },
//   });


// const onSubmit = async (values, { resetForm }) => {
//     console.log('values =', values);
//     loading.value = true
//     let result = ''
//     try {
//         console.log('form.value =', form.value)
//         form.value.lineby = values.form.lineby
//         form.value.loginusername = values.form.loginusername
//         form.value.spilitter = values.form.spilitter
//         form.value.tjnumber = values.form.tjnumber
//         form.value.usertype = values.form.usertype

//         console.log('form.value = final', form.value)
//         if (form.value.id) {
//             result = await RestApi.post('api/v1/sg-5/create_useer_map/', form.value)
//         } else {
//             result = await RestApi.post('api/v1/sg-5/create_useer_map/', form.value)
//         }

//         if (result.status == 201) {
//             toast.success('User has been created!')
//             resetForm();
//             onToggle()
//             listReload('marker')
//         }

//     } catch (error) {
//         console.log('error', error)
//         myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
//     } finally {
//         loading.value = false
//     }
// }


const onSubmitData = async () => {
    loading.value = true
    let result = ''
    try {
        console.log('form.value', form.value)
        if (form.value.drawType == 'polyline') {
            if (form.value.id) {
                result = await RestApi.post('api/v1/sg-5/create_line_draw/', form.value)
            } else {
                result = await RestApi.post('api/v1/sg-5/create_line_draw/', form.value)
            }

            if (result.status == 201) {
                toast.success('Polyline has been created!')
                // onToggle()
                // resetFormData()
                // getMapLineConnection()
            }

        }

    } catch (error) {
        // validationErrors.value = mixin.cn(error, 'response.data', null)
        myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    console.log('form.value - initial', form.value)
});



</script>

<template>
    <ModalR ref="addUserModalRef">
        <template #header>
            <h6>{{ form.id ? 'Update' : 'Add New' }} User</h6>
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
                        <input type="text" v-model.number="tjnumber" id="tjnumber" class="input-control"
                            placeholder="Enter tj number" />
                    <p class="error-text">{{ errors.tjnumber }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="lineby" class="input-label">Line By</label>
                    <input type="text" v-model="lineby" id="lineby" class="input-control" placeholder="Enter lineby" />
                    <p class="error-text">{{ errors.lineby }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="loginusername" class="input-label">Username</label>
                    <input type="text" v-model="loginusername" id="loginusername" class="input-control"
                        placeholder="Enter username" />
                    <p class="error-text">{{ errors.loginusername }}</p>
                </div>

                <div class="text-right">
                    <button @click="handleReset" class="btn bg-red-600 hover:bg-red-500 text-gray-300 ml-3">Reset</button>
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
