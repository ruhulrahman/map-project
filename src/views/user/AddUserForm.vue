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
const addUserModalRef = ref()

const listReload = (listType) => {
  emit("getListReload", listType);
}

const onToggle = (formValue) => {
    console.log('formValue', formValue)
    form.value.userlatlong = JSON.stringify(formValue)
    addUserModalRef.value.onToggle()
}
defineExpose({
    onToggle
})

defineProps({
  dropdownList: {
    fibercores: [],
    usertypes: [],
    tjareas: [],
    tjtypes: [],
    splitters: [],
    colors: [],
    userType: [],
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
    tjnumber: '',
    lineby: '',
    userlatlong: '',
    usertype: '',
    spilitter: '',
    loginusername: '',
})

const schema = yup.object({
    form: yup.object({
        userlatlong: yup.string().required().label('User latlong'),
        spilitter: yup.string().required().label('Splitter'),
        usertype: yup.string().required().label('User Type'),
        tjnumber: yup.string().required().label('Tj Number'),
        lineby: yup.string().required().min(2).label('Line By'),
        loginusername: yup.string().required().min(2).label('Username'),
    }),
});

const initialErrors = {
    // 'form.email': 'This email is already taken',
};

const { handleSubmit, defineField } = useForm({
  initialValues: form.value,
});

const onSubmit = handleSubmit(values => {
  console.log(JSON.stringify(values, null, 2));
});

// const onSubmit = handleSubmit((values, { resetForm }) => {
//     console.log('values ===', values);
//     loading.value = true
//     let result = ''
//     try {
//         console.log('form.value', form.value)
//         form.value.lineby = values.form.lineby
//         form.value.loginusername = values.form.loginusername
//         form.value.spilitter = values.form.spilitter
//         form.value.tjnumber = values.form.tjnumber
//         form.value.usertype = values.form.usertype

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
//         myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
//     } finally {
//         loading.value = false
//     }
// })


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

});



</script>

<template>
    <ModalR ref="addUserModalRef">
        <template #header>
            <h6>{{ form.id ? 'Update' : 'Add New' }} User</h6>
        </template>
        <Form ref="myForm" v-slot="{ errors, handleReset }" :validation-schema="schema" @submit="onSubmit"
            @invalid-submit="onInvalidSubmit" :initial-errors="initialErrors">
            <div class="flex-1 rounded-lg p-2 shadow-cyan-sm shadow-sm">

                <div class="mb-2 pb-4">
                    <label for="spilitter" class="input-label">Splitter</label>
                    <Field name="form.spilitter" v-slot="{ field }">
                        <v-select v-bind="field" :options="dropdownList.splitters" :reduce="item => item.value"
                            id="spilitter" placeholder="Select Splitter" />
                    </Field>
                    <ErrorMessage class="error-text" name="form.spilitter" />
                </div>

                <div class="mb-2 pb-4">
                    <label for="usertype" class="input-label">User Type</label>
                    <Field name="form.usertype" v-slot="{ field }">
                        <v-select v-bind="field" :options="dropdownList.splitters" :reduce="item => item.value"
                            id="usertype" placeholder="Select User Type" />
                    </Field>
                    <ErrorMessage class="error-text" name="form.usertype" />
                </div>

                <div class="mb-2 pb-4">
                    <label for="userlatlong" class="input-label">User Latlong</label>
                    <Field name="form.userlatlong" v-slot="{ field }">
                        <input type="text" v-bind="field" id="userlatlong" class="input-control"
                            placeholder="Enter userlatlong" />
                    </Field>
                    <p class="error-text">{{ errors['form.userlatlong'] }}</p>
                </div>

                <div class="mb-2 pb-4">
                    <label for="tjnumber" class="input-label">Tj Number</label>
                    <Field name="form.tjnumber" v-slot="{ field }">
                        <input type="text" v-bind="field" id="tjnumber" class="input-control"
                            placeholder="Enter tj number" />
                    </Field>
                    <p class="error-text">{{ errors['form.tjnumber'] }}</p>
                </div>
                
                <div class="mb-2 pb-4">
                    <label for="lineby" class="input-label">Line By</label>
                    <Field type="text" name="form.lineby" id="lineby" class="input-control"
                        placeholder="Enter lineby" />
                    <ErrorMessage class="error-text" name="form.lineby" />
                </div>

                <div class="mb-2 pb-4">
                    <label for="loginusername" class="input-label">Username</label>
                    <Field type="text" name="form.loginusername" id="loginusername" class="input-control"
                        placeholder="Enter username" />
                    <ErrorMessage class="error-text" name="form.loginusername" />
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

<style scoped>@import '@/style.css';</style>
