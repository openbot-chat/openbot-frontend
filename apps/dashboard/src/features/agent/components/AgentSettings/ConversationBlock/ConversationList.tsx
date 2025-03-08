import { useMemo } from 'react';
import { Stack } from "@chakra-ui/react";
import { Conversation } from "models";
import { useCallback } from "react";
import { Components, Virtuoso } from "react-virtuoso";
import { ConversationPreview } from "./ConversationPreview";




type Props = {
  activeConversation: Conversation;
  conversations: Conversation[];
  hasMore?: boolean;
  loadMore?: () => void;
  onSelect?: (conversation: Conversation) => void;
}

export const ConversationList = ({
  activeConversation,
  conversations,
  hasMore,
  loadMore,
  onSelect,
}: Props) => {
  const conversationRenderer = useCallback((conversation: Conversation) => {    
    return (
      <ConversationPreview conversation={conversation} onSelect={onSelect} active={activeConversation?.id === conversation.id}/>
    );
  }, [onSelect, activeConversation]);


  const endReached = () => {
    if (hasMore) {
      loadMore?.();
    }
  };

  const virtuosoComponents: Partial<Components> = useMemo(() => {
    const Item: Components['Item'] = (props) => (
      <Stack 
        {...props}
        cursor="pointer"
      />
    );

    return {
      Item,
    };
  }, []);

  return (
    <Virtuoso<Conversation>
      style={{ height: "100%" }}
      components={virtuosoComponents}  
      atBottomThreshold={200}
      endReached={endReached}
      data={conversations}
      itemContent={(i, item) => conversationRenderer(item)}
    />
  );
}