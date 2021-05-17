import React, { Component } from 'react'
import { Upload, Modal, Message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { BASE_URL } from '../../../../../../config'
import { reqDeletePicture } from '../../../../../../api'

//将图片变成base64编码形式
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {

    state = {
        previewVisible: false, //是否展示预览窗
        previewImage: '', //要预览的图片的URL地址或base64编码
        previewTitle: '', //弹出模态框的标题信息
        fileList: [] //收集好的所有上传完毕的图片名

        //   {
        //     uid: '-1',
        //     name: 'image.png',
        //     status: 'done', //当前图片的状态：uploading,done,removed,error
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //   },

    };

    //从fileList提取出所有该商品对应的图片名字，构建一个数组，供新增商品使用。
    getImgArr = () => {
        let result = []
        this.state.fileList.forEach((item) => {
            result.push(item.name)
        })
        return result
    }

    //修改商品信息时设置图片回显
    setFileList = (imgArr) => {
        let fileList = []
        imgArr.forEach((item, index) => {
            fileList.push({
                uid: -index,
                name: item,
                url: `${BASE_URL}/upload/${item}`
            })
        })
        this.setState({fileList})
    }

    //关闭预览窗
    handleCancel = () => this.setState({ previewVisible: false });

    //展示预览窗
    handlePreview = async file => {
        //如果图片没有url也没有转换过base64，那么调用如下方法把图片转成base64
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    //当图片状态发生改变的回调
    handleChange = async ({ file, fileList }) => {
        //若文件上传成功
        if (file.status === 'done') {
            console.log(file.response.data.url);
            fileList[fileList.length - 1].url = file.response.data.url
            fileList[fileList.length - 1].name = file.response.data.name
        }
        //默认是假删除，服务器还有图片
        //此处实现真删除
        if (file.status === 'removed') {
            let result = await reqDeletePicture(file.name)
            const { status, msg } = result
            if (status === 0) Message.success('删除图片成功！')
            else Message.error(msg)
        }
        this.setState({ fileList });
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action={`${BASE_URL}/manage/img/upload`} //发送上传请求的地址
                    method="post" //默认post
                    name="image"
                    listType="picture-card" //照片墙的展示方式
                    fileList={fileList} //图片列表，一个数组里面包含着多个图片对象{uid:xxxx,name:xxx,status:xxx,url:xxx}
                    onPreview={this.handlePreview} //点击预览按钮的回调
                    onChange={this.handleChange} //图片状态改变的回调（图片上传中、图片被删除、图片成功上传）
                >
                    {/* 隐藏上传按钮的图片数量的阈值 */}
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="图片" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}