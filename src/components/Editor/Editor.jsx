import React, { useEffect, useRef } from 'react'
import "./Editor.css"
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/elegant.css';
import 'codemirror/theme/duotone-light.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../../Actions';
const Editor = ({socketRef,roomId,onCodeChange}) => {
  const editorRef = useRef(null);
  useEffect(() => {
    async function init() {
      var a = Codemirror.fromTextArea(document.getElementById('synclab-editor'),
      {
        mode:{name:'javascript',json:true},
        theme:'duotone-light',
        autoCloseTags:true,
        autoCloseBrackets:true,
        lineNumbers:true,
      })
      a.setSize('100%', '100%');
      editorRef.current = a;
      editorRef.current.on('change', (instance,changes) => {
        console.log("chnges",changes);
        console.log("instance",instance);
        const code = instance.getValue(); 
        onCodeChange(code);
        const {origin} = changes; 
        if(origin !== 'setValue'){
          socketRef.current.emit(ACTIONS.CODE_CHANGE,{
            roomId,
            code,
          })
        }
        console.log("code",code);
      });  
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
        socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
            if (code !== null) {
                editorRef.current.setValue(code);
            }
        });
    }

    return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
}, [socketRef.current]);
  
  return (
      <textarea id='synclab-editor'></textarea>
  )
}

export default Editor