import { OpenAPIHono } from "@hono/zod-openapi";
import relativeTime from "./routes/relative-time";
import { Scalar } from "@scalar/hono-api-reference";

const app = new OpenAPIHono();

app.get("/", (c) => {
	return c.json({ status: "ok" });
});

// === API Documentation ===

app.doc("/openapi.json", {
	openapi: "3.1.0",
	info: {
		version: "1.0.0",
		title: "BotUtils API",
	},
});

app.get(
	"/scalar",
	Scalar((c) => {
		return {
			url: "/openapi.json",
			title: "BotUtils API",
		};
	})
);

// === Routes ===

app.route("/relative-time", relativeTime);

export default app;
