import React from "react";
import { Form } from "react-bootstrap";

export default function SearchBox() {
  return (
    <div className="px-3">
      <Form.Group controlId="searchData" className="mb-0">
        <Form.Control
          type="search"
          placeholder="Search people"
          name="search"
          autoComplete="off"
          className="rounded-pill"
          //   onChange={(e) => {
          //     setTimeout(() => {
          //       handleChange(e);
          //     }, 700);
          //   }}
        />
      </Form.Group>
    </div>
  );
}
