"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { submitMessage } from "@/app/community/actions";

type Channel = { id: string; name: string; description: string | null };
type Message = {
  id: string;
  content: string;
  created_at: string;
  channel_id: string;
  profiles: { full_name: string | null; discord_name: string | null } | null;
};

function PostButton() {
  const { pending } = useFormStatus();
  return (
    <button className="button" type="submit" disabled={pending}>
      {pending ? "Posting…" : "Post"}
    </button>
  );
}

function formatMessageTime(value: string) {
  const date = new Date(value);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  return new Intl.DateTimeFormat("en-US", sameDay
    ? { hour: "numeric", minute: "2-digit" }
    : { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
  ).format(date);
}

export function CommunityBoard({
  channels,
  initialMessages,
}: {
  channels: Channel[];
  initialMessages: Message[];
}) {
  const [active, setActive] = useState(channels[0]?.id ?? "");
  const [messages, setMessages] = useState(initialMessages);
  const messageListRef = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const channel = supabase
      .channel("community-message-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const { data } = await supabase
            .from("messages")
            .select("id, content, created_at, channel_id, profiles(full_name, discord_name)")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setMessages((current) =>
              current.some((item) => item.id === data.id)
                ? current
                : [...current, data as Message]
            );
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase]);

  const visible = messages.filter((message) => message.channel_id === active);
  const currentChannel = channels.find((channel) => channel.id === active);

  useEffect(() => {
    const panel = messageListRef.current;
    if (panel) panel.scrollTop = panel.scrollHeight;
  }, [active, visible.length]);

  if (!channels.length) {
    return <div className="community-empty-panel">No community channels are active yet.</div>;
  }

  return (
    <section className="community-board">
      <aside className="channel-list">
        <div className="channel-list-heading">
          <span className="community-label">Homegrown4Heroes</span>
          <strong>Community channels</strong>
        </div>
        <div className="channel-buttons">
          {channels.map((channel) => {
            const count = messages.filter((message) => message.channel_id === channel.id).length;
            return (
              <button
                key={channel.id}
                type="button"
                className={active === channel.id ? "active" : ""}
                onClick={() => setActive(channel.id)}
                aria-pressed={active === channel.id}
              >
                <span className="channel-name"><b>#</b> {channel.name}</span>
                <small>{channel.description}</small>
                <span className="channel-count">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="channel-sidebar-note">
          <strong>Private member space</strong>
          <small>Posts are visible only to approved Homegrown4Heroes members.</small>
        </div>
      </aside>

      <div className="message-panel">
        <header>
          <div>
            <h3># {currentChannel?.name || "community"}</h3>
            <p>{currentChannel?.description || "Community conversation"}</p>
          </div>
          <span className="message-count">{visible.length} {visible.length === 1 ? "post" : "posts"}</span>
        </header>

        <div className="message-list" ref={messageListRef} aria-live="polite">
          {visible.length ? (
            visible.map((message, index) => {
              const name = message.profiles?.full_name || message.profiles?.discord_name || "Member";
              const previous = visible[index - 1];
              const sameAuthor = previous &&
                (previous.profiles?.full_name || previous.profiles?.discord_name) === name &&
                new Date(message.created_at).getTime() - new Date(previous.created_at).getTime() < 5 * 60 * 1000;

              return (
                <article key={message.id} className={sameAuthor ? "message-grouped" : ""}>
                  {sameAuthor ? <div className="avatar-spacer" /> : <div className="avatar">{name.charAt(0).toUpperCase()}</div>}
                  <div>
                    {!sameAuthor && (
                      <div className="message-meta">
                        <strong>{name}</strong>
                        {message.profiles?.discord_name && message.profiles.discord_name !== name && (
                          <span>@{message.profiles.discord_name}</span>
                        )}
                        <time dateTime={message.created_at}>{formatMessageTime(message.created_at)}</time>
                      </div>
                    )}
                    <p>{message.content}</p>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty-state">
              <strong>Start this channel.</strong>
              <span>No one has posted here yet.</span>
            </div>
          )}
        </div>

        <form action={submitMessage} className="message-form">
          <input type="hidden" name="channelId" value={active} />
          <label className="sr-only" htmlFor="community-message">Message</label>
          <textarea
            id="community-message"
            name="content"
            rows={2}
            maxLength={2000}
            placeholder={`Message #${currentChannel?.name || "community"}`}
            required
          />
          <PostButton />
        </form>
      </div>
    </section>
  );
}
