import React from "react";
import PhoneInput from "antd-phone-input";
import FormItem from "antd/es/form/FormItem";

// A basic validator for Ant Design form items:
const validator = (_, { valid }) => {
  // if (valid(true)) return Promise.resolve(); // strict validation
  if (valid()) return Promise.resolve(); // non-strict validation
  return Promise.reject("Invalid phone number");
};

/**
 * @param {Object} props
 * @param {{ fullPhoneNumber?: string, isoCode?: string }} [props.phoneData]
 *        e.g. { fullPhoneNumber: "+1234567890", isoCode: "US" }
 * @param {Function} props.setPhoneData
 *        (newPhoneData) => void
 */
const PhoneInputField = ({ phoneData, setPhoneData }) => {
  // Handle changes from the antd-phone-input
  const handlePhoneChange = (value) => {
    const { countryCode, areaCode, phoneNumber, isoCode } = value || {};
    // Combine the parts into one E.164-like string:
    const fullPhoneNumber = `+${countryCode || ""}${areaCode || ""}${
      phoneNumber || ""
    }`;

    // Send it back up to the parent
    setPhoneData({
      fullPhoneNumber,
      isoCode: isoCode || "",
    });
  };

  /**
   * Parse your stored phoneData (which is just { fullPhoneNumber, isoCode })
   * back into an object shape that the PhoneInput library expects:
   *  {
   *    countryCode: string,
   *    areaCode: string,
   *    phoneNumber: string,
   *    isoCode: string
   *  }
   *
   * This function is VERY naive. In reality, you'd want more robust
   * parsing logic or store each part separately in your DB.
   */
  const parsePhoneDataForComponent = (phoneObj) => {
    if (!phoneObj?.fullPhoneNumber) return {};

    // Remove the leading "+"
    const raw = phoneObj.fullPhoneNumber.replace(/^\+/, "");

    // Example naive parsing:
    // - countryCode: first 1-3 digits
    // - areaCode: next 3 digits
    // - phoneNumber: the rest
    // You may need a real parser (libphonenumber, etc.)
    const countryCode = raw.substring(0, 1); // e.g. "1" for US
    const areaCode = raw.substring(1, 4);    // e.g. "555"
    const phoneNumber = raw.substring(4);    // e.g. "1234567"

    return {
      countryCode,
      areaCode,
      phoneNumber,
      isoCode: phoneObj.isoCode || "",
    };
  };

  // Convert our stored { fullPhoneNumber, isoCode } into the shape needed by antd-phone-input
  const phoneValue = parsePhoneDataForComponent(phoneData);

  return (
    <FormItem
      name="phone"
      style={{ marginBottom: 0 }}
      rules={[{ validator }]}
    >
      <PhoneInput
        enableSearch
        value={phoneValue}
        onChange={handlePhoneChange}
      />
    </FormItem>
  );
};

export default PhoneInputField;
