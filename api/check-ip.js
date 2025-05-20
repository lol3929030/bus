export default async function handler(req, res) {
  const robloxIpRanges = [
    { start: '23.235.33.0', end: '23.235.33.255' },
    { start: '23.235.34.0', end: '23.235.34.255' }
  ];

  const ipToNumber = (ip) =>
    ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);

  // Get client IP from headers
  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp = forwardedFor ? forwardedFor.split(',')[0] : req.socket.remoteAddress || '';

  // Replace localhost IPs if testing locally
  const ipToCheck = clientIp === '::1' || clientIp === '127.0.0.1' ? 'YOUR_TEST_IP' : clientIp;

  let isRobloxServer = false;
  const ipNum = ipToNumber(ipToCheck);

  for (const range of robloxIpRanges) {
    const startNum = ipToNumber(range.start);
    const endNum = ipToNumber(range.end);
    if (ipNum >= startNum && ipNum <= endNum) {
      isRobloxServer = true;
      break;
    }
  }

  const code = isRobloxServer ? '71946003356325' : '4446576906';

  res.status(200).json({ code });
}