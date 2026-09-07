import { useEffect, useState } from "react";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaBriefcase,
  FaBuilding,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaEdit,
  FaSave,
  FaTimes
} from "react-icons/fa";

function CustomerProfile({ onBack }) {

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    profession: "",
    employer: "",
    monthlyIncome: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [editProfile, setEditProfile] = useState(profile);

  useEffect(() => {

    // Get currently logged-in customer
    const email =
      localStorage.getItem("loggedInCustomerEmail") ||
      localStorage.getItem("customerEmail") ||
      "";

    const customerName =
      localStorage.getItem("loggedInCustomerName") ||
      "Customer";

    // Get customer account
    const storedAccounts =
      localStorage.getItem("customerAccounts");

    let customerAccount = null;

    if (storedAccounts) {

      try {

        const accounts = JSON.parse(storedAccounts);

        customerAccount = accounts.find(
          (account) => account.email === email
        );

      } catch (error) {

        console.error(
          "Error loading customer accounts:",
          error
        );

      }

    }

    // Get customer-specific profile information
    const savedProfile =
      localStorage.getItem(
        `customerProfile_${email}`
      );

    let extraProfile = {};

    if (savedProfile) {

      try {

        extraProfile = JSON.parse(savedProfile);

      } catch (error) {

        console.error(
          "Error loading customer profile:",
          error
        );

      }

    }

    const customerProfile = {

      name:
        customerAccount?.name ||
        extraProfile.name ||
        customerName,

      email:
        customerAccount?.email ||
        extraProfile.email ||
        email,

      phone:
        customerAccount?.phone ||
        extraProfile.phone ||
        "",

      dateOfBirth:
        extraProfile.dateOfBirth || "",

      gender:
        extraProfile.gender || "",

      profession:
        extraProfile.profession || "",

      employer:
        extraProfile.employer || "",

      monthlyIncome:
        extraProfile.monthlyIncome || "",

      address:
        extraProfile.address || "",

      city:
        extraProfile.city || "",

      state:
        extraProfile.state || "",

      pincode:
        extraProfile.pincode || ""

    };

    setProfile(customerProfile);
    setEditProfile(customerProfile);

  }, []);

  // Handle editing fields
  const handleChange = (e) => {

    const { name, value } = e.target;

    setEditProfile((previous) => ({
      ...previous,
      [name]: value
    }));

  };

  // Save customer profile
  const handleSave = () => {

    const oldEmail =
      localStorage.getItem("loggedInCustomerEmail") ||
      localStorage.getItem("customerEmail") ||
      "";

    /*
     * Save extra profile information
     * using a CUSTOMER-SPECIFIC key.
     *
     * This prevents different customers
     * from sharing the same profile.
     */
    localStorage.setItem(
      `customerProfile_${editProfile.email}`,
      JSON.stringify(editProfile)
    );

    // Update customer account
    const storedAccounts =
      localStorage.getItem("customerAccounts");

    if (storedAccounts) {

      try {

        const accounts = JSON.parse(storedAccounts);

        const updatedAccounts = accounts.map((account) => {

          if (account.email === oldEmail) {

            return {
              ...account,
              name: editProfile.name,
              email: editProfile.email,
              phone: editProfile.phone
            };

          }

          return account;

        });

        localStorage.setItem(
          "customerAccounts",
          JSON.stringify(updatedAccounts)
        );

      } catch (error) {

        console.error(
          "Error updating customer account:",
          error
        );

      }

    }

    // Update current logged-in customer information
    localStorage.setItem(
      "loggedInCustomerName",
      editProfile.name
    );

    localStorage.setItem(
      "loggedInCustomerEmail",
      editProfile.email
    );

    // Keep old key for compatibility with existing pages
    localStorage.setItem(
      "customerEmail",
      editProfile.email
    );

    setProfile(editProfile);
    setIsEditing(false);

    alert("Profile updated successfully.");

  };

  // Cancel editing
  const handleCancel = () => {

    setEditProfile(profile);
    setIsEditing(false);

  };

  // Calculate profile completion
  const calculateCompletion = () => {

    const fields = [
      profile.name,
      profile.email,
      profile.phone,
      profile.dateOfBirth,
      profile.gender,
      profile.profession,
      profile.employer,
      profile.monthlyIncome,
      profile.address,
      profile.city,
      profile.state,
      profile.pincode
    ];

    const completedFields = fields.filter(
      (field) =>
        field &&
        String(field).trim() !== ""
    ).length;

    return Math.round(
      (completedFields / fields.length) * 100
    );

  };

  const completion = calculateCompletion();

  const getInitial = () => {

    if (profile.name) {
      return profile.name
        .charAt(0)
        .toUpperCase();
    }

    return "C";

  };

  const displayValue = (value) => {

    return value &&
      String(value).trim() !== ""
      ? value
      : "Not provided";

  };

  return (

    <div className="page-container">

      {/* PAGE HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px"
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,
              color: "#0A2654",
              fontSize: "28px"
            }}
          >
            My Profile
          </h1>

          <p
            style={{
              marginTop: "6px",
              color: "#6b7280"
            }}
          >
            Manage your personal and professional information
          </p>

        </div>

        {!isEditing ? (

          <button
            onClick={() => setIsEditing(true)}
            style={{
              background: "#0A2654",
              color: "white",
              border: "none",
              padding: "11px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600"
            }}
          >
            <FaEdit />
            Edit Profile
          </button>

        ) : (

          <div
            style={{
              display: "flex",
              gap: "10px"
            }}
          >

            <button
              onClick={handleCancel}
              style={{
                background: "white",
                color: "#0A2654",
                border: "1px solid #d1d5db",
                padding: "11px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FaTimes />
              Cancel
            </button>

            <button
              onClick={handleSave}
              style={{
                background: "#0A2654",
                color: "white",
                border: "none",
                padding: "11px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "600"
              }}
            >
              <FaSave />
              Save Changes
            </button>

          </div>

        )}

      </div>

      {/* PROFILE OVERVIEW */}

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "25px",
          marginBottom: "20px",
          border: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "30px"
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px"
          }}
        >

          <div
            style={{
              width: "75px",
              height: "75px",
              borderRadius: "50%",
              background: "#0A2654",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              fontWeight: "600"
            }}
          >
            {getInitial()}
          </div>

          <div>

            <h2
              style={{
                margin: 0,
                color: "#0A2654"
              }}
            >
              {displayValue(profile.name)}
            </h2>

            <p
              style={{
                margin: "6px 0",
                color: "#6b7280"
              }}
            >
              Customer
            </p>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
                fontSize: "14px"
              }}
            >
              {displayValue(profile.email)}
            </p>

          </div>

        </div>

        {/* PROFILE COMPLETION */}

        <div
          style={{
            width: "280px"
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px"
            }}
          >

            <span
              style={{
                fontWeight: "600",
                color: "#0A2654"
              }}
            >
              Profile Completion
            </span>

            <span
              style={{
                fontWeight: "600",
                color: "#3B82F6"
              }}
            >
              {completion}%
            </span>

          </div>

          <div
            style={{
              height: "8px",
              background: "#e5e7eb",
              borderRadius: "10px",
              overflow: "hidden"
            }}
          >

            <div
              style={{
                width: `${completion}%`,
                height: "100%",
                background: "#3B82F6",
                borderRadius: "10px",
                transition: "width 0.3s ease"
              }}
            />

          </div>

          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              marginTop: "7px"
            }}
          >
            Complete your profile to improve your loan application experience.
          </p>

        </div>

      </div>

      {/* PERSONAL INFORMATION */}

      <ProfileSection
        title="Personal Information"
        icon={<FaUser />}
      >

        <ProfileField
          label="Full Name"
          icon={<FaUser />}
          name="name"
          value={profile.name}
          editValue={editProfile.name}
          isEditing={isEditing}
          onChange={handleChange}
        />

        <ProfileField
          label="Email Address"
          icon={<FaEnvelope />}
          name="email"
          value={profile.email}
          editValue={editProfile.email}
          isEditing={isEditing}
          onChange={handleChange}
          type="email"
        />

        <ProfileField
          label="Phone Number"
          icon={<FaPhone />}
          name="phone"
          value={profile.phone}
          editValue={editProfile.phone}
          isEditing={isEditing}
          onChange={handleChange}
        />

        <ProfileField
          label="Date of Birth"
          icon={<FaCalendarAlt />}
          name="dateOfBirth"
          value={profile.dateOfBirth}
          editValue={editProfile.dateOfBirth}
          isEditing={isEditing}
          onChange={handleChange}
          type="date"
        />

        <ProfileField
          label="Gender"
          icon={<FaUser />}
          name="gender"
          value={profile.gender}
          editValue={editProfile.gender}
          isEditing={isEditing}
          onChange={handleChange}
          selectOptions={[
            "Male",
            "Female",
            "Other",
            "Prefer not to say"
          ]}
        />

      </ProfileSection>

      {/* PROFESSIONAL INFORMATION */}

      <ProfileSection
        title="Professional Information"
        icon={<FaBriefcase />}
      >

        <ProfileField
          label="Profession / Employment Type"
          icon={<FaBriefcase />}
          name="profession"
          value={profile.profession}
          editValue={editProfile.profession}
          isEditing={isEditing}
          onChange={handleChange}
          selectOptions={[
            "Salaried",
            "Self Employed",
            "Business Owner",
            "Student",
            "Retired",
            "Other"
          ]}
        />

        <ProfileField
          label="Employer / Organization"
          icon={<FaBuilding />}
          name="employer"
          value={profile.employer}
          editValue={editProfile.employer}
          isEditing={isEditing}
          onChange={handleChange}
        />

        <ProfileField
          label="Monthly Income"
          icon={<FaMoneyBillWave />}
          name="monthlyIncome"
          value={
            profile.monthlyIncome
              ? `₹${Number(
                  profile.monthlyIncome
                ).toLocaleString("en-IN")}`
              : ""
          }
          editValue={editProfile.monthlyIncome}
          isEditing={isEditing}
          onChange={handleChange}
          type="number"
          prefix="₹"
        />

      </ProfileSection>

      {/* ADDRESS */}

      <ProfileSection
        title="Address Information"
        icon={<FaMapMarkerAlt />}
      >

        <ProfileField
          label="Address"
          icon={<FaMapMarkerAlt />}
          name="address"
          value={profile.address}
          editValue={editProfile.address}
          isEditing={isEditing}
          onChange={handleChange}
          fullWidth
        />

        <ProfileField
          label="City"
          icon={<FaMapMarkerAlt />}
          name="city"
          value={profile.city}
          editValue={editProfile.city}
          isEditing={isEditing}
          onChange={handleChange}
        />

        <ProfileField
          label="State"
          icon={<FaMapMarkerAlt />}
          name="state"
          value={profile.state}
          editValue={editProfile.state}
          isEditing={isEditing}
          onChange={handleChange}
        />

        <ProfileField
          label="PIN Code"
          icon={<FaMapMarkerAlt />}
          name="pincode"
          value={profile.pincode}
          editValue={editProfile.pincode}
          isEditing={isEditing}
          onChange={handleChange}
        />

      </ProfileSection>

      {/* KYC */}

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "25px",
          border: "1px solid #e5e7eb",
          marginBottom: "30px"
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px"
          }}
        >

          <FaShieldAlt color="#0A2654" />

          <h3
            style={{
              margin: 0,
              color: "#0A2654"
            }}
          >
            KYC Information
          </h3>

        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px",
            background: "#f8fafc",
            borderRadius: "8px"
          }}
        >

          <div>

            <strong
              style={{
                color: "#0A2654"
              }}
            >
              KYC Verification
            </strong>

            <p
              style={{
                margin: "5px 0 0",
                color: "#6b7280",
                fontSize: "14px"
              }}
            >
              Submit and verify your identity documents from the Documents section.
            </p>

          </div>

          <span
            style={{
              padding: "7px 14px",
              borderRadius: "20px",
              background: "#dbeafe",
              color: "#1d4ed8",
              fontSize: "13px",
              fontWeight: "600"
            }}
          >
            Pending
          </span>

        </div>

      </div>

    </div>

  );
}


