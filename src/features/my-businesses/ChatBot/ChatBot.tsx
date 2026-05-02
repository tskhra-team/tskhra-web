import useGetAIChatCreds from "@/Booking/useGetAIChatCreds";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetProviderConversationMessages from "./useGetProviderConversationMessages";
import useGetProviderConversations from "./useGetProviderConversations";

interface ChatBotProp {
  businessId: string | null;
}

export default function ChatBot({ businessId }: ChatBotProp) {
  const { t } = useTranslation("chatbot");
  const { data: creds } = useGetAIChatCreds(businessId);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  const { data: conversationsData, isLoading: loadingConversations } =
    useGetProviderConversations(creds?.aiProviderId, creds?.adminApiKey);
  const conversations = conversationsData?.conversations;

  const { data: messagesData, isLoading: loadingMessages } =
    useGetProviderConversationMessages(
      creds?.aiProviderId,
      selectedSessionId,
      creds?.adminApiKey,
    );

  if (!businessId) return null;

  return (
    <div className="flex gap-4 h-[calc(100vh-200px)] m-8 min-h-125">
      {/* Conversation list - hidden on mobile when a session is selected */}
      <Card
        className={`w-full lg:w-80 shrink-0 flex flex-col overflow-hidden ${
          selectedSessionId ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="px-4 py-3 border-b border-border/50">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <MessageSquare className="size-4 text-[#7c3aed]" />
            {t("provider.conversations")}
          </h3>
        </div>
        <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin">
          {loadingConversations ? (
            <div className="p-3 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-3 space-y-2 rounded-lg">
                  <div className="h-3.5 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/3 bg-muted/60 animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : !conversations?.length ? (
            <div className="flex items-center justify-center h-full p-8">
              <p className="text-sm text-muted-foreground">
                {t("provider.noConversations")}
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {conversations.map((conv) => (
                <button
                  key={conv.session_id}
                  onClick={() => setSelectedSessionId(conv.session_id)}
                  className={`w-full text-left rounded-lg p-3 transition-colors cursor-pointer ${
                    selectedSessionId === conv.session_id
                      ? "bg-[#7c3aed]/10 border border-[#7c3aed]/20"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
                    <User className="size-3 text-[#7c3aed]" />
                    {conv.customer_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {conv.message_count} {t("history.messages")}
                    </span>
                    <span className="text-xs text-muted-foreground/40">·</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conv.last_message_at).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages view */}
      <Card
        className={`flex-1 flex flex-col overflow-hidden ${
          selectedSessionId ? "flex" : "hidden lg:flex"
        }`}
      >
        {selectedSessionId ? (
          <>
            <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
              <button
                onClick={() => setSelectedSessionId(null)}
                className="lg:hidden rounded-lg p-1 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-4" />
              </button>
              <h3 className="text-sm font-semibold">
                {t("provider.conversation")}
              </h3>
            </div>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {loadingMessages ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`flex ${i % 2 === 1 ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[75%] space-y-1">
                        <div
                          className={`h-16 w-48 rounded-2xl animate-pulse ${
                            i % 2 === 1 ? "bg-[#7c3aed]/10" : "bg-muted"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                messagesData?.messages.map((msg, i) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={i}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? "rounded-2xl rounded-br-md text-white"
                            : "rounded-2xl rounded-bl-md text-foreground/90 bg-muted/50 border border-border/50"
                        }`}
                        style={
                          isUser
                            ? {
                                background:
                                  "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                              }
                            : undefined
                        }
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MessageSquare className="size-10 text-muted-foreground/30 mx-auto" />
              <p className="text-sm text-muted-foreground">
                {t("provider.selectConversation")}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
