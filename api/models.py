from enum import Enum
from pydantic import BaseModel
from typing import List, Optional


class ReplyStyle(str, Enum):
    FORMAL = "formal"          # 正式
    FRIENDLY = "friendly"      # 友好
    HUMOROUS = "humorous"      # 幽默
    CARING = "caring"          # 关怀
    PROFESSIONAL = "professional"  # 专业
    CASUAL = "casual"          # 随意

class ChatMessage(BaseModel):
    sender: str  # "me" 或 "other"
    content: str
    timestamp: Optional[str] = None

class AnalyzeRequest(BaseModel):
    chat_history: List[ChatMessage]
    reply_style: ReplyStyle = ReplyStyle.FRIENDLY
    context_info: Optional[str] = None  # 额外的上下文信息

class ReplyOption(BaseModel):
    content: str
    explanation: str
    confidence: float  # 0-1之间的置信度

class AnalyzeResponse(BaseModel):
    suggestions: List[ReplyOption]
    context_analysis: str
    emotion_tone: str
    conversation_summary: str

