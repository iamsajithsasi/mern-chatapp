import React from "react";
import { Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import { updateUserData, fetchUserData } from "../store/datastore";

export default function SearchBox() {
  const userList = useSelector((state) => state.chatApp.user);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    console.log(e.target.value);
    let search = e.target.value;
    if (search && search?.length > 0) {
      let srch = userList.filter(
        (obj) =>
          obj?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
          obj?.last_name?.toLowerCase().includes(search.toLowerCase())
      );
      // console.log(srch);
      dispatch(updateUserData(srch));
    } else {
      dispatch(fetchUserData());
    }
  };

  return (
    <div className="px-3">
      <Form.Group controlId="searchData" className="mb-0">
        <Form.Control
          type="search"
          placeholder="Search people"
          name="search"
          autoComplete="off"
          className="rounded-pill"
          onChange={(e) => {
            setTimeout(() => {
              handleChange(e);
            }, 700);
          }}
        />
      </Form.Group>
    </div>
  );
}
