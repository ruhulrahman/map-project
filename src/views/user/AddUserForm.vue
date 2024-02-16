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



function updateValues() {
  // set a single field value
  // setFieldValue('email', 'test@example.com');

  // set multiple fields values
  setValues({
    email: 'test@example.com',
  });
}


// const schema = yup.object({
//     id: yup.string().default('').label('Id'),
//     userid: yup.string().default(20).label('User Id'),
//     spilitter: yup.string().required().label('Splitter'),
//     usertype: yup.string().required().label('User Type'),
//     userlatlong: yup.string().required().default('nothing').label('User latlong'),
//     tjnumber: yup.string().required().label('Tj Number'),
//     lineby: yup.string().required().min(2).label('Line By'),
//     loginusername: yup.string().required().min(2).default('Ruhul').label('Username'),
// });

const schema = yup.object({
    email: yup.string().min(5).label('Email'),
});

// const userLatLong = ref('')
const { errors, setErrors, setValues, setFieldValue, defineField, handleSubmit } = useForm({
    validationSchema: schema,
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit((values) => {
    console.log(JSON.stringify(values, null, 2));
});
// watcher
watchEffect(() => {
    // if (value) {
    //     value.userlatlong = value.loginusername
    // }
    console.log('email - watchEffect', email)
})

const onToggle = (formValue) => {
    
//   setValues({
//     email: 'test@example.com',
//   });
  setFieldValue('email', 'test@example.com');
    // console.log('formValue', formValue)
    // schema.userlatlong = JSON.stringify(formValue)
    // userLatLong.value = JSON.stringify(formValue)
    // setFieldValue('userLatLong', JSON.stringify(formValue)); 
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

                <!-- <div class="mb-2 pb-4">
                    <label for="spilitter" class="input-label">Splitter</label>
                    <Field name="spilitter" v-slot="{ field }">
                        <v-select v-bind="field" :options="dropdownList.splitters" :reduce="item => item.value"
                            id="spilitter" placeholder="Select Splitter" />
                    </Field>
                    <ErrorMessage class="error-text" name="spilitter" />
                </div> -->
                <!-- <div class="mb-2 pb-4">
                    <label for="spilitter" class="input-label">Splitter</label>
                        <v-select v-model="spilitter" :options="dropdownList.splitters" :reduce="item => item.value"
                            id="spilitter" placeholder="Select Splitter" />

                    <p class="error-text">{{ errors.spilitter }}</p>
                    <ErrorMessage class="error-text" name="spilitter" />
                </div> -->

                <!-- <div class="mb-2 pb-4">
                    <label for="usertype" class="input-label">User Type</label>
                        <v-select v-model="usertype" :options="dropdownList.userTypes" :reduce="item => item.value"
                            id="usertype" placeholder="Select User Type" />
                    <ErrorMessage class="error-text" name="usertype" />
                </div>

                <div class="mb-2 pb-4">
                    <label for="userlatlong" class="input-label">User Latlong</label>
                        <input type="text" v-model="userlatlong" id="userlatlong" class="input-control"
                            placeholder="Enter userlatlong" />
                    <ErrorMessage class="error-text" name="userlatlong" />
                </div>

                <div class="mb-2 pb-4">
                    <label for="tjnumber" class="input-label">Tj Number</label>
                        <input type="number" min="0" v-model="tjnumber" id="tjnumber" class="input-control"
                            placeholder="Enter tj number" />
                    <ErrorMessage class="error-text" name="tjnumber" />
                </div>

                <div class="mb-2 pb-4">
                    <label for="lineby" class="input-label">Line By</label>
                    <input type="text" v-model="lineby" id="lineby" class="input-control" placeholder="Enter lineby" />
                    <ErrorMessage class="error-text" name="lineby" />
                </div>

                <div class="mb-2 pb-4">
                    <label for="loginusername" class="input-label">Username</label>
                    <input type="text" v-model="loginusername" id="loginusername" class="input-control"
                        placeholder="Enter username" />
                    <ErrorMessage class="error-text" name="loginusername" />
                </div> -->

                <div class="mb-2 pb-4">
                    <label for="email" class="input-label">Email</label>
                    <input type="email" v-model="email" id="email" class="input-control"
                        placeholder="Enter Email"  />
                    <p class="error-text">{{ errors.email }}</p>
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
