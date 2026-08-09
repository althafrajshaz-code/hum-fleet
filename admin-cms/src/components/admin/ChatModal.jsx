import React, { useState, useEffect } from 'react';
import { X, Send, User, MessageSquare } from 'lucide-react';
import Button from '../Button';

const ChatModal = ({ entityType, entityData, onClose, API_BASE }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (entityData && entityData.email) {
      fetchMessages();
    }
  }, [entityData]);

  const fetchMessages = async () => {
    try {
      const endpoint = entityType === 'passenger' 
        ? `/api/admin/passengers/messages?passengerEmail=${encodeURIComponent(entityData.email)}`
        : `/api/admin/messages?driverEmail=${encodeURIComponent(entityData.email)}`;
        
      const response = await fetch(`${API_BASE}${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(`Error fetching ${entityType} chat messages:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      const endpoint = entityType === 'passenger' 
        ? `/api/admin/passengers/messages/send`
        : `/api/admin/messages/send`;
        
      const payload = entityType === 'passenger'
        ? { passengerEmail: entityData.email, sender: 'Admin CMS Support', text: newMessage.trim() }
        : { driverEmail: entityData.email, sender: 'Admin CMS Support', text: newMessage.trim() };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      } else {
        alert('Failed to send message.');
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert('Error sending message');
    }
  };

  if (!entityData) return null;

  return (
    <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="modal-content fade-in" style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '400px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
        
        {/* Header */}
        <div style={{ padding: '16px', background: 'var(--primary)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{entityData.name || 'User'}</h3>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{entityType === 'passenger' ? 'Passenger' : 'Driver'} • {entityData.phone || entityData.email}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>

        {/* Chat Log */}
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', margin: '20px 0' }}>Loading messages...</div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', margin: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={32} opacity={0.3} />
              No messages yet. Send a message to start the conversation.
            </div>
          ) : (
            messages.map((msg, i) => {
              const isAdmin = msg.sender.includes('Admin');
              return (
                <div key={i} style={{ alignSelf: isAdmin ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', textAlign: isAdmin ? 'right' : 'left' }}>
                    {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div style={{ 
                    padding: '10px 14px', 
                    background: isAdmin ? 'var(--primary)' : '#e2e8f0', 
                    color: isAdmin ? '#fff' : 'var(--text-main)', 
                    borderRadius: isAdmin ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid var(--border)', background: '#fff', display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '24px', outline: 'none', fontSize: '14px' }}
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: newMessage.trim() ? 'var(--primary)' : '#cbd5e1', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newMessage.trim() ? 'pointer' : 'default', transition: 'background 0.2s' }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
