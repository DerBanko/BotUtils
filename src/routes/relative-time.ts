import { Hono } from 'hono';
import moment, { Moment } from 'moment';

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

const relativeTime = new Hono();

relativeTime.get('/', (c) => {
  const date = c.req.query('date');
  const output = c.req.query('output');

  if (!date) {  
    return c.json({ error: 'Missing required parameter: date' }, 400);
  }

  if (!output) {
    return c.json({ error: 'Missing required parameter: output' }, 400);
  }

  const targetMoment = parseDate(date);
  if (targetMoment === null) {
    return c.json({ error: 'Invalid timestamp format. Use Unix timestamp (s/ms) or ISO 8601 string.' }, 400);
  }
  
  return c.text(Math.abs(targetMoment.diff(moment(), output as any)).toString());
});

export default relativeTime;
