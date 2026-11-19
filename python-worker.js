/* Executes user-supplied trusted Python in a disposable worker, not a security sandbox. */
self.onmessage = async ({data}) => {
  let emitted = 0;
  const send = (type,text='') => self.postMessage({type,text:String(text)});
  const output = (text) => { if(emitted < 40000) { const chunk=String(text).slice(0,40000-emitted); emitted+=chunk.length+1; send('output',chunk); } };
  try {
    const base='https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
    importScripts(base+'pyodide.js');
    const py=await loadPyodide({indexURL:base});
    const lines=data.stdin.split(/\r?\n/); let i=0;
    py.setStdin({stdin:()=> i<lines.length ? lines[i++] : null});
    py.setStdout({batched:output}); py.setStderr({batched:output});
    for(const file of data.files || []) py.FS.writeFile('/home/pyodide/'+file.name,file.code);
    send('ready'); await py.runPythonAsync(data.code); send('done');
  } catch(error) { send('error',error.message || error); }
};