import useGetAIChatCreds from "@/Booking/useGetAIChatCreds";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Lightbulb,
  MessageSquare,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetFeedBack from "./useGetFeedBack";
import useGetProviderConversationMessages from "./useGetProviderConversationMessages";
import useGetProviderConversations from "./useGetProviderConversations";

interface ChatBotProp {
  businessId: string | null;
}

export default function ChatBot({ businessId }: ChatBotProp) {
  const { t, i18n } = useTranslation("chatbot");
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

  const {
    data: feedBack,
    refetch: fetchFeedBack,
    isFetching: loadingFeedBack,
  } = useGetFeedBack(creds?.aiProviderId, creds?.adminApiKey);

  if (!businessId) return null;

  return (
    <>
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
                      <span className="text-xs text-muted-foreground/40">
                        ·
                      </span>
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
      <div className="flex flex-col gap-5 m-8">
        <div className="relative overflow-hidden rounded-2xl p-px bg-linear-to-r from-swap-magic-start via-swap-magic-mid to-swap-magic-end">
          <div className="relative flex items-center justify-between gap-6 rounded-[15px] bg-linear-to-br from-[#1a0533] via-[#2d1450] to-[#1a0533] px-8 py-6 overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 50%, #c084fc 0%, transparent 50%)",
              }}
            />
            <div className="relative flex items-center gap-4">
              <div className="flex items-center justify-center size-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                <Sparkles className="size-5 text-swap-magic-end" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  {t("insights.title")}
                </h2>
                <p className="text-sm text-white/50 mt-0.5">
                  {t("insights.subtitle")}
                </p>
              </div>
            </div>
            <Button
              className="relative cursor-pointer bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 hover:border-white/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300"
              onClick={() => fetchFeedBack()}
              disabled={loadingFeedBack || !creds?.aiProviderId}
            >
              {loadingFeedBack ? (
                <span className="flex items-center gap-2">
                  <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("insights.loading")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="size-3.5" />
                  {t("insights.getInsights")}
                </span>
              )}
            </Button>
          </div>
        </div>

        {feedBack && (
          <div className="grid gap-4 sm:grid-cols-2">
            {feedBack.insights.map((insight, i) => {
              const isKa = i18n.language === "ka";
              const title = isKa ? insight.title_ka : insight.title_en;
              const message = isKa ? insight.message_ka : insight.message_en;

              const typeConfig: Record<
                string,
                { icon: React.ElementType; color: string; bg: string }
              > = {
                demand: {
                  icon: TrendingUp,
                  color: "text-violet-400",
                  bg: "bg-violet-500/10",
                },
                schedule: {
                  icon: Calendar,
                  color: "text-blue-400",
                  bg: "bg-blue-500/10",
                },
                pricing: {
                  icon: DollarSign,
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10",
                },
                engagement: {
                  icon: MessageSquare,
                  color: "text-amber-400",
                  bg: "bg-amber-500/10",
                },
              };

              const config = typeConfig[insight.type] ?? {
                icon: Lightbulb,
                color: "text-purple-400",
                bg: "bg-purple-500/10",
              };
              const Icon = config.icon;

              const priorityConfig = {
                high: {
                  dot: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]",
                  label: "text-red-400",
                },
                medium: {
                  dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]",
                  label: "text-amber-400",
                },
                low: {
                  dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]",
                  label: "text-emerald-400",
                },
              };
              const prio = priorityConfig[insight.priority];

              return (
                <Card
                  key={i}
                  className="group relative overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm hover:border-swap-magic-mid/30 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(124,58,237,0.08)]"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-swap-magic-mid/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-5">
                    <div className="flex items-start gap-3.5 mb-3">
                      <div
                        className={`flex items-center justify-center size-9 rounded-lg ${config.bg} shrink-0 mt-0.5`}
                      >
                        <Icon className={`size-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className={`text-[11px] font-medium uppercase tracking-wider ${config.color}`}
                          >
                            {insight.type}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`size-1.5 rounded-full ${prio.dot}`}
                            />
                            <span
                              className={`text-[11px] font-medium ${prio.label}`}
                            >
                              {insight.priority}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-sm font-semibold leading-snug">
                          {title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed pl-13">
                      {message}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
