module.exports = {
    apps: [
        {
            name: "API-CARGOSNAP-PORTINSPECT",
            script: "./src/server.ts",
            instances: 1,
            interpreter: "ts-node", 
            env: {
                NODE_ENV: "development",
            },
            watch: true,
            ignore_watch: ["node_modules", "logs"],
            error_file: "logs/error.log",
            out_file: "logs/out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss"
        }
    ]
}
