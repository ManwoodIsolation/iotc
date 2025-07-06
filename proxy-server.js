// proxy-server.js
const net = require('net');
const WebSocket = require('ws');

// 配置信息
const config = {
  // DT-06模块的TCP服务器地址和端口
  tcpHost: '192.168.4.1',
  tcpPort: 9000,
  
  // WebSocket服务器监听的地址和端口
  wsHost: '0.0.0.0',
  wsPort: 8080
};

// 创建WebSocket服务器
const wss = new WebSocket.Server({ host: config.wsHost, port: config.wsPort });
console.log(`WebSocket服务器已启动，监听在 ${config.wsHost}:${config.wsPort}`);

// 当有WebSocket客户端连接时
wss.on('connection', (ws) => {
  console.log('新的WebSocket客户端已连接');
  
  // 创建TCP客户端连接到DT-06模块
  const tcpClient = new net.Socket();
  
  // 连接到DT-06模块
  tcpClient.connect(config.tcpPort, config.tcpHost, () => {
    console.log(`已连接到DT-06模块 ${config.tcpHost}:${config.tcpPort}`);
    ws.send(JSON.stringify({ type: 'info', message: '已连接到DT-06模块' }));
  });
  
  // 从WebSocket接收数据并转发到TCP
  ws.on('message', (message) => {
    console.log('收到来自小程序的数据:', message.toString());
    tcpClient.write(message);
  });
  
  // 从TCP接收数据并转发到WebSocket
  tcpClient.on('data', (data) => {
    console.log('收到来自DT-06模块的数据:', data.toString());
    ws.send(data);
  });
  
  // 处理TCP连接关闭
  tcpClient.on('close', () => {
    console.log('TCP连接已关闭');
    ws.send(JSON.stringify({ type: 'error', message: '与DT-06模块的连接已关闭' }));
    ws.close();
  });
  
  // 处理TCP连接错误
  tcpClient.on('error', (err) => {
    console.error('TCP错误:', err);
    ws.send(JSON.stringify({ type: 'error', message: `TCP错误: ${err.message}` }));
    ws.close();
  });
  
  // 处理WebSocket关闭
  ws.on('close', () => {
    console.log('WebSocket客户端已断开');
    tcpClient.destroy();
  });
});

// 错误处理
wss.on('error', (err) => {
  console.error('WebSocket服务器错误:', err);
});