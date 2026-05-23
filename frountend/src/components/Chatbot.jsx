import React, { useState } from "react";
import axios from "axios";

function Chatbot() {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const newMessages = [...messages, { type: "user", text: message }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/ai-chat", {
        message
      });

      setMessages([
        ...newMessages,
        {
          type: "bot",
          aiText: res.data.aiText,
          medicines: res.data.medicines
        }
      ]);

    } catch {
      setMessages([
        ...newMessages,
        { type: "bot", aiText: "Server error", medicines: [] }
      ]);
    }

    setLoading(false);
    setMessage("");
  };

  return (
    <>
      {!open && (
        <button
          className="btn btn-primary rounded-circle shadow"
          style={{ position:"fixed", bottom:20, right:20, width:60, height:60 }}
          onClick={()=>setOpen(true)}
        >
          💬
        </button>
      )}

      {open && (
        <div style={{
          position:"fixed", top:0,left:0,width:"100%",height:"100%",
          background:"linear-gradient(#eef2ff,#f8fafc)",
          display:"flex",flexDirection:"column"
        }}>

          {/* HEADER */}
          <div className="bg-primary text-white p-3 d-flex justify-content-between">
            <b>💊 Smart Medicine Assistant</b>
            <button className="btn btn-light btn-sm" onClick={()=>setOpen(false)}>✖</button>
          </div>

          {/* CHAT */}
          <div className="flex-grow-1 p-4 overflow-auto">

            {messages.map((msg,i)=>(
              <div key={i} className="mb-4">

                {msg.type==="user" && (
                  <div className="text-end">
                    <span className="bg-primary text-white px-3 py-2 rounded-pill">
                      {msg.text}
                    </span>
                  </div>
                )}

                {msg.type==="bot" && (
                  <div>

                    {/* AI TEXT */}
                    <div className="bg-white p-3 rounded shadow-sm mb-3">
                      <b className="text-primary">🤖 Recommendation</b>
                      <div style={{whiteSpace:"pre-line"}}>
                        {msg.aiText}
                      </div>
                    </div>

                    {/* MEDICINES */}
                    <div className="row">
                      {msg.medicines?.map((m,index)=>(
                        <div key={index} className="col-md-6 mb-3">

                          <div className="card shadow-sm border-0 rounded-4">

                            <div className="card-body">

                              <h5 className="text-primary fw-bold">
                                💊 {m.name}
                                {index===0 && (
                                  <span className="badge bg-success ms-2">
                                    Best
                                  </span>
                                )}
                              </h5>

                              <p className="text-muted">🏢 {m.company}</p>

                              <div className="mb-2">
                                <span className="badge bg-light text-dark me-2">
                                  ₹{m.price}
                                </span>
                                <span className="badge bg-warning text-dark">
                                  ⭐ {m.avgRating}
                                </span>
                              </div>

                              <small>
                                <b>Uses:</b>
                                <ul>
                                  {m.uses?.map((u,i)=><li key={i}>{u}</li>)}
                                </ul>
                              </small>

                              {/* REVIEWS */}
                              {m.reviews?.length > 0 && (
                                <div className="mt-2">
                                  <b>Reviews:</b>

                                  {m.reviews.map((r,i)=>(
                                    <div key={i} className="bg-light p-2 rounded mt-1">
                                      ⭐ {r.rating} - {r.comment}
                                    </div>
                                  ))}
                                </div>
                              )}

                            </div>

                          </div>

                        </div>
                      ))}
                    </div>

                  </div>
                )}

              </div>
            ))}

            {loading && <div>🤖 Thinking...</div>}

          </div>

          {/* INPUT */}
          <div className="p-3 bg-white d-flex gap-2">
            <input
              className="form-control rounded-pill"
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
              onKeyDown={(e)=>e.key==="Enter" && sendMessage()}
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              Send
            </button>
          </div>

        </div>
      )}
    </>
  );
}

export default Chatbot;