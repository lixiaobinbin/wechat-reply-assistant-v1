import React from 'react';
import { Card, Button, Typography, Progress, Space, Tag } from 'antd';
import { CopyOutlined, StarOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const ReplyCard = ({ suggestion, index, onCopy }) => {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#52c41a';
    if (confidence >= 0.6) return '#faad14';
    return '#ff4d4f';
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 0.8) return '推荐';
    if (confidence >= 0.6) return '可选';
    return '备选';
  };

  return (
    <Card
      className="suggestion-card"
      size="small"
      title={
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <Text strong>建议 {index + 1}</Text>
          <Tag color={getConfidenceColor(suggestion.confidence)}>
            {getConfidenceText(suggestion.confidence)}
          </Tag>
        </Space>
      }
      extra={
        <Button
          type="text"
          icon={<CopyOutlined />}
          onClick={() => onCopy(suggestion.content)}
          size="small"
        >
          复制
        </Button>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {/* 回复内容 */}
        <div
          style={{
            background: '#f8f9fa',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}
        >
          <Paragraph
            style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}
            copyable={{
              text: suggestion.content,
              tooltips: ['点击复制', '已复制']
            }}
          >
            {suggestion.content}
          </Paragraph>
        </div>

        {/* 选择理由 */}
        <div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 {suggestion.explanation}
          </Text>
        </div>

        {/* 置信度指示器 */}
        <div>
          <Space align="center" style={{ width: '100%' }}>
            <Text style={{ fontSize: '12px', minWidth: '60px' }}>
              合适度：
            </Text>
            <Progress
              percent={Math.round(suggestion.confidence * 100)}
              size="small"
              strokeColor={getConfidenceColor(suggestion.confidence)}
              style={{ flex: 1 }}
            />
            <Text style={{ fontSize: '12px', color: getConfidenceColor(suggestion.confidence) }}>
              {Math.round(suggestion.confidence * 100)}%
            </Text>
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default ReplyCard;

