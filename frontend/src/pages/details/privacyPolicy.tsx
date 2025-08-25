import { useState, useEffect } from "react";
import axios from "axios";

interface PrivacyPolicy {
  _id?: string; // ✅ keep track of existing record
  lastUpdated: string;
  introduction: string;
  informationWeCollect: {
    personalInformation: string;
    usageInformation: string;
    cookiesAndTracking: string;
  };
  howWeUseInfo: string[];
  informationSharing: string[];
  dataSecurity: string;
  yourRights: string[];
  cookiesPolicy: {
    essentialCookies: string;
    analyticsCookies: string;
    marketingCookies: string;
  };
  contactUs: {
    email: string;
    phone: string;
    address: string;
  };
}

export default function PrivacyPolicyForm() {
  const [formData, setFormData] = useState<PrivacyPolicy>({
    lastUpdated: "",
    introduction: "Privacy Policy",
    informationWeCollect: {
      personalInformation: "",
      usageInformation: "",
      cookiesAndTracking: "",
    },
    howWeUseInfo: [],
    informationSharing: [],
    dataSecurity: "",
    yourRights: [],
    cookiesPolicy: {
      essentialCookies: "",
      analyticsCookies: "",
      marketingCookies: "",
    },
    contactUs: {
      email: "",
      phone: "",
      address: "",
    },
  });

  // ✅ Fetch existing policy on mount
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/privacy-policy");
        if (res.data) {
          setFormData(res.data); // populate form
        }
      } catch (error) {
        console.error("No existing policy found, creating new.");
      }
    };
    fetchPolicy();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    path?: string[]
  ) => {
    const { name, value } = e.target;

    if (path) {
      setFormData((prev) => {
        const updated = { ...prev };
        let obj: any = updated;
        for (let i = 0; i < path.length - 1; i++) {
          obj = obj[path[i]];
        }
        obj[path[path.length - 1]] = value;
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: "howWeUseInfo" | "informationSharing" | "yourRights"
  ) => {
    const value = e.target.value.split("\n").filter((line) => line.trim() !== "");
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting payload:", formData);

    try {
      if (formData._id) {
        // ✅ Update existing policy
        await axios.put(
          `http://localhost:8000/api/privacy-policy/${formData._id}`,
          formData
        );
        alert("Privacy Policy updated successfully!");
      } else {
        // ✅ Create first-time policy
        const res = await axios.post("http://localhost:8000/api/privacy-policy", formData);
        setFormData(res.data); // Save returned _id
        alert("Privacy Policy created successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save Privacy Policy.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-8">
        <input
          type="date"
          name="lastUpdated"
          value={formData.lastUpdated?.slice(0, 10) || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <textarea
          name="introduction"
          placeholder="Introduction"
          value={formData.introduction}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <h3 className="font-semibold mt-4">Information We Collect</h3>
        <textarea
          placeholder="Personal Information"
          value={formData.informationWeCollect.personalInformation}
          onChange={(e) =>
            handleChange(e, ["informationWeCollect", "personalInformation"])
          }
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Usage Information"
          value={formData.informationWeCollect.usageInformation}
          onChange={(e) =>
            handleChange(e, ["informationWeCollect", "usageInformation"])
          }
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Cookies and Tracking"
          value={formData.informationWeCollect.cookiesAndTracking}
          onChange={(e) =>
            handleChange(e, ["informationWeCollect", "cookiesAndTracking"])
          }
          className="border p-2 rounded"
        />

        <textarea
          placeholder="How We Use Your Information (one per line)"
          value={formData.howWeUseInfo.join("\n")}
          onChange={(e) => handleArrayChange(e, "howWeUseInfo")}
          className="border p-2 rounded"
        />

        <textarea
          placeholder="Information Sharing (one per line)"
          value={formData.informationSharing.join("\n")}
          onChange={(e) => handleArrayChange(e, "informationSharing")}
          className="border p-2 rounded"
        />

        <textarea
          placeholder="Data Security"
          value={formData.dataSecurity}
          onChange={handleChange}
          name="dataSecurity"
          className="border p-2 rounded"
        />

        <textarea
          placeholder="Your Rights (one per line)"
          value={formData.yourRights.join("\n")}
          onChange={(e) => handleArrayChange(e, "yourRights")}
          className="border p-2 rounded"
        />

        <h3 className="font-semibold mt-4">Cookies Policy</h3>
        <textarea
          placeholder="Essential Cookies"
          value={formData.cookiesPolicy.essentialCookies}
          onChange={(e) => handleChange(e, ["cookiesPolicy", "essentialCookies"])}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Analytics Cookies"
          value={formData.cookiesPolicy.analyticsCookies}
          onChange={(e) => handleChange(e, ["cookiesPolicy", "analyticsCookies"])}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Marketing Cookies"
          value={formData.cookiesPolicy.marketingCookies}
          onChange={(e) => handleChange(e, ["cookiesPolicy", "marketingCookies"])}
          className="border p-2 rounded"
        />

        <h3 className="font-semibold mt-4">Contact Us</h3>
        <input
          type="email"
          placeholder="Email"
          value={formData.contactUs.email}
          onChange={(e) => handleChange(e, ["contactUs", "email"])}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.contactUs.phone}
          onChange={(e) => handleChange(e, ["contactUs", "phone"])}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Address"
          value={formData.contactUs.address}
          onChange={(e) => handleChange(e, ["contactUs", "address"])}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </form>

      {/* Preview */}
      <div className="bg-gray-100 p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-2">{formData.introduction}</h2>
        <p className="text-sm text-gray-600 mb-4">
          Last updated: {formData.lastUpdated || "N/A"}
        </p>

        <h3 className="font-semibold">Information We Collect</h3>
        <p>{formData.informationWeCollect.personalInformation}</p>
        <p>{formData.informationWeCollect.usageInformation}</p>
        <p>{formData.informationWeCollect.cookiesAndTracking}</p>

        <h3 className="font-semibold mt-4">How We Use Your Information</h3>
        <ul className="list-disc pl-6">
          {formData.howWeUseInfo.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h3 className="font-semibold mt-4">Information Sharing</h3>
        <ul className="list-disc pl-6">
          {formData.informationSharing.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h3 className="font-semibold mt-4">Data Security</h3>
        <p>{formData.dataSecurity}</p>

        <h3 className="font-semibold mt-4">Your Rights</h3>
        <ul className="list-disc pl-6">
          {formData.yourRights.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h3 className="font-semibold mt-4">Cookies Policy</h3>
        <p><b>Essential:</b> {formData.cookiesPolicy.essentialCookies}</p>
        <p><b>Analytics:</b> {formData.cookiesPolicy.analyticsCookies}</p>
        <p><b>Marketing:</b> {formData.cookiesPolicy.marketingCookies}</p>

        <h3 className="font-semibold mt-4">Contact Us</h3>
        <p>Email: {formData.contactUs.email}</p>
        <p>Phone: {formData.contactUs.phone}</p>
        <p>Address: {formData.contactUs.address}</p>
      </div>
    </div>
  );
}
