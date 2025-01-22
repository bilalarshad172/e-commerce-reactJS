import React, { useState } from "react";
import PhoneInput from "antd-phone-input";
import FormItem from "antd/es/form/FormItem";

const validator = (_, { valid }) => {
  // if (valid(true)) return Promise.resolve(); // strict validation
  if (valid()) return Promise.resolve(); // non-strict validation
  return Promise.reject("Invalid phone number");
};

const PhoneInputField = ({ setSignupData, signupData }) => {
  const handlePhoneChange = (value) => {
    const { countryCode, areaCode, phoneNumber, isoCode } = value || {};
    console.log(value);

    // Combine the values into a single string
    const fullPhoneNumber = `+${countryCode}${areaCode || ""}${
      phoneNumber || ""
    }`;
    setSignupData({
      ...signupData, // Spread the existing signupData
      phone: {
        fullPhoneNumber, // Full phone number as a string
        isoCode: isoCode || "", // ISO code as a separate key
      },
    });
    console.log("Full Phone Number:", fullPhoneNumber); // Logs the complete phone number
  };
  return (
    <FormItem name="phone" rules={[{ validator }]}>
      <PhoneInput enableSearch onChange={handlePhoneChange} />
    </FormItem>
  );
};

export default PhoneInputField;
