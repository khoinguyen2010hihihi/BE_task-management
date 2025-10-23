import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import router from "./routes/app.route";
import { setupSwagger } from "./api-docs/openAPIRouter";

const app = express();
app.use(bodyParser.json());

setupSwagger(app);

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");

    app.use("/", router);

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
      console.log("Swagger docs at http://localhost:3000/api-docs");
    });
  })
  .catch((err) => console.error("DB connection error:", err));
