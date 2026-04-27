module.exports = {
    PORT : process.env.PORT || 5000,

    MONGO_URL : process.env.MONGO_URL ||"mongodb://localhost:27017/project",

    CORS : {
        ORIGIN : process.env.CORS_STR || "http://localhost:5000",
        CREDENTIAL : true,
        METHOD : ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'] 
    },
    NODE_ENV : process.env.NODE_ENV || "development",

    RATE_LIMIT: {  //to limit api calling 
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 100,
    AUTH_MAX_REQUESTS: 5
  }


}