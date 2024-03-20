import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('user', () => {

  const user = ref({})
  const user_role = ref({})
  const permissions = ref([])
  const mapIcons = ref([])

  function setAuthUser (value) {
    console.log('hit store', value)
    user.value = value
  }

  function setUserRole (value) {
    user_role.value = value
  }

  function setUserPermission (permissionValues) {
    permissions.value = permissionValues
  }

  function setIcons (iconsValue) {
    mapIcons.value = iconsValue
    console.log('iconsValue', iconsValue)
    console.log('mapIcons.value', mapIcons.value)
  }

  function has_permission (permit_code){

    console.log('permit_code', permit_code)
    console.log('permissions.value', permissions.value)

      // let permission_disable=this.$store.state.site.permission_disable;
      let permission_disable = false

      if(permission_disable){
          return true;
      }else if(permit_code){

          if(permit_code == "permitted"){
              return true;
          }else{

              if(permissions.value && permissions.value.length){

                  const userPermission = permissions.value.find(
                      (permission) => permission == permit_code
                  );

                  return userPermission == undefined ? false : true;

              } else {
                  return false;
              }
          }

      } else return false;
  }

  return { user, user_role, permissions, setAuthUser, setUserRole, setUserPermission, has_permission, setIcons }

})
