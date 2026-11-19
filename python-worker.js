/* Executes user-supplied trusted Python in a disposable worker, not a security sandbox. */
self.onmessage = async ({data}) => {
  let emitted = 0;
  const send = (type,text='') => self.postMessage({type,text:String(text)});
  const output = (text) => { if(emitted < 40000) { const chunk=String(text).slice(0,40000-emitted); emitted+=chunk.length+1; send('output',chunk); } };
  try {
    const base='https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
    importScripts(base+'pyodide.js');
    const py=await loadPyodide({indexURL:base});
    for(const file of data.files || []) { if(!/^[a-zA-Z0-9_]+\.py$/.test(file.name))throw Error('Invalid module name');py.FS.writeFile('/home/pyodide/'+file.name,file.code); }
    const execute=async(stdin, capture=false)=>{
      const lines=stdin.split(/\r?\n/);let i=0;let captured='',stderr='';
      py.setStdin({stdin:()=>i<lines.length?lines[i++]:null});
      py.setStdout({batched:text=>{if(capture)captured=(captured+text+'\n').slice(0,40001);else output(text);}});
      py.setStderr({batched:text=>{if(capture)stderr=(stderr+text).slice(0,40001);else output(text);}});
      const globals=py.toPy({__name__:'__main__'});try{await py.runPythonAsync(data.code,{globals});}finally{globals.destroy();}
      return {captured,stderr};
    };
    send('ready');
    if(data.syntaxOnly){py.globals.set('__academy_source',data.code);try{py.runPython("compile(__academy_source, '<editor>', 'exec')");send('done');}finally{py.globals.delete('__academy_source');}return;}
    if(Array.isArray(data.cases)){
      let passes=0;for(let j=0;j<data.cases.length;j++){const c=data.cases[j];try{const result=await execute(c.stdin,true);const ok=!result.stderr&&result.captured.trim()===c.expected;passes+=Number(ok);send('case','Test '+(j+1)+': '+(ok?'LULUS':'GAGAL')+' | expected '+c.expected+' | actual '+result.captured.trim().slice(0,200));}catch(e){send('case','Test '+(j+1)+': GAGAL — '+String(e.message).slice(0,300));}}send('done',passes+'/'+data.cases.length+' test case lulus');
    }else{await execute(data.stdin);send('done');}
  } catch(error) { send('error',error.message || error); }
};