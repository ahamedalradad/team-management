import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  
  @Get()
  getSystemStatus(): string {
    // جلب بعض البيانات الحيوية للسيرفر ديناميكياً
    const nodeVersion = process.version;
    const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const uptime = (process.uptime() / 60).toFixed(2);

    return `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Team Management Core API</title>
          <style>
              :root {
                  --bg-main: #0b0f19;
                  --bg-card: #131a26;
                  --accent: #38bdf8;
                  --accent-gradient: linear-gradient(135deg, #38bdf8 0%, #0369a1 100%);
                  --text-main: #f1f5f9;
                  --text-muted: #64748b;
                  --success: #10b981;
              }
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  font-family: 'JetBrains Mono', 'Fira Code', 'Segoe UI', monospace;
              }
              body {
                  background-color: var(--bg-main);
                  color: var(--text-main);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  padding: 1rem;
              }
              .dashboard {
                  background-color: var(--bg-card);
                  border: 1px solid rgba(56, 189, 248, 0.15);
                  border-radius: 16px;
                  padding: 2.5rem;
                  max-width: 550px;
                  width: 100%;
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                  position: relative;
                  overflow: hidden;
              }
              .dashboard::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 4px;
                  background: var(--accent-gradient);
              }
              .header {
                  display: flex;
                  align-items: center;
                  gap: 1rem;
                  margin-bottom: 2rem;
              }
              .terminal-icon {
                  color: var(--accent);
                  font-size: 2rem;
              }
              h1 {
                  font-size: 1.5rem;
                  font-weight: 700;
                  letter-spacing: -0.5px;
              }
              p.subtitle {
                  color: var(--text-muted);
                  font-size: 0.95rem;
                  margin-bottom: 2rem;
                  line-height: 1.6;
              }
              .metrics-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 11fr);
                  gap: 1rem;
                  margin-bottom: 2rem;
              }
              .metric-card {
                  background: rgba(15, 23, 42, 0.6);
                  border: 1px solid rgba(255, 255, 255, 0.05);
                  padding: 1rem;
                  border-radius: 8px;
              }
              .metric-label {
                  color: var(--text-muted);
                  font-size: 0.75rem;
                  text-transform: uppercase;
                  margin-bottom: 0.25rem;
              }
              .metric-value {
                  font-size: 1.1rem;
                  font-weight: 600;
                  color: var(--text-main);
              }
              .status-bar {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding-top: 1.5rem;
                  border-top: 1px solid rgba(255, 255, 255, 0.05);
              }
              .badge {
                  background-color: rgba(16, 185, 129, 0.1);
                  color: var(--success);
                  padding: 0.4rem 0.8rem;
                  border-radius: 6px;
                  font-size: 0.85rem;
                  font-weight: 600;
                  border: 1px solid rgba(16, 185, 129, 0.2);
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
              }
              .pulse {
                  width: 8px;
                  height: 8px;
                  background-color: var(--success);
                  border-radius: 50%;
                  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
                  animation: pulse-animation 2s infinite;
              }
              @keyframes pulse-animation {
                  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
              }
          </style>
      </head>
      <body>
          <div class="dashboard">
              <div class="header">
                  <span class="terminal-icon">>_</span>
                  <h1>نظام إدارة الفرق | Team Core</h1>
              </div>
              <p class="subtitle">النواة البرمجية الخلفية (Backend API) تعمل الآن بكفاءة ومستعدة لمعالجة طلبات صلاحيات الفرق، المهام، والمزامنة اللحظية.</p>
              
              <div class="metrics-grid">
                  <div class="metric-card">
                      <div class="metric-label">بيئة التشغيل</div>
                      <div class="metric-value">Node ${nodeVersion}</div>
                  </div>
                  <div class="metric-card">
                      <div class="metric-label">استهلاك الذاكرة</div>
                      <div class="metric-value">${memoryUsage} MB</div>
                  </div>
                  <div class="metric-card">
                      <div class="metric-label font-mono">Uptime</div>
                      <div class="metric-value">${uptime} دقيقة</div>
                  </div>
                  <div class="metric-card">
                      <div class="metric-label">قاعدة البيانات</div>
                      <div class="metric-value" style="color: var(--accent);">MariaDB Active</div>
                  </div>
              </div>

              <div class="status-bar">
                  <div class="badge">
                      <span class="pulse"></span>
                      خادم الإنتاج نشط (Live)
                  </div>
                  <span style="color: var(--text-muted); font-size: 0.85rem;">v1.0.0</span>
              </div>
          </div>
      </body>
      </html>
    `;
  }
}