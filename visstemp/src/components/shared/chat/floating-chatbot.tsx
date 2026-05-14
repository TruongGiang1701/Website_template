"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  from: "bot" | "user";
  text: string;
};

const quickReplies = [
  "Mình muốn tư vấn gói VIP",
  "Thời gian làm website bao lâu?",
  "Có hỗ trợ chỉnh sửa sau bàn giao không?",
];

function createBotReply(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("vip")) {
    return "Gói VIP phù hợp cho dự án cần tối ưu chuyển đổi. Mình có thể gửi ngay lộ trình triển khai chi tiết cho bạn.";
  }
  if (normalized.includes("bao lâu") || normalized.includes("thời gian")) {
    return "Thông thường Landing Page mất 3-5 ngày, website đầy đủ mất 7-14 ngày tùy phạm vi tính năng.";
  }
  if (normalized.includes("chỉnh sửa") || normalized.includes("bàn giao")) {
    return "Bên mình có hỗ trợ sau bàn giao theo từng gói. Với VIP sẽ có thời gian đồng hành tối ưu dài hơn.";
  }
  return "Mình đã nhận thông tin. Bạn để lại nhu cầu cụ thể hơn để VISSTEMP tư vấn đúng gói và timeline nhé!";
}

export function FloatingChatBot() {
  const idRef = useRef(1);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-bot",
      from: "bot",
      text: "Xin chào! Mình là trợ lý VISSTEMP. Bạn muốn tư vấn gói dịch vụ nào?",
    },
  ]);

  const hasUnreadHint = useMemo(
    () => !isOpen && messages.some((message) => message.from === "bot"),
    [isOpen, messages],
  );

  const sendMessage = (text: string) => {
    const content = text.trim();
    if (!content) {
      return;
    }

    const nextId = idRef.current;
    idRef.current += 2;

    const userMessage: ChatMessage = {
      id: `user-${nextId}`,
      from: "user",
      text: content,
    };

    const botMessage: ChatMessage = {
      id: `bot-${nextId + 1}`,
      from: "bot",
      text: createBotReply(content),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setDraft("");
  };

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50">
      <div
        className={cn(
          "pointer-events-auto absolute bottom-[calc(4rem+0.75rem)] right-0 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-[#9fc4ea] bg-white shadow-lg transition-all duration-300",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-[#0f67be] to-[#2a83d9] px-4 py-3 text-white">
          <div>
            <p className="text-sm font-extrabold">Chat cùng VISSTEMP</p>
            <p className="text-xs text-white/80">Phản hồi nhanh trong giờ làm việc</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold hover:bg-white/20"
          >
            Đóng
          </button>
        </div>

        <div className="max-h-72 space-y-2 overflow-y-auto bg-[#f4f9ff] p-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-xs",
                message.from === "bot"
                  ? "rounded-bl-sm bg-white text-[#1b4f86]"
                  : "ml-auto rounded-br-sm bg-[#0f67be] text-white",
              )}
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-[#d1e4f8] bg-white p-3">
          <div className="flex flex-wrap gap-1.5">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => sendMessage(reply)}
                className="rounded-full border border-[#a8c8ea] bg-[#edf5ff] px-2.5 py-1 text-[11px] font-semibold text-[#245892] hover:bg-[#e2efff]"
              >
                {reply}
              </button>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(draft);
            }}
            className="flex gap-2"
          >
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Nhập câu hỏi..."
              className="h-9 bg-white"
            />
            <Button type="submit" className="h-9 rounded-full px-4 text-xs font-bold">
              Gửi
            </Button>
          </form>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Mở chat tư vấn"
        className="pointer-events-auto chatbot-fab group relative inline-flex size-16 items-center justify-center rounded-full border border-[#7cb2e8] bg-gradient-to-b from-[#2a83d9] to-[#0f67be] text-white shadow-lg transition hover:scale-105"
      >
        <span className="chatbot-wave" />
        <span className="chatbot-wave" style={{ animationDelay: "0.75s" }} />
        <span className="relative z-10 text-2xl">💬</span>
        {hasUnreadHint ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex size-5 items-center justify-center rounded-full bg-[#ff4d6d] text-[10px] font-bold text-white">
            1
          </span>
        ) : null}
      </button>
    </div>
  );
}
