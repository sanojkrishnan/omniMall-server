module.exports = {
    PORT : process.env.PORT || 5000,

    MONGO_URL : process.env.MONGO_URL ||"mongodb://localhost:27017/project",

    CORS_STR : {
        ORIGIN : process.env.CORS_STR || "http://localhost:5000",
        CREDENTIAL : true,
        METHOD : ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'] 
    },
    NODE_ENV : process.env.NODE_ENV || "development"


}