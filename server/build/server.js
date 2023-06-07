"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const fastify_1 = __importDefault(require("fastify"));
const http_proxy_1 = __importDefault(require("@fastify/http-proxy"));
const dotenv_1 = __importDefault(require("dotenv"));
const proxy_1 = require("./proxy");
const cors_1 = __importDefault(require("@fastify/cors"));
dotenv_1.default.config();
const server = (0, fastify_1.default)();
let proxyOptsSecure = (0, proxy_1.GetGHProxySecureOptions)(process.env.GH_ACCESS_TOKEN);
server.register(http_proxy_1.default, proxyOptsSecure);
let proxyOpts = (0, proxy_1.GetGHProxyOptions)();
server.register(http_proxy_1.default, proxyOpts);
//setup CORS - this will be necessary for API requests from a VUE or any SPA app 
server.register(cors_1.default, {
    origin: "*"
});
server.get('/students', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.MockData;
}));
//Now in the .get make sure you stereotype the request <requestId> and
//then you can get the parameter like in the second line with const
//thus /student/123 will pull 123 out of the constant
server.get('/students/:id', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const student = db_1.MockData.find(element => element.studentId == id);
    if (student) {
        return student;
    }
    else {
        let errObj = { error: `The student with student id = ${id} was not found` };
        reply.code(404).send(errObj);
        return;
    }
}));
//Now in the .get make sure you stereotype the request <requestId> and
//then you can get the parameter like in the second line with const
//thus /student/123 will pull 123 out of the constant
server.get('/search', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, course } = request.query;
    if (id) {
        const student = db_1.MockData.find(element => element.studentId == id);
        if (student) {
            return [student];
        }
        else {
            let errObj = { error: `The student with student id = ${id} was not found` };
            reply.code(404).send(errObj);
            return;
        }
    }
    else if (course) {
        const students = db_1.MockData.filter(element => element.courseId == course);
        if (students.length > 0) {
            return students;
        }
        else {
            let errObj = { error: `The no students were found with course id = ${course} was not found` };
            reply.code(404).send(errObj);
            return;
        }
    }
    else {
        let errObj = { error: "The /search API requires an id or course query parameter" };
        reply.code(400).send(errObj);
        return;
    }
}));
server.listen({ port: 9500, host: "::" }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