/* ============================
   PROFILE SECTION
============================ */

function ProfileSection({
  title,
  icon,
  children
}) {

  return (

    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "25px",
        border: "1px solid #e5e7eb",
        marginBottom: "20px"
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "22px"
        }}
      >

        <span
          style={{
            color: "#0A2654"
          }}
        >
          {icon}
        </span>

        <h3
          style={{
            margin: 0,
            color: "#0A2654"
          }}
        >
          {title}
        </h3>

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: "20px"
        }}
      >
        {children}
      </div>

    </div>

  );

}


/* ============================
   PROFILE FIELD
============================ */

function ProfileField({
  label,
  icon,
  name,
  value,
  editValue,
  isEditing,
  onChange,
  type = "text",
  selectOptions,
  fullWidth,
  prefix
}) {

  return (

    <div
      style={{
        gridColumn:
          fullWidth ? "1 / -1" : "auto"
      }}
    >

      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontSize: "14px",
          fontWeight: "600",
          color: "#374151"
        }}
      >
        {label}
      </label>

      {isEditing ? (

        selectOptions ? (

          <select
            name={name}
            value={editValue || ""}
            onChange={onChange}
            style={inputStyle}
          >

            <option value="">
              Select {label}
            </option>

            {selectOptions.map((option) => (

              <option
                key={option}
                value={option}
              >
                {option}
              </option>

            ))}

          </select>

        ) : (

          <div
            style={{
              position: "relative"
            }}
          >

            {prefix && (

              <span
                style={{
                  position: "absolute",
                  left: "13px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  color: "#6b7280"
                }}
              >
                {prefix}
              </span>

            )}

            <input
              type={type}
              name={name}
              value={editValue || ""}
              onChange={onChange}
              style={{
                ...inputStyle,
                paddingLeft:
                  prefix ? "30px" : "12px"
              }}
            />

          </div>

        )

      ) : (

        <div
          style={{
            minHeight: "42px",
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "10px 12px",
            background: "#f8fafc",
            borderRadius: "7px",
            color: value
              ? "#374151"
              : "#9ca3af",
            fontSize: "14px"
          }}
        >

          <span
            style={{
              color: "#64748b"
            }}
          >
            {icon}
          </span>

          {displayFieldValue(value)}

        </div>

      )}

    </div>

  );

}


function displayFieldValue(value) {

  return value &&
    String(value).trim() !== ""
    ? value
    : "Not provided";

}


const inputStyle = {

  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "7px",
  outline: "none",
  fontSize: "14px",
  color: "#374151",
  background: "white"

};


export default CustomerProfile;