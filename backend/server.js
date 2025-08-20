import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js"
import chatRoutes from "./routes/chatRoutes.js";
import tutRoutes from "./routes/tutRoutes.js";
import mongoose from "mongoose";


dotenv.config();

const app = express();




app.use(express.json());


app.use(cors({
    origin: [
      "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));


app.use("/api", chatRoutes);
app.use("/api", tutRoutes);

// Browser-friendly endpoints for testing
app.get("/", (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Dhansathi Backend</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                    .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    h1 { color: #4b0082; text-align: center; }
                    .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #4b0082; }
                    .method { background: #4b0082; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px; }
                    .url { font-family: monospace; color: #0066cc; }
                    .description { color: #666; margin-top: 5px; }
                    .status { background: #28a745; color: white; padding: 5px 10px; border-radius: 3px; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🚀 Dhansathi Backend Server</h1>
                    <div class="status">✅ Server is running successfully!</div>
                    
                    <h2>📡 Available Endpoints:</h2>
                    
                    <div class="endpoint">
                        <span class="method">GET</span>
                        <span class="url">/</span>
                        <div class="description">This page - Backend status and API documentation</div>
                    </div>
                    
                    <div class="endpoint">
                        <span class="method">GET</span>
                        <span class="url">/api/tutorials</span>
                        <div class="description">Get all tutorials</div>
                    </div>
                    
                    <div class="endpoint">
                        <span class="method">POST</span>
                        <span class="url">/api/tutorials</span>
                        <div class="description">Create a new tutorial</div>
                    </div>
                    
                    <div class="endpoint">
                        <span class="method">POST</span>
                        <span class="url">/api/chat</span>
                        <div class="description">Chat with Dhansathi AI</div>
                    </div>
                    
                    <h2>🔧 Server Information:</h2>
                    <p><strong>Port:</strong> ${process.env.PORT || 5000}</strong></p>
                    <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</strong></p>
                    <p><strong>Time:</strong> ${new Date().toLocaleString()}</strong></p>
                    
                    <h2>🧪 Test Links:</h2>
                    <p><a href="/api/tutorials" target="_blank">View Tutorials</a></p>
                    <p><a href="/api/chat/test" target="_blank">Test Chat API</a></p>
                </div>
            </body>
        </html>
    `);
});

app.get("/status", (req, res) => {
    res.json({
        status: "running",
        timestamp: new Date().toISOString(),
        port: process.env.PORT || 5000,
        environment: process.env.NODE_ENV || 'development',
        endpoints: [
            { method: "GET", path: "/", description: "Backend status page" },
            { method: "GET", path: "/status", description: "API status" },
            { method: "GET", path: "/api/tutorials", description: "Get tutorials" },
            { method: "POST", path: "/api/tutorials", description: "Create tutorial" },
            { method: "POST", path: "/api/chat", description: "Chat with AI" }
        ]
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running at port " + PORT);
});

