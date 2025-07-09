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
                identifier: "Dafaraihan123",
                password: "Dafaraihan12",
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
            UpdateProfileRequest: {
                fullName: "",
                profilePicture: "",
            },
            UpdatePasswordRequest: {
                oldPassword: "",
                password: "",
                confirmPassword: "",
            },
            CreateCategoryRequest: {
                name: "",
                description: "",
                icon: "",
            },
            CreateEventRequest: {
        name: "",
        banner: "fileUrl",
        category: "category ObjectID",
        description: "",
        startDate: "yyyy-mm-dd hh:mm:ss",
        endDate: "yyyy-mm-dd hh:mm:ss",
        location: {
            region: "region id",
            coordinates: [0, 0],
            address: "",
  },
    isOnline: false,
    isFeatured: false,
    isPublish: false,
},
            RemoveMediaRequest: {
                fileUrl: "",
            },
            CreateBannerRequest: {
    "title": "Banner 2",
    "image": "https://res.cloudinary.com/djutyqrbj/image/upload/v1751882386/pzv9d69l5ykzdyagmgro.png",
    "isShow": false
},
            CreateTicketRequest: {
            "price": 1000,
            "name": "Ticket Reguler",
            "events": "6868d3715c2e2b6cb92fe25e",
            "description": "Ticket Reguler - DESC",
            "quantity": 100
        },
             CreateOrderRequest: {
        events: "event object id",
        ticket: "ticket object id",
        quantity: 1,
      },
        },
    },
};

const outputFile = "./swagger_output.json";

const endpointFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0"})(outputFile, endpointFiles, doc);