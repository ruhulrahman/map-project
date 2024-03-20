import { Notyf } from 'notyf'
import Hashids from 'hashids'
import moment from 'moment'
// import { pinia } from '@/main';
// import { createPinia } from 'pinia';
// import { useAuthStore } from '@/stores/user';

// import { store } from '@/stores/user';
// import { useStore } from 'pinia';

// const store = useStore();
// const store = useAuthStore();

// const authStore = useAuthStore();

// console.log('authStore.user', authStore.user)

// const pinia = createPinia();
// pinia.use(useAuthStore);
// const store = pinia.store.value;
// const authStore = useAuthStore(store)

export const pagination = {
  currentPage: 1,
  totalRows: 0,
  perPage: 10,
  slOffset: 1,
  maxLinksDisplayed: 5,
}

export function cn(obj, input, if_false = '') {
  const elements = input.split('.')

  for (let i = 0; i < elements.length; i++) {
    if (!obj || !obj[elements[i]]) {
      return if_false
    }

    obj = obj[elements[i]]
  }

  if (obj) return obj
  return if_false
}


// const authStore = useAuthStore();

export default {
  loading: false,
  cn: function (obj, input, if_false = '') {
    const elements = input.split('.')

    for (let i = 0; i < elements.length; i++) {
      if (!obj || !obj[elements[i]]) {
        return if_false
      }

      obj = obj[elements[i]]
    }

    if (obj) return obj
    return if_false
  },
  authUser: function () {
    return JSON.parse(localStorage.getItem('authUser'))
  },
  auth_id: function () {
    this.cn(this.authUser, 'id')
  },
  auth_name: function () {
    this.cn(this.authUser, 'user_name')
  },
  noty: function (msg, type ='success', args = null, callback = null) {
    let options = {
      position: {
        x: 'right',
        y: 'top',
      }
    }

    if (args) {
      options = Object.assign(options, args)
    }

    const notyfInstance = new Notyf(options)

    if (type == 'success') {
      notyfInstance.success(msg)
    }

    if (type == 'error') {
      notyfInstance.error(msg)
    }

    return new Notyf(options)
  },
  err_msg: function (err) {
    if (err && err.data && err.data.msg) return err.data.msg
    else return 'Falied to process this request please try again later'
  },
  rand: function (min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  },
  hashids: function (value, encode = true) {
    const hashids = new Hashids('to-pass-url-argument', 32)
    if (encode) return hashids.encode(value)
    else return hashids.decode(value)
  },
  paginationData(data) {
      pagination.currentPage = data.current_page;
      pagination.totalRows = data.total;
      pagination.perPage = data.per_page;
      pagination.slOffset =
          data.per_page * pagination.currentPage - data.per_page + 1;
  },
  checkCurrentDateLessThenDate: function (dateValue) {
      const currentDate = this.dDate(new Date(), "YYYY-MM-DD");
      const anotherDate = this.dDate(dateValue, "YYYY-MM-DD");
      if (anotherDate >= currentDate) {
          return true;
      } else {
          return false;
      }
  },
  dDate: function (value, format = "D MMM YYYY") {
      return moment.utc(value).local().format(format);
  },
  dDateTime: function (value, format = "D MMM YYYY LT") {
      return moment.utc(value).local().format(format);
  },
  dTime: function (value, format = "LT") {
      return moment.utc(value).local().format(format);
  },
  dRealTime: function (value, format = "LT") {
      return moment(value).local().format(format);
  },
  rTime: function (value) {
      const today = new Date();
      const year = today.getFullYear();
      const mes = today.getMonth()+1;
      const dia = today.getDate();
      const fecha =year+"-"+mes+"-"+dia;
      return moment(fecha + ' ' + value).format('LT');
  },
  getBetweenHour: function (startTime, endTime) {
      const myEndTime = endTime ? new Date(endTime) : new Date();
      const myStartTime = new Date(startTime);
      const diffMs = myEndTime - myStartTime;
      const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
      const diffMins = Math.round(
          ((diffMs % 86400000) % 3600000) / 60000
      );
      if (diffHrs > 1) {
          return `${diffHrs} Hours ${diffMins} min`;
      } else {
          return `${diffHrs} Hour ${diffMins} min`;
      }
  },
  dMonth: function (value, format = "MMM YYYY") {
      return moment(value).format(format);
  },
  dYear: function (value, format = "YYYY") {
      return moment(value).format(format);
  },
  dNow: function (value) {
      // return moment(value).fromNow()
      return moment.utc(value).local().fromNow();
  },
  integer: function (value = 0) {
      const integerValue = value | 0;
      return Number(integerValue).toLocaleString();
  },
  float: function (value = 0.0) {
      const integerValue = parseFloat(value);
      return Number(integerValue).toLocaleString();
  },
  float2: function (value = 0.0) {
      const double = parseFloat(value).toFixed(2);
      return Number(double).toLocaleString();
  },
  limit_str: function (str, limit = 20, alt_str = "...") {
      return str.length > limit
          ? str.substring(0, limit - 3) + alt_str
          : str;
  },
  avatarText: function (value) {
      const matches = value.match(/\b(\w)/g)

      if (matches.length == 1) {
          return value.substring(0, 2).toLocaleUpperCase();
      } else {
          const data = matches.filter((item, index) => {
              if (index < 2) {
                  return Object.assign({}, item);
              }
          });
          return data.join("");
      }
  },
  has_permission: function (permit_code){

    console.log('permit_code', permit_code)

      // let permission_disable=this.$store.state.site.permission_disable;
      let permission_disable = false

      if(permission_disable){
          return true;
      }else if(permit_code){

          if(permit_code == "permitted"){
              return true;
          }else{

              // const authStore = useAuthStore();
              
              // const store = pinia.store;
              // const authStore = useAuthStore(store);
              // const permissions = authStore.permissions;
              const permissions = []
              // console.log('permissions', authStore)
              // const permissions = []

              if(permissions && permissions.length){

                  const userPermission = permissions.find(
                      (permission) => permission == permit_code
                  );

                  return userPermission == undefined ? false : true;

              } else {
                  return false;
              }
          }

      }else return false;
  },
}
