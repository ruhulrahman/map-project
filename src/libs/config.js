import axios from 'axios'
// import Vue from 'vue'
// import CxltToastr from 'cxlt-vue2-toastr'
// import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'

export const baseURL = 'http://mapproject.nvs.la/'

// var toastrConfigs = {
//   position: 'top right',
//   showDuration: 2000
// }

// Vue.use(CxltToastr, toastrConfigs)

// Handling server error
// Handling server error
const errorHandler = (error) => {
  if (error.response.status === 401) {
    // Store.dispatch('Auth/updateAuthUser', null)
    localStorage.removeItem('accessUsername')
    localStorage.removeItem('access_token')
    // Store.commit('mutateCommonProperties', {
    //   hasDropdownLoaded: false
    // })
    window.vm.$toast.error({
      title: 'Error',
      message: 'Unauthorized access.'
    })
    window.vm.$router.push('/login')
  } else if (error.response.status === 500) {
    window.vm.$toast.error({
      title: 'Error',
      message: 'Server Error'
    })
  } else {
    // window.vm.$toast.error({
    //   title: 'Error',
    //   message: 'Server Error'
    // })
    // window.vm.$toast.error({
    //   title: 'Validation Error',
    //   message: error.response.data.errors
    // })
    // console.log('error.response', error.response.data.message)
    // window.vm.$toast.error({
    //   title: 'Error',
    //   message: 'Operation failed due to an unknown error.'
    // })
  }
  return error
}
export default {
  async execute (baseUrl, method, uri, data, params = {}) {
    const accessToken = localStorage.getItem('access_token')

    const client = axios.create({
      baseURL: baseUrl,
      json: true
    })

    client.interceptors.response.use(response => response, error => errorHandler(error))

    return client({
      method,
      url: uri,
      data,
      params: params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        accessMenuName: window.location.href,
        'Content-Type': 'multipart/form-data'
      }
      // headers: {
      //   authorization: accessToken ? `Bearer ${accessToken}` : '',
      //   'user-detail': userDetail ? `${userDetail}` : '',
      //   'access-menu-name': window.location.href
      // }
    }).then(req => {
      // console.log('req', req)
      if (req.status === 200 || req.status === 201) {
        return req.data
      } else {
        return req.response.data
      }
    })
  },
  getData (baseUrl, uri, params = {}) {
    // const filters = setFilters()
    return this.execute(baseUrl, 'get', uri, {}, params)
  },
  postData (baseUrl, uri, data) {
    return this.execute(baseUrl, 'post', uri, data)
  },
  putData (baseUrl, uri, data) {
    return this.execute(baseUrl, 'put', uri, data)
  },
  deleteData (baseUrl, uri) {
    return this.execute(baseUrl, 'delete', uri)
  }
}
