import React from 'react';
import { Card, Typography, Space, Tag, Divider } from 'antd';
import {
  BarChartOutlined,
  HeartOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const AnalysisPanel = ({ analysis }) => {
  const getEmotionColor = (emotion) => {
    const emotionColors = {
      '积极': 'green',
      '消极': 'red',
      '中性': 'blue',
      '友好': 'cyan',
      '正式': 'purple',
      '轻松': 'orange',
      '关切': 'magenta',
      '幽默': 'gold'
    };

    // 查找匹配的情感关键词
    for (const [key, color] of Object.entries(emotionColors)) {
      if (emotion.includes(key)) {
        return color;
      }
    }
    return 'default';
  };

  return (
    <Card
      title={
        <Space>
          <BarChartOutlined />
          对话分析
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* 情感基调 */}
        <div>
          <Space align="center" style={{ marginBottom: 8 }}>
            <HeartOutlined style={{ color: '#ff4d4f' }} />
            <Text strong>情感基调：</Text>
            <Tag color={getEmotionColor(analysis.emotion_tone)}>
              {analysis.emotion_tone}
            </Tag>
          </Space>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* 对话总结 */}
        <div>
          <Space align="start" style={{ marginBottom: 8 }}>
            <FileTextOutlined style={{ color: '#1890ff', marginTop: 4 }} />
            <Text strong>对话总结：</Text>
          </Space>
          <Paragraph
            style={{
              background: '#f6ffed',
              padding: '12px',
              borderRadius: '6px',
              margin: 0,
              border: '1px solid #b7eb8f'
            }}
          >
            {analysis.conversation_summary}
          </Paragraph>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* 上下文分析 */}
        <div>
          <Space align="start" style={{ marginBottom: 8 }}>
            <BarChartOutlined style={{ color: '#722ed1', marginTop: 4 }} />
            <Text strong>上下文分析：</Text>
          </Space>
          <Paragraph
            style={{
              background: '#f9f0ff',
              padding: '12px',
              borderRadius: '6px',
              margin: 0,
              border: '1px solid #d3adf7'
            }}
          >
            {analysis.context_analysis}
          </Paragraph>
        </div>
      </Space>
    </Card>
  );
};

export default AnalysisPanel;

