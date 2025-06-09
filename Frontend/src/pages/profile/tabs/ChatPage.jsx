import React from 'react'
import ChatBox from '../../../temp-testing/Testing'

const ChatPage = () => {
  const [senderId, setSenderId] = React.useState("CustomerService1");
  const [receiverId, setReceiverId] = React.useState("s10");
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <ChatBox currentUserId={senderId} receiverId={receiverId} />
    </div>
  )
}

export default ChatPage
