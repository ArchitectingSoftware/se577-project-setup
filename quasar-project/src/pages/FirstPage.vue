<template>
  <q-page class="row">
    <p>This is the first page</p>

    <div v-if="studentData.length > 0">
    <table>
      <tr>
        <th>Student ID</th>
        <th>Student Name</th>
        <th>Course</th>
      </tr>
      <tr v-for = "student in studentData" :key="student.studentId">
        <td>{{ student.studentId }}</td>
        <td>{{ student.studentName }}</td>
        <td>{{ student.courseId }}</td>
      </tr>
    </table>
  </div>
  <p>The number of results is {{ studentData.length }}</p>
  </q-page>
</template>

<script lang="ts">
export default {
  name: 'FirstPage',
};
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type {StudentApiInterface} from './ApiInterfaces';
import axios from 'axios';

  //Most code goes here
  const studentData = ref<StudentApiInterface[]>([])

  onMounted(async () => {
    console.log("Page 1 mounted")

    //this is where to go and get the student data
    let allStudentsURI = 'http://localhost:9500/students'

    //Use axios to load the student data - readup on await to make
    //async calls easier
    let studentAPI = await axios.get<StudentApiInterface[]>(allStudentsURI)

    //if OK, set the studentData variable, so that we can render in the ui
    if(studentAPI.status == 200){
      studentData.value = studentAPI.data
    }
  })
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
