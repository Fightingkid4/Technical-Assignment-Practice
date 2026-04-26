import express from "express";

export const createApp = () => {
  const app = express();

  app.use(express.json());
app.use("/test", (req, res) => {
  res.json({ message: "Hello, World!" });
});
  return app;
};