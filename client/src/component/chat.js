import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Button, Form } from "react-bootstrap";

import moment from "moment";

import avatar from "../assets/img_avatar.png";
import { fetchUserData, fetchUserChatData } from "../store/datastore";
import SearchBox from "./searchbox";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faPaperPlane,
  faAngleDoubleUp,
} from "@fortawesome/free-solid-svg-icons";

import ModalPop from "./modal";
import { postApiService } from "../library";

export default function Chat() {
  const chatData = useSelector((state) => state.chatApp);
  const [selUser, setSelUser] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [modalHead, setModalHead] = useState("Add");
  const [validated, setValidated] = useState(false);
  const [sendBtnStatus, setSendBtnStatus] = useState(true);

  const formDefault = {
    first_name: "",
    last_name: "",
    phone: null,
    email: "",
  };
  const [formInputs, setFormInputs] = useState(formDefault);

  const dispatch = useDispatch();

  const msgInput = useRef(null);

  useEffect(() => {
    setChatHistory(chatData.chat);
  }, [chatData]);

  const handleSelectUser = (e) => {
    const val = e.target.getAttribute("value");
    resetMsgIp();
    if (val != selUser) {
      setSelUser(val);
      dispatch(fetchUserChatData(val));
    }
  };

  function resetMsgIp() {
    if (msgInput?.current?.value) {
      msgInput.current.value = "";
    }
  }

  const handleInput = (e) => {
    setFormInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);

    addUser(form);
  };

  const addUser = async (form) => {
    if (form.checkValidity() === true) {
      const data = {
        url: "user_create",
        body: formInputs,
      };
      const resp = await postApiService(data);
      if (resp.status == 1) {
        dispatch(fetchUserData());
        closeModal();
      } else {
        window.alert(JSON.stringify(resp.message));
      }
    }
  };

  const sendMessage = async () => {
    setSendBtnStatus(false);
    const data = {
      url: `message_create/${selUser}`,
      body: {
        message: msgInput.current.value,
      },
    };
    if (msgInput?.current?.value?.length > 0) {
      const resp = await postApiService(data);
      setSendBtnStatus(true);
      if (resp.status == 1) {
        resetMsgIp();
        setChatHistory((prev) => [resp.data, ...prev]);
      } else {
        window.alert(JSON.stringify(resp.message));
      }
    } else {
      sendBtnStatus(true);
    }
  };

  const closeModal = () => {
    setModalShow(false);
    setFormInputs(formDefault);
    setValidated(false);
  };

  const openModal = () => {
    setModalShow(true);
  };

  const modalBody = () => {
    return (
      <div>
        <img src={avatar} className="avatar addUserAvatar" alt="avatar" />
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group controlId="fname" className="w-100">
                {/* <Form.Label required>First Name</Form.Label> */}
                <Form.Control
                  name="first_name"
                  type="text"
                  value={formInputs.first_name}
                  placeholder="First Name*"
                  onChange={handleInput}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  This field is required
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="lname" className="w-100">
                {/* <Form.Label required>Last Name</Form.Label> */}
                <Form.Control
                  name="last_name"
                  type="text"
                  value={formInputs.last_name}
                  placeholder="Last Name"
                  onChange={handleInput}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="phone" className="w-100">
                {/* <Form.Label required>Phone</Form.Label> */}
                <Form.Control
                  name="phone"
                  type="text"
                  value={formInputs.phone}
                  placeholder="Phone*"
                  onChange={handleInput}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  This field is required
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="email" className="w-100">
                {/* <Form.Label required>Last Name</Form.Label> */}
                <Form.Control
                  name="email"
                  type="email"
                  required
                  value={formInputs.email}
                  placeholder="Email*"
                  onChange={handleInput}
                />
                <Form.Control.Feedback type="invalid">
                  This field is required
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <div className="text-center">
            <Button variant="primary rounded-pill px-4" type="submit">
              Save
            </Button>
            <Button
              variant="secondary rounded-pill px-4"
              className="ml-3"
              onClick={closeModal}
            >
              Discard
            </Button>
          </div>
        </Form>
      </div>
    );
  };

  return (
    <>
      <div className="position-relative">
        <div className="d-flex min-vh-100">
          <div className="userList position-relative">
            <div className="bg-light pt-3 w-100 topBox">
              <SearchBox />
              <h4 className="m-0 title px-3 py-2 d-flex">
                <span>Contacts</span>
                <Button
                  variant="link"
                  className="ml-auto p-0"
                  onClick={openModal}
                >
                  <FontAwesomeIcon icon={faPlusCircle} className="font-20" />
                </Button>
              </h4>
            </div>
            <div className="listBox custom-scroll">
              {chatData?.user?.length > 0 ? (
                chatData?.user.map((item, index) => (
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
                ))
              ) : (
                <p className="p-3">No User Found</p>
              )}
            </div>
          </div>
          <div className="chatPage position-relative">
            {selUser ? (
              <>
                <div className="msgBox p-3 custom-scroll bg-white d-flex flex-column-reverse">
                  {chatData?.chatStatus != "failure" ? (
                    chatHistory.length > 0 ? (
                      chatHistory.map((item, index) => (
                        <div
                          key={index}
                          className="d-flex flex-column align-items-end"
                        >
                          <span className="px-3 py-1 bg-light rounded mt-3">
                            <div>{item.message}</div>
                            <small className="d-block text-right">
                              {moment(item.date).format("MM-DD-YY")}
                            </small>
                          </span>
                        </div>
                      ))
                    ) : (
                      chatData?.chatStatus == "success" && (
                        <p className="m-0 p-0">
                          No message found. Say Hi, to your contact Now !!
                        </p>
                      )
                    )
                  ) : (
                    <p>Failed to Load Chat History</p>
                  )}
                </div>
                <div className="msgIpBox d-flex p-3 bg-light">
                  <Form.Control
                    name="message"
                    type="text"
                    autoComplete="off"
                    ref={msgInput}
                    placeholder="Type your message here..."
                    className="w-100 mr-3 rounded-pill"
                  />
                  <Button
                    variant="link"
                    className="ml-auto p-0"
                    disabled={!sendBtnStatus}
                    onClick={sendMessage}
                  >
                    {sendBtnStatus ? (
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        className="font-20"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faAngleDoubleUp}
                        className="font-20"
                      />
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <h4 className="wlcmTxt">Welcome to ChatAapp</h4>
            )}
          </div>
        </div>
      </div>

      <ModalPop
        show={modalShow}
        onHide={closeModal}
        size="md"
        modalcontent={modalBody()}
        modalhead={`${modalHead} User`}
      />
    </>
  );
}
