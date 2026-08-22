import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import MotionLayer from './MotionLayer.jsx'
import './index.css'
import './readability.css'
import './accessibility.css'

class CrashHandler extends React.Component {
  constructor(props) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { console.error('CRASH:', err, info); }
  render() {
    if (this.state.err) return (
      <div style={{position:'fixed',inset:0,zIndex:99999,background:'#0a0a0f',color:'#f0f0f0',padding:40,fontFamily:'monospace',fontSize:14,lineHeight:1.8,overflow:'auto'}}>
        <h2 style={{color:'#ef4444',marginBottom:16}}>Runtime Error Found</h2>
        <pre style={{whiteSpace:'pre-wrap',wordBreak:'break-word',background:'rgba(255,255,255,0.05)',padding:16,borderRadius:8,border:'1px solid rgba(255,255,255,0.1)'}}>
          {this.state.err.message}{'\n\n'}{this.state.err.stack}
        </pre>
      </div>
    );
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CrashHandler>
      <App />
      <MotionLayer />
    </CrashHandler>
  </React.StrictMode>
);