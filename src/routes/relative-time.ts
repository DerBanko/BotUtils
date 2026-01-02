import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import moment, { type Moment, type unitOfTime } from "moment";

function parseDate(input: string): Moment | null {
	const numericValue = Number(input);
	if (!isNaN(numericValue)) {
		// If it's a reasonable Unix timestamp in seconds (before year 3000)
		if (numericValue < 32503680000) {
			return moment(numericValue * 1000);
		}
		// Already in milliseconds
		return moment(numericValue);
	}

	// Try parsing as ISO date string
	const date = new Date(input);
	if (!isNaN(date.getTime())) {
		return moment(date);
	}

	return null;
}

const unitOfTimeBase: unitOfTime.Base[] = [
	"year",
	"years",
	"y",

	"month",
	"months",
	"M",

	"week",
	"weeks",
	"w",

	"day",
	"days",
	"d",

	"hour",
	"hours",
	"h",

	"minute",
	"minutes",
	"m",

	"second",
	"seconds",
	"s",

	"millisecond",
	"milliseconds",
	"ms",
];

const relativeTime = new OpenAPIHono();

const route = createRoute({
	method: "get",
	path: "/",
	description: "Calculate the absolute time difference between a given date and now",
	request: {
		query: z.object({
			date: z.string().openapi({
				description: "Date as Unix timestamp (seconds or milliseconds) or ISO 8601 string",
				example: "1735776000",
			}),
			output: z.enum(unitOfTimeBase).openapi({
				description: "Unit of time for the result",
				example: "years",
			}),
		}),
	},
	responses: {
		200: {
			description: "Absolute time difference in the specified unit",
			content: {
				"text/plain": {
					schema: z.string().openapi({
						description: "Numeric value as plain text",
						example: "42",
					}),
				},
			},
		},
		400: {
			description: "Invalid date format",
			content: {
				"application/json": {
					schema: z.object({
						error: z.string().openapi({
							example: "Invalid timestamp format. Use Unix timestamp (s/ms) or ISO 8601 string.",
						}),
					}),
				},
			},
		},
	},
});

relativeTime.openapi(route, (c) => {
	const { date, output } = c.req.valid("query");

	const targetMoment = parseDate(date);
	if (targetMoment === null) {
		return c.json({ error: "Invalid timestamp format. Use Unix timestamp (s/ms) or ISO 8601 string." }, 400);
	}

	return c.text(Math.abs(targetMoment.diff(moment(), output)).toString());
});

export default relativeTime;
