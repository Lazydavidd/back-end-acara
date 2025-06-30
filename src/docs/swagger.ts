import swaggerAutogen from "swagger-autogen";


const doc = {
    openapi: "3.0.0",
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API ACARA",
        description: "dokumentasi api acara",
    },
    servers :[{
        url: "http://localhost:3333/api",
        description: "local server",
    },
    {
        url: "https://back-end-acara-eta-sandy.vercel.app/api",
        description: "deploy server",
    },
],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },

        schemas: {
            LoginRequest: {
                identifier: "dafaraihan",
                password: "dafaraihan12",
            },
            RegisterRequest: {
            fullName: "dama akbar",
            username: "dama2025",
            email: "dama2025@yopmail.com",
            password: "1234512345",
            confirmPassword: "1234512345",
            },
            ActivationRequest:{
                code: "abcdef"
            },
            CreateCategoryRequest: {
                name: "",
                description: "",
                icon: "",
            },
            CreateEventRequest: {
  "name": "",
  "banner": "fileUrl",
  "category": "category ObjectID",
  "description": "",
  "startDate": "yyyy-mm-dd hh:mm:ss",
  "endDate": "yyyy-mm-dd hh:mm:ss",
  "location": {
    "region": "region id",
    "coordinates": [0, 0]
  },
  "isOnline": false,
  "isFeatured": false,
},
            RemoveMediaRequest: {
                fileUrl: "",
            },
        },
    },
};

const outputFile = "./swagger_output.json";

const endpointFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0"})(outputFile, endpointFiles, doc);