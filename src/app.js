const express = require("express")
const cookieParser = require("cookie-parser")
const client = require("prom-client")

const app = express()
const register = new client.Registry()

client.collectDefaultMetrics({ register })

const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_ms",
    help: "Duration of HTTP requests in milliseconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [10, 50, 100, 200, 500, 1000, 2000]
})

const httpRequestsTotal = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"]
})

register.registerMetric(httpRequestDuration)
register.registerMetric(httpRequestsTotal)

app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
    const startedAt = Date.now()

    res.on("finish", () => {
        const duration = Date.now() - startedAt
        const route = req.route?.path || req.path

        httpRequestDuration.labels(req.method, route, String(res.statusCode)).observe(duration)
        httpRequestsTotal.labels(req.method, route, String(res.statusCode)).inc()

        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`)
    })

    next()
})

app.get("/healthz", (req, res) => {
    res.status(200).json({ status: "ok" })
})

app.get("/readyz", (req, res) => {
    res.status(200).json({ status: "ready" })
})

app.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType)
    res.end(await register.metrics())
})

// all routes 
const authRouter = require("./routes/auth.routes")
app.use("/api/auth",authRouter)

const accountRouter = require("./routes/account.routes")
app.use("/api/accounts",accountRouter)

const transactionRoutes = require("./routes/transaction.routes")
app.use("/api/transactions",transactionRoutes)

app.get("/", (req, res) => {
    res.send("Ledger Service is up and running")
})

module.exports = app