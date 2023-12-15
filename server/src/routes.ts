import express from "express";
import userController from "./controllers/UserController";

const routes = express.Router();

routes.post("/user", userController.create);
routes.get("/user", userController.get);
routes.get("/user/:age", userController.getById);  // rota para filtrar usuários por idade
routes.get("/average", userController.averageAge); // rota para filtrar a média de idade dos usuários
routes.get("/user/:age", userController.OlderUsers); // Rota para filtrar o número de usuários idosos
routes.get("/user/:firstName", userController.SameNamePeople); // Rota para filtrar o número de usuários idosos
routes.delete("/user/:id", userController.delete);
routes.patch("/user/:id", userController.update);

export default routes;