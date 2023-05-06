<template>
        <p> This is the <span class="emphasis-text">SECOND</span> page</p>

        <p>
          <!-- NOTE the keypress and keyup events to mark the field dirty to manage the UI-->
          Student ID: <input type="text" 
                              v-model="studentID" 
                              @keypress = "queryChanged"
                              @keyup.delete = "queryChanged"/>
        </p>
        <p>
          <button type="button" 
            @click="fetchStudentInfo()"
            :disabled = "shouldDisable"
            >
            Get Student Info</button>
        </p>

        <div v-if="!apiErrorInfo.isError && !queryIsDirty">
          <p class="happy-text">Found Student with ID: {{ studentID }}</p>
          <p>
            <!-- note the ?. notation, given studentData may be undefined if we dont find one -->
            Student ID: {{ studentData?.studentId }} <br/>
            Student Name: {{ studentData?.studentName }} <br/>
            Course ID: {{ studentData?.courseId}} <br/>
          </p>
        </div>

        <p class="error-text" v-if="apiErrorInfo.isError  && !queryIsDirty"> Unable to locate student by ID, code = {{ apiErrorInfo.errorCode }}</p>
  </template>
    
    <script lang="ts">
    export default {
      name: 'SecondPage',
    };
    </script>
    
    <script setup lang="ts">
    import {ref, computed } from 'vue';
    import type {StudentApiInterface, ApiErrorInterface} from './ApiInterfaces';
    import axios, {AxiosError} from 'axios';
//import { emitKeypressEvents } from 'readline';

    const studentID = ref('')
    let studentData = ref<StudentApiInterface | undefined>()
    const apiErrorInfo = ref<ApiErrorInterface>({isError: false, errorCode: 0, errorMessage:""})
    const queryIsDirty = ref(true)

    const fetchStudentInfo = async () =>{
      queryIsDirty.value = false
      console.log("Fetching By Student ID: ", studentID.value)

      //this is where to go and get the student data, notice the string
      //interpolation to get the student ID value
      let aStudentURI = `http://localhost:9500/students/${studentID.value}`

      //Use axios to load the student data - readup on await to make
      //async calls easier also look at try/catch for error handling

      try{
        let studentAPI = await axios.get<StudentApiInterface>(aStudentURI)
        //if OK, set the studentData variable, so that we can render in the ui
        if(studentAPI.status == 200){

          apiErrorInfo.value.isError = false;
          apiErrorInfo.value.errorCode = studentAPI.status;
          apiErrorInfo.value.errorMessage = studentAPI.statusText;
          studentData.value = studentAPI.data
          console.log(studentData.value)
        } else {
          console.log("bad student value")
        }
      } catch (err) {
        let e = err as AxiosError //convert to axios error type
        if (e.response) {
          apiErrorInfo.value.isError = true;
          apiErrorInfo.value.errorCode = e.response.status;
          apiErrorInfo.value.errorMessage = e.request.statusText;
          console.log("Got Error Code ", e.response.status)
        } else {
          // Anything else
        }
      } 
    }

    //This is a computed property that will change when the studentID property
    //changes it is used to enable and disable the button
    const shouldDisable = computed(() => {
        return studentID.value.length > 0 ? false : true
    })

    const queryChanged = (e: Event) => {
      queryIsDirty.value = true;
      studentData.value = undefined;
    }

    //Most code goes here
    </script>
    
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.emphasis-text{
    color: green;
}

.error-text{
    color:red;
}

.happy-text{
    color:green;
}

</style>