<template>
    <p> This is the third page</p>

    <p>Search using the following Criteria:</p>
    <input type="radio" id="courseId" name="students" value="CourseID" v-model = "queryOption">
    <label for="courseId">Course ID</label><br>
    <input type="radio" id="studentID" name="students" value="StuddentID" v-model = "queryOption">
    <label for="css">Student ID</label><br>

    <p>
          <!-- NOTE the keypress and keyup events to mark the field dirty to manage the UI-->
      QueryVal: <input type="text" 
                      v-model="queryValue" 
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

    <div v-if="studentData.length > 0 && !queryIsDirty">
      <table>
        <tr>
          <th>Student ID</th>
          <th>Student Name</th>
          <th>Course</th>
        </tr>
        <tr v-for = "(student, rowNum) in studentData">
          <td>{{ student.studentId }}</td>
          <td>{{ student.studentName }}</td>
          <td>{{ student.courseId }}</td>
        </tr>
      </table>
    </div>

    <p class="error-text" v-if="apiErrorInfo.isError  && !queryIsDirty"> Unable to locate student by ID, code = {{ apiErrorInfo.errorCode }}</p>


</template>
    
    <script lang="ts">
    export default {
      name: 'ThirdPage',
    };
    </script>
    
    <script setup lang="ts">
    import { ref, computed, watch} from 'vue';
    import type {StudentApiInterface, ApiErrorInterface} from './ApiInterfaces';
    import axios, {AxiosError} from 'axios';
    
    const queryOption = ref("CourseID");  //default option is CourseID
    const queryValue = ref("");
    const queryIsDirty = ref(false);
    const apiErrorInfo = ref<ApiErrorInterface>({isError: false, errorCode: 0, errorMessage:""})

    let studentData = ref<StudentApiInterface[]>([])

    const queryChanged = (e: Event) => {
      queryIsDirty.value = true;
      studentData.value = [];
    }

    //When the radio button state changes we mark as dirty so we can manage the UI
    //The main purpose of this is to show you watch functionality in that we can 
    //watch for state changes in vue
    const radioButtonChanged = watch(queryOption, () => {
      queryIsDirty.value = true;
      studentData.value = [];
    })

    //Not really using this but wanted to demo you can get the old and updated values
    //as well in case that mattered to you
    const radioButtonChanged_NotUsed = watch(queryOption, (old:string, updated:string) => {
        console.log(`RADIO BUTTON CHANGED ${old} ${updated}`)
    })

    //This is a computed property that will change when the studentID property
    //changes it is used to enable and disable the button
    const shouldDisable = computed(() => {
        return queryValue.value.length > 0 ? false : true
    })

    let queryByCourseIdPrefix = `http://localhost:9500/search?course=`
    let queryByStudentIdPrefix = `http://localhost:9500/search?id=`

    const fetchStudentInfo = async () =>{
      queryIsDirty.value = false

      const apiPrefix = (queryOption.value == "CourseID") ? queryByCourseIdPrefix : queryByStudentIdPrefix
      const apiURL = apiPrefix + queryValue.value
      console.log(apiURL)
      try{
        let studentAPI = await axios.get<StudentApiInterface[]>(apiURL)
       
        if(studentAPI.status == 200){
          console.log(studentAPI)
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
    </script>
    
    <!-- Add "scoped" attribute to limit CSS to this component only -->
    <style scoped>
    .error-text{
      color:red;
    }

    .happy-text{
      color:green;
    }
  
  </style>