import React, { useState } from "react";

export const postApiService = async (data) => {
  const { url, body } = data;
  try {
    const response = await fetch("/api/" + url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  } catch (err) {
    return err;
  }
};
