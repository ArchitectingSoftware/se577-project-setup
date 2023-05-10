import  {MockData}  from "./db";
import fastify, {RequestGenericInterface} from "fastify";
import fastifyHttpProxy from "@fastify/http-proxy";
import dotenv from 'dotenv';

import { GetGHProxyOptions } from "./proxy";

import cors from '@fastify/cors';

dotenv.config();

const server = fastify()

let proxyOpts = GetGHProxyOptions(process.env.GH_ACCESS_TOKEN)
server.register(fastifyHttpProxy, proxyOpts)

//setup CORS - this will be necessary for API requests from a VUE or any SPA app 
server.register(cors, {
    origin: "*"
})

server.get('/students', async (request, reply) => {
  return MockData;
})

//If you want to pass a parameter like /student/123 setup an interface
//for the parameter
interface requestId extends RequestGenericInterface {
    Params: {
      id: string
    }
}
//Now in the .get make sure you stereotype the request <requestId> and
//then you can get the parameter like in the second line with const
//thus /student/123 will pull 123 out of the constant
server.get<requestId>('/students/:id', async (request, reply) => {
    const { id } = request.params;
    const student = MockData.find(element => element.studentId == id);
    if (student) {
        return student;
    } else {
        let errObj = {error: `The student with student id = ${id} was not found`};
        reply.code(404).send(errObj);
        return
    }
  })


//If you want to pass a parameter like /student/123 setup an interface
//for the parameter
interface requestQry extends RequestGenericInterface {
    Querystring: {
      id: string,
      course: string
    }
}
//Now in the .get make sure you stereotype the request <requestId> and
//then you can get the parameter like in the second line with const
//thus /student/123 will pull 123 out of the constant
server.get<requestQry>('/search', async (request, reply) => {
    const { id,course } = request.query;
    
    if (id){
        const student = MockData.find(element => element.studentId == id);
        if (student) {
            return [student];
        } else {
            let errObj = {error: `The student with student id = ${id} was not found`};
            reply.code(404).send(errObj);
            return
        }
    }else if (course){
        const students = MockData.filter(element => element.courseId == course);
        if (students.length > 0) {
            return students;
        } else {
            let errObj = {error: `The no students were found with course id = ${course} was not found`};
            reply.code(404).send(errObj);
            return
        }
    }else {
        let errObj = {error: "The /search API requires an id or course query parameter"};
        reply.code(400).send(errObj);
        return
    }
  })

server.listen({ port: 9500 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})