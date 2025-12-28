import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { audioUtils } from './utils/audioUtils';

// 预加载音频上下文，解决浏览器自动播放限制
audioUtils.preload();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);