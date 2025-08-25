process.env.NODE_ENV = 'test';

process.env.STREAM_API_KEY = 'test-api-key';
process.env.STREAM_API_SECRET = 'test-api-secret';
process.env.STREAM_APP_ID = 'test-app-id';
process.env.PORT = '3001';

jest.setTimeout(10000);

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(async () => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;

  await new Promise(resolve => setTimeout(resolve, 100));
});



jest.mock('dotenv', () => ({
  config: jest.fn()
}));
