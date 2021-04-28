import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { Col, Row } from "react-bootstrap";

import avatar from "../assets/img_avatar.png";
import { fetchUserChatData } from "../store/datastore";
import SearchBox from "./searchbox";

export default function Chat() {
  const chatData = useSelector((state) => state.chatApp);
  const [selUser, setSelUser] = useState();

  const dispatch = useDispatch();

  const handleSelectUser = (e) => {
    const val = e.target.getAttribute("value");
    if (val != selUser) {
      setSelUser(val);
      dispatch(fetchUserChatData(val));
    }
  };

  return (
    <div className="position-relative">
      <div className="d-flex min-vh-100">
        {chatData.status == "success" ? (
          <div className="userList position-relative">
            <div className="bg-light pt-3 w-100 topBox">
              <SearchBox />
              <h4 className="m-0 title px-3 py-2">Contacts</h4>
            </div>
            <div className="listBox custom-scroll">
              {chatData.user.map((item, index) => (
                <div
                  key={index}
                  value={item._id}
                  className={`d-flex align-items-center user-card p-2 ${
                    selUser == item._id ? "active" : ""
                  }`}
                  onClick={handleSelectUser}
                >
                  <img
                    src={item?.image_url ? item?.image_url : avatar}
                    alt="Avatar"
                    className="avatar mr-2"
                  />
                  <div className="w-100">
                    <p className="m-0 text-capitalize">{item.first_name}</p>
                    <p className="m-0 phone">
                      <small>{item.phone}</small>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : chatData.user.status == "pending" ? (
          <p>Loading...</p>
        ) : (
          <p>Failed</p>
        )}
        <div className="chatPage">
          {chatData.chat.map((item, index) => (
            <>
              <div>{item.message}</div>
              <div>{item.date}</div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
