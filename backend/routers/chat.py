from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from db.supabase import supabase
from dependencies import get_current_user
from models.chat import ChatCreate, ChatResponse, MessageCreate, MessageResponse, ChatWithMessages

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/start-chat", response_model=ChatResponse)
def start_chat(
    chat: ChatCreate,
    user_id: str = Depends(get_current_user)
):
    db = supabase()
    result = db.table("chats").insert({
        "user_id": user_id,
        "title": chat.title or "New Chat"
    }).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start chat"
        )
    return result.data[0]

@router.post("/send-message", response_model=MessageResponse)
def send_message(
    message: MessageCreate,
    user_id: str = Depends(get_current_user)
):
    db = supabase()
    
    # Verify chat ownership
    chat_check = db.table("chats").select("user_id").eq("id", message.chat_id).execute()
    if not chat_check.data or chat_check.data[0]["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Chat not found")

    # Save user message
    result = db.table("messages").insert({
        "chat_id": message.chat_id,
        "sender": "user",
        "content": message.content
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to send message")

    # Mock assistant response
    # In a real app, you would call an LLM here
    assistant_content = f"I'm here to help you manage your diabetes. You said: {message.content}"
    
    assistant_msg = db.table("messages").insert({
        "chat_id": message.chat_id,
        "sender": "assistant",
        "content": assistant_content
    }).execute()

    return assistant_msg.data[0]

@router.get("/chat-history", response_model=List[ChatResponse])
def get_chat_history(
    user_id: str = Depends(get_current_user)
):
    db = supabase()
    result = db.table("chats").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return result.data

@router.get("/chat/{chat_id}", response_model=ChatWithMessages)
def get_chat_details(
    chat_id: str,
    user_id: str = Depends(get_current_user)
):
    db = supabase()
    
    chat_result = db.table("chats").select("*").eq("id", chat_id).eq("user_id", user_id).execute()
    if not chat_result.data:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    messages_result = db.table("messages").select("*").eq("chat_id", chat_id).order("created_at", asc=True).execute()
    
    chat_data = chat_result.data[0]
    chat_data["messages"] = messages_result.data
    return chat_data
