import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Box, Chip } from "@mui/material";

interface Option {
  _id: string;
  name: string;
}

const MultiSelect: React.FC<{
  label: string;
  options: Option[];
  value: string[];
  setValue: (val: string[]) => void;
}> = ({ label, options, value, setValue }) => (
  <FormControl fullWidth>
    <InputLabel>{label}</InputLabel>
    <Select
      multiple
      value={value}
      onChange={(e) => setValue(e.target.value as string[])}
      renderValue={(selected) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {(selected as string[]).map((val) => {
            const opt = options.find((o) => o._id === val);
            return <Chip key={val} label={opt?.name || val} />;
          })}
        </Box>
      )}
    >
      {options.map((opt) => (
        <MenuItem key={opt._id} value={opt._id}>
          {opt.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default MultiSelect;
