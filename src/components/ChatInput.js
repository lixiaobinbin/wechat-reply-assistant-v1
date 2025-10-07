import React, { useState } from 'react';
import {
  Input,
  Button,
  Space,
  Radio,
  Card,
  Typography,
  Divider,
  Empty,
  Popconfirm
} from 'antd';
import {
  SendOutlined,
  UserOutlined,
  MessageOutlined,
  DeleteOutlined,
  ClearOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

const ChatInput = ({ chatHistory, onChatHistoryChange }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentSender, setCurrentSender] = useState('other');

  const addMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage = {
      sender: currentSender,
      content: currentMessage.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    onChatHistoryChange([...chatHistory, newMessage]);
    setCurrentMessage('');
  };

  const removeMessage = (index) => {
    const newHistory = chatHistory.filter((_, i) => i !== index);
    onChatHistoryChange(newHistory);
  };

  const clearAllMessages = () => {
    onChatHistoryChange([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addMessage();
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      {/* 聊天历史显示 */}
      <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px' }}>
        {chatHistory.length === 0 ? (
          <Empty
            description="暂无聊天记录"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: '20px 0' }}
          />
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                <div
                  className={`message-bubble ${
                    message.sender === 'me' ? 'message-me' : 'message-other'
                  }`}
                  style={{ position: 'relative', group: 'message' }}
                >
                  <div>{message.content}</div>
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeMessage(index)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #d9d9d9',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      opacity: 0.7
                    }}
                  />
                </div>
              </div>
            ))}
          </Space>
        )}
      </div>

      {chatHistory.length > 0 && (
        <div style={{ textAlign: 'right' }}>
          <Popconfirm
            title="确定要清空所有聊天记录吗？"
            onConfirm={clearAllMessages}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              size="small"
              icon={<ClearOutlined />}
              danger
            >
              清空记录
            </Button>
          </Popconfirm>
        </div>
      )}

      <Divider style={{ margin: '12px 0' }} />

      {/* 消息输入区域 */}
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong style={{ marginBottom: 8, display: 'block' }}>
            添加消息：
          </Text>
          <Radio.Group
            value={currentSender}
            onChange={(e) => setCurrentSender(e.target.value)}
            style={{ marginBottom: 12 }}
          >
            <Radio.Button value="other">
              <MessageOutlined /> 对方
            </Radio.Button>
            <Radio.Button value="me">
              <UserOutlined /> 我
            </Radio.Button>
          </Radio.Group>
        </div>

        <Input.Group compact>
          <TextArea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`输入${currentSender === 'me' ? '我' : '对方'}的消息内容...`}
            rows={3}
            style={{ resize: 'none' }}
          />
        </Input.Group>

        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={addMessage}
          disabled={!currentMessage.trim()}
          style={{ alignSelf: 'flex-end' }}
        >
          添加消息
        </Button>
      </Space>
    </Space>
  );
};

export default ChatInput;

