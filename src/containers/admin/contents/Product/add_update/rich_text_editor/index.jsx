import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichTextEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(), //构建一个初始化状态的编辑器+内容
  }
  
  //编辑器改变回调
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState
    });
  };

  //获取富文本原始信息（包含HTML），富文本转为HTML
  getRichText = () => {
    const { editorState } = this.state
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }

  //获取富文本信息，HTML转为富文本
  setRichText = (html) => {
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState
      });
    }
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          //wrapperClassName="demo-wrapper" //最外侧容器的样式
          //editorClassName="demo-editor"//编辑区域的样式
          editorStyle={{
            border: '1px solid black',
            paddingLeft: '20px',
            lineHeight: '13px',
            minHeight: '200px'
          }}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}