module.exports = {
    db: {
        local: {
            host: 'localhost',
            port: 27017,
            dbName: 'fondoo'
        },
        remote: {
            host: 'ds047592.mongolab.com:47592',
            port: 27017,
            dbName: 'sportscafe',
            options: {
                //TODO change credentials
                username: 'mithunSC',
                password: 'Congo'
            }
        }
    },
    security: {
        encryptions: {
            encrypt_type: 'sha256',
            encrypt_key: '4b 8?((~FKnpD))>8kb!B |#-uXIO24G3rc:&MG+FR{x;r#Uq4k{Ef@F4E9^-qS!', //change hash key
        },
        api: {
            appId: 'sportscafe', 
            appSecret: 'sportsTMZaFam59d@F9c#V1G9UEL17)Odzcafe', 
        },
        tokenLife: 3600
    },
    mailer: {
        auth: {
         user: 'test@example.com',
         pass: 'secret',
       },
       defaultFromAddress: 'First Last <test@examle.com>'
    },
    cloudinary: {
        //setttings for the multer options
        cloud_name: 'cloud-name', 
        api_key: 'api-key-here', 
        api_secret: 'api-secret-here' 
    },
    gcm: {
        apiKey: "GCM-Api-key-here"
    },

    apn: {
        connection: {
            gateway: "gateway.push.apple.com",
            cert: "./cert/pushcert.pem",
            key: "./cert/pushcert.pem"
        },
        feedback: {
            address: "feedback.push.apple.com",
            cert: "./cert/pushcert.pem",
            key: "./cert/pushcert.pem",
            interval: 43200,
            batchFeedback: true
        }
    },
    debug         : false,
    apiVersion    : 'v1.0'
}