import json
import os
from fastapi import APIRouter, HTTPException
from openai import OpenAI
from typing import List

from .models import AnalyzeRequest, AnalyzeResponse, ReplyOption, ReplyStyle

router = APIRouter()

# 初始化通义千问客户端
client = OpenAI(
    api_key=os.getenv("TONGYI_API_KEY", "sk-c40e4e214e1b41de8c9925abdfaf3167"),
    base_url=os.getenv("TONGYI_BASE_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1")
)

# 回复风格的中文描述和提示词
STYLE_PROMPTS = {
    ReplyStyle.FORMAL: {
        "name": "正式",
        "description": "使用正式、礼貌的语言，适合商务或正式场合",
        "prompt": "请使用正式、礼貌的语言风格，措辞得体，语气庄重"
    },
    ReplyStyle.FRIENDLY: {
        "name": "友好",
        "description": "温暖友善，适合朋友间的日常交流",
        "prompt": "请使用友好、温暖的语言风格，语气亲切自然"
    },
    ReplyStyle.HUMOROUS: {
        "name": "幽默",
        "description": "轻松幽默，适合活跃气氛",
        "prompt": "请使用幽默、轻松的语言风格，可以适当加入俏皮话或表情"
    },
    ReplyStyle.CARING: {
        "name": "关怀",
        "description": "体贴关心，适合安慰或表达关爱",
        "prompt": "请使用关怀、体贴的语言风格，表达关心和理解"
    },
    ReplyStyle.PROFESSIONAL: {
        "name": "专业",
        "description": "专业严谨，适合工作讨论",
        "prompt": "请使用专业、严谨的语言风格，逻辑清晰，表达准确"
    },
    ReplyStyle.CASUAL: {
        "name": "随意",
        "description": "轻松随意，适合非正式聊天",
        "prompt": "请使用轻松、随意的语言风格，可以使用网络用语和表情符号"
    }
}

def format_chat_history(chat_history: List) -> str:
    """格式化聊天历史为文本"""
    formatted = []
    for msg in chat_history:
        sender = "我" if msg.sender == "me" else "对方"
        formatted.append(f"{sender}: {msg.content}")
    return "\n".join(formatted)

def create_analysis_prompt(chat_history: str, style: ReplyStyle, context_info: str = None) -> str:
    """创建分析提示词"""
    style_info = STYLE_PROMPTS[style]

    base_prompt = f"""
你是一个专业的聊天回复助手，帮助用户分析微信聊天上下文并生成合适的回复建议。

聊天历史：
{chat_history}

{f"额外上下文信息：{context_info}" if context_info else ""}

回复风格要求：{style_info['name']} - {style_info['description']}
{style_info['prompt']}

请分析以下内容：
1. 对话的情感基调和氛围
2. 对方最后一条消息的意图和期待
3. 当前对话的主题和背景
4. 合适的回复方向

然后生成3个不同的回复建议，每个建议需要包含：
- 具体的回复内容
- 选择这个回复的理由
- 这个回复的合适程度（0-1分）

请以JSON格式返回结果：
{{
    "context_analysis": "对话上下文分析",
    "emotion_tone": "情感基调",
    "conversation_summary": "对话总结",
    "suggestions": [
        {{
            "content": "回复内容",
            "explanation": "选择理由",
            "confidence": 0.9
        }}
    ]
}}
"""
    return base_prompt

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_chat(request: AnalyzeRequest):
    """分析聊天内容并生成回复建议"""
    try:
        # 格式化聊天历史
        chat_text = format_chat_history(request.chat_history)

        if not chat_text.strip():
            raise HTTPException(status_code=400, detail="聊天历史不能为空")

        # 创建分析提示词
        prompt = create_analysis_prompt(
            chat_text,
            request.reply_style,
            request.context_info
        )

        # 调用通义千问API
        response = client.chat.completions.create(
            model=os.getenv("MODEL_NAME", "qwen-max"),
            messages=[
                {"role": "system", "content": "你是一个专业的聊天回复助手，擅长分析对话上下文并生成合适的回复建议。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500,
            extra_body={
                # 开启深度思考，该参数对 QwQ 模型无效
                "enable_thinking": False
            }
        )

        # 解析响应
        result_text = response.choices[0].message.content

        try:
            # 尝试解析JSON
            result_data = json.loads(result_text)

            # 验证和转换数据
            suggestions = []
            for suggestion in result_data.get("suggestions", []):
                suggestions.append(ReplyOption(
                    content=suggestion.get("content", ""),
                    explanation=suggestion.get("explanation", ""),
                    confidence=min(max(suggestion.get("confidence", 0.5), 0), 1)
                ))

            return AnalyzeResponse(
                suggestions=suggestions,
                context_analysis=result_data.get("context_analysis", ""),
                emotion_tone=result_data.get("emotion_tone", ""),
                conversation_summary=result_data.get("conversation_summary", "")
            )

        except json.JSONDecodeError:
            # 如果JSON解析失败，创建一个基本的回复
            return AnalyzeResponse(
                suggestions=[
                    ReplyOption(
                        content="抱歉，我需要更多信息来生成合适的回复建议。",
                        explanation="AI分析遇到问题，建议重新尝试",
                        confidence=0.3
                    )
                ],
                context_analysis="分析过程中遇到问题",
                emotion_tone="中性",
                conversation_summary="无法完成分析"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"分析失败: {str(e)}")

@router.get("/styles")
async def get_reply_styles():
    """获取所有可用的回复风格"""
    styles = []
    for style, info in STYLE_PROMPTS.items():
        styles.append({
            "value": style.value,
            "name": info["name"],
            "description": info["description"]
        })
    return {"styles": styles}

