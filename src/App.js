import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Input,
  Button,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Tag,
  Alert,
  Spin,
  message
} from 'antd';
import {
  MessageOutlined,
  SendOutlined,
  RobotOutlined,
  BulbOutlined,
  HeartOutlined
} from '@ant-design/icons';
import ChatInput from './components/ChatInput';
import ReplyCard from './components/ReplyCard';
import AnalysisPanel from './components/AnalysisPanel';
import { analyzeChat, getReplyStyles } from './services/api';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [replyStyle, setReplyStyle] = useState('friendly');
  const [contextInfo, setContextInfo] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [styles, setStyles] = useState([]);

  useEffect(() => {
    // 加载回复风格选项
    loadReplyStyles();
  }, []);

  const loadReplyStyles = async () => {
    try {
      const response = await getReplyStyles();
      setStyles(response.styles);
    } catch (error) {
      console.error('加载回复风格失败:', error);
    }
  };

  const handleAnalyze = async () => {
    if (chatHistory.length === 0) {
      message.warning('请先添加聊天内容');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeChat({
        chat_history: chatHistory,
        reply_style: replyStyle,
        context_info: contextInfo || undefined
      });
      setAnalysis(result);
      message.success('分析完成！');
    } catch (error) {
      console.error('分析失败:', error);
      message.error('分析失败，请检查网络连接和API配置');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReply = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      message.success('回复内容已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  return (
    <Layout style={{ minHeight: '100vh', padding: '20px' }}>
      <Header style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <MessageOutlined style={{ fontSize: '24px', color: 'white', marginRight: '12px' }} />
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          微信聊天回复助手
        </Title>
      </Header>

      <Content>
        <Row gutter={[24, 24]}>
          {/* 左侧：聊天输入区域 */}
          <Col xs={24} lg={12}>
            <Card
              className="chat-container"
              title={
                <Space>
                  <MessageOutlined />
                  聊天内容
                </Space>
              }
              extra={
                <Tag color="blue">
                  {chatHistory.length} 条消息
                </Tag>
              }
            >
              <ChatInput
                chatHistory={chatHistory}
                onChatHistoryChange={setChatHistory}
              />

              <Divider />

              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>回复风格：</Text>
                  <Select
                    value={replyStyle}
                    onChange={setReplyStyle}
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder="选择回复风格"
                  >
                    {styles.map(style => (
                      <Option key={style.value} value={style.value}>
                        {style.name} - {style.description}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Text strong>额外上下文（可选）：</Text>
                  <Input.TextArea
                    value={contextInfo}
                    onChange={(e) => setContextInfo(e.target.value)}
                    placeholder="例如：这是我的同事，我们在讨论项目进度..."
                    rows={3}
                    style={{ marginTop: 8 }}
                  />
                </div>

                <Button
                  type="primary"
                  size="large"
                  icon={<RobotOutlined />}
                  onClick={handleAnalyze}
                  loading={loading}
                  disabled={chatHistory.length === 0}
                  style={{ width: '100%' }}
                >
                  {loading ? '分析中...' : '生成回复建议'}
                </Button>
              </Space>
            </Card>
          </Col>

          {/* 右侧：分析结果区域 */}
          <Col xs={24} lg={12}>
            {analysis ? (
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* 上下文分析 */}
                <AnalysisPanel analysis={analysis} />

                {/* 回复建议 */}
                <Card
                  title={
                    <Space>
                      <BulbOutlined />
                      回复建议
                    </Space>
                  }
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    {analysis.suggestions.map((suggestion, index) => (
                      <ReplyCard
                        key={index}
                        suggestion={suggestion}
                        index={index}
                        onCopy={handleCopyReply}
                      />
                    ))}
                  </Space>
                </Card>
              </Space>
            ) : (
              <Card className="chat-container">
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#999'
                }}>
                  <RobotOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                  <Title level={4} style={{ color: '#999' }}>
                    等待分析
                  </Title>
                  <Text>
                    请在左侧输入聊天内容，然后点击"生成回复建议"按钮
                  </Text>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;

