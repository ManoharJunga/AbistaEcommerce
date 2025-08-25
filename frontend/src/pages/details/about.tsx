// src/pages/AboutPage.tsx
import { useState, useEffect } from "react";
import axios from "axios";

interface Stat {
  icon: string;
  value: string;
  label: string;
}

interface Value {
  title: string;
  description: string;
}

interface About {
  title: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyImage: string;
  stats: Stat[];
  valuesTitle: string;
  values: Value[];
}

const API_URL = "http://localhost:8000/api/about";

export default function AboutPage() {
  const [formData, setFormData] = useState<About>({
    title: "",
    storyTitle: "Our Story",
    storyParagraphs: [""],
    storyImage: "",
    stats: [{ icon: "", value: "", label: "" }],
    valuesTitle: "Our Values",
    values: [{ title: "", description: "" }],
  });

  const [previewData, setPreviewData] = useState<About | null>(null);

  // Fetch existing about details
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setPreviewData(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle text inputs (top-level)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Story paragraphs handling
  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...formData.storyParagraphs];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, storyParagraphs: updated }));
  };

  const addParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      storyParagraphs: [...prev.storyParagraphs, ""],
    }));
  };

  const removeParagraph = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      storyParagraphs: prev.storyParagraphs.filter((_, i) => i !== index),
    }));
  };

  // Handle stats change
  const handleStatChange = (
    index: number,
    field: keyof Stat,
    value: string
  ) => {
    const updatedStats = [...formData.stats];
    updatedStats[index][field] = value;
    setFormData((prev) => ({ ...prev, stats: updatedStats }));
  };

  const addStat = () => {
    setFormData((prev) => ({
      ...prev,
      stats: [...prev.stats, { icon: "", value: "", label: "" }],
    }));
  };

  const removeStat = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  };

  // Handle values change
  const handleValueChange = (
    index: number,
    field: keyof Value,
    value: string
  ) => {
    const updatedValues = [...formData.values];
    updatedValues[index][field] = value;
    setFormData((prev) => ({ ...prev, values: updatedValues }));
  };

  const addValue = () => {
    setFormData((prev) => ({
      ...prev,
      values: [...prev.values, { title: "", description: "" }],
    }));
  };

  const removeValue = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, formData);
      setPreviewData(res.data);
      alert("About saved successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Error saving about ❌");
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold">Add / Update About</h2>

        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="storyTitle"
          placeholder="Story Title"
          value={formData.storyTitle}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Story Paragraphs */}
        <h3 className="font-semibold">Story Paragraphs</h3>
        {formData.storyParagraphs.map((p, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <textarea
              placeholder={`Paragraph ${i + 1}`}
              value={p}
              onChange={(e) => handleParagraphChange(i, e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={() => removeParagraph(i)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addParagraph}
          className="bg-green-600 text-white px-3 py-1 rounded w-fit"
        >
          + Add Paragraph
        </button>

        <input
          name="storyImage"
          placeholder="Story Image URL"
          value={formData.storyImage}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Stats Section */}
        <h3 className="font-semibold">Stats</h3>
        {formData.stats.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <input
              placeholder="Icon"
              value={s.icon}
              onChange={(e) => handleStatChange(i, "icon", e.target.value)}
              className="border p-2 rounded w-1/3"
            />
            <input
              placeholder="Value"
              value={s.value}
              onChange={(e) => handleStatChange(i, "value", e.target.value)}
              className="border p-2 rounded w-1/3"
            />
            <input
              placeholder="Label"
              value={s.label}
              onChange={(e) => handleStatChange(i, "label", e.target.value)}
              className="border p-2 rounded w-1/3"
            />
            <button
              type="button"
              onClick={() => removeStat(i)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addStat}
          className="bg-green-600 text-white px-3 py-1 rounded w-fit"
        >
          + Add Stat
        </button>

        {/* Values Section */}
        <input
          name="valuesTitle"
          placeholder="Values Title"
          value={formData.valuesTitle}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {formData.values.map((v, i) => (
          <div key={i} className="flex flex-col gap-2 mb-2 relative border p-3 rounded">
            <input
              placeholder="Value Title"
              value={v.title}
              onChange={(e) => handleValueChange(i, "title", e.target.value)}
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Value Description"
              value={v.description}
              onChange={(e) =>
                handleValueChange(i, "description", e.target.value)
              }
              className="border p-2 rounded"
            />
            <button
              type="button"
              onClick={() => removeValue(i)}
              className="bg-red-500 text-white px-2 py-1 rounded self-end"
            >
              ✕ Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addValue}
          className="bg-green-600 text-white px-3 py-1 rounded w-fit"
        >
          + Add Value
        </button>

        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4"
        >
          Save About
        </button>
      </form>

      {/* Preview Section */}
      {previewData && (
        <div className="bg-gray-50 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-2">{previewData.title}</h2>

          <h3 className="text-xl font-semibold">{previewData.storyTitle}</h3>
          <div className="flex gap-4 mt-2">
            {previewData.storyImage && (
              <img
                src={previewData.storyImage}
                alt="story"
                className="w-48 h-32 object-cover rounded"
              />
            )}
            <ul className="list-disc ml-6">
              {previewData.storyParagraphs.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {previewData.stats.map((s, i) => (
              <div
                key={i}
                className="p-4 border rounded-lg text-center bg-white shadow"
              >
                <div className="text-2xl">{s.icon}</div>
                <p className="font-bold">{s.value}</p>
                <p className="text-sm text-gray-600">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Values */}
          <h3 className="text-xl font-semibold mt-6">
            {previewData.valuesTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {previewData.values.map((v, i) => (
              <div key={i} className="p-4 border rounded-lg bg-white shadow">
                <h4 className="font-bold">{v.title}</h4>
                <p>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
