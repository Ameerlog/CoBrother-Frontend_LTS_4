import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ventureAuctionAPI } from '../api/services';

export function useVentureAuction(auctionId) {
  const [auction, setAuction]       = useState(null);
  const [bids, setBids]             = useState([]);
  const [minNextBid, setMinNextBid] = useState(0);
  const [connected, setConnected]   = useState(false);
  const [loading, setLoading]       = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const clientRef                   = useRef(null);
  const handleUpdateRef             = useRef(null);

  const handleUpdate = useCallback((msg) => {
    setLastUpdate(msg);

    if (msg.type === 'BID_PLACED') {
      setAuction(prev => prev ? {
        ...prev,
        currentHighestBid:  msg.currentHighestBid,
        totalBids:          msg.totalBids,
        endTime:            msg.endTime
            ? (msg.endTime.endsWith('Z') ? msg.endTime : msg.endTime + 'Z')
            : prev.endTime,
        status:             msg.status,
        currentWinnerName:  msg.currentWinnerName,
      } : prev);
      setMinNextBid(msg.currentHighestBid * 1.05);
      if (msg.latestBid) setBids(prev => [msg.latestBid, ...prev]);
    } else if (msg.type === 'AUCTION_ENDED' || msg.type === 'AUCTION_UNSOLD') {
      setAuction(prev => prev ? { ...prev, status: msg.status } : prev);
    } else if (msg.type === 'AUCTION_EXTENDED') {
      if (msg.endTime) {
        setAuction(prev => prev ? {
          ...prev,
          endTime: msg.endTime.endsWith('Z') ? msg.endTime : msg.endTime + 'Z',
          status:  msg.status,
        } : prev);
      }
    } else if (msg.type === 'AUCTION_STARTED') {
      setAuction(prev => prev ? { ...prev, status: 'ACTIVE' } : prev);
    }
  }, []);

  handleUpdateRef.current = handleUpdate;

  useEffect(() => {
    if (!auctionId) return;
    setLoading(true);
    ventureAuctionAPI.get(auctionId)
      .then(({ data }) => {
        const a = data.auction;
        if (a?.endTime && !a.endTime.endsWith('Z')) a.endTime = a.endTime + 'Z';
        setAuction(a);
        setBids(data.bids || []);
        setMinNextBid(data.minNextBid || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [auctionId]);

  useEffect(() => {
    if (!auctionId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('https://backend.cobrother.com/ws'),
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/venture-auction/${auctionId}`, (frame) => {
          try {
            const msg = JSON.parse(frame.body);
            handleUpdateRef.current(msg);
          } catch (e) {
            console.error('Failed to parse venture auction message:', e);
          }
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError:  (frame) => { console.error('STOMP error:', frame); setConnected(false); },
    });

    client.activate();
    clientRef.current = client;

    return () => { client.deactivate(); setConnected(false); };
  }, [auctionId]);

  const placeBid = useCallback(async (amount) => {
    return ventureAuctionAPI.placeBid(auctionId, amount);
  }, [auctionId]);

  return { auction, bids, minNextBid, connected, loading, lastUpdate, placeBid };
}
